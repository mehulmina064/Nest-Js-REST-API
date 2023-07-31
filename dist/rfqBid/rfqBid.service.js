"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./../mail/mail.service");
const whatsapp_service_1 = require("./../mail/whatsapp.service");
const fetch = require('node-fetch');
var request = require('request');
const http = require('https');
const { google } = require('googleapis');
var cron = require('node-cron');
const token_entity_1 = require("./../sms/token.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const rfqBid_entity_1 = require("./rfqBid.entity");
const common_3 = require("@nestjs/common");
const json = {};
let rfqBidService = class rfqBidService {
    constructor(mailService, whatsappService, zohoTokenRepository, rfqBidRepository) {
        this.mailService = mailService;
        this.whatsappService = whatsappService;
        this.zohoTokenRepository = zohoTokenRepository;
        this.rfqBidRepository = rfqBidRepository;
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidRepository.find();
        });
    }
    saveRfqBid(rfqBid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (rfqBid.rfqBidNo) {
                throw new common_3.HttpException({
                    status: common_3.HttpStatus.FORBIDDEN,
                    error: 'FORBIDDEN',
                    message: "You are not able to set RFQ-Bid-NO"
                }, common_3.HttpStatus.FORBIDDEN);
            }
            if (!rfqBid.rfqBidComment) {
                rfqBid.rfqBidComment = "None";
            }
            let find = yield this.rfqBidRepository.findOne({ where: { rfqId: rfqBid.rfqId } });
            if (find) {
                rfqBid.rfqBidNo = find.rfqBidNo + 1;
                console.log("in rfqbid save", rfqBid);
                let data = yield this.saveCrmRfqBid(rfqBid);
                if (data) {
                    return yield this.rfqBidRepository.save(rfqBid);
                }
                else {
                    throw new common_3.HttpException({
                        status: common_3.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "Not able to set RFQ-Bid To Crm"
                    }, common_3.HttpStatus.EXPECTATION_FAILED);
                }
            }
            else {
                console.log("new rfq bid");
                rfqBid.rfqBidNo = 1;
                let data = yield this.saveCrmRfqBid(rfqBid);
                if (data) {
                    return yield this.rfqBidRepository.save(rfqBid);
                }
                else {
                    throw new common_3.HttpException({
                        status: common_3.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "Not able to set RFQ-Bid To Crm"
                    }, common_3.HttpStatus.EXPECTATION_FAILED);
                }
            }
        });
    }
    sheetBidSave(rfq, rfqBid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.getOneCrmRfqDetails(rfqBid.rfqId);
            if (data && data.length > 0) {
                var url = data[0].GSheet;
                if (url) {
                    url = url.match(/\/d\/(.+)\//);
                    url = url[1];
                    let rfqSheetDetails = yield this.saveRfqSheetDetails(url, rfqBid);
                    return { rfqSheetDetails: rfqSheetDetails };
                }
                else {
                    throw new common_2.NotFoundException(`RFQ ${data[0].Deal_Name} GSheet ID not found`);
                }
            }
            else {
                throw new common_2.NotFoundException(`RFQ with this id not found`);
            }
        });
    }
    mapResearchData(data, sheetId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const auth = new google.auth.GoogleAuth({
                keyFile: `./credentials.json`,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = sheetId;
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k = yield googlesheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId,
                range: 'Research (Digital)',
            });
            let keys = {};
            let productByRows = {};
            const rows = k.data.values;
            let m = false;
            for (let i = 0; i < rows.length; i++) {
                var row = rows[i];
                if ("#" == row[0]) {
                    keys['manufacturerDetails'] = i;
                    var row1 = rows[i - 1];
                    var row2 = rows[i + 1];
                    row1.map((ColumnName, index) => {
                        ColumnName = ColumnName.replace(/\s+/g, "_");
                        if (index > 1 && ColumnName) {
                            if (!keys[ColumnName]) {
                                keys[ColumnName] = index;
                            }
                        }
                        return ColumnName;
                    });
                    row2.map((ColumnName, index) => {
                        ColumnName = ColumnName.replace(/\s+/g, "_");
                        if (index > 1 && ColumnName) {
                            if (!keys[ColumnName]) {
                                keys[ColumnName] = index;
                            }
                        }
                        return ColumnName;
                    });
                    row.map((ColumnName, index) => {
                        ColumnName = ColumnName.replace(/\s+/g, "_");
                        if (index && ColumnName) {
                            if (!keys[ColumnName]) {
                                keys[ColumnName] = index;
                            }
                        }
                        return ColumnName;
                    });
                    i++;
                    m = true;
                }
                if (m) {
                    for (let item of data.lineItems) {
                        if (item.productName == row[1]) {
                            productByRows[item.productName] = i;
                        }
                    }
                }
            }
            for (let row of rows) {
                if (row.length < (keys.GST + 1)) {
                    for (let j = row.length; j < keys.GST; j++) {
                        row.push(" ");
                    }
                }
            }
            let itemCount = data.lineItems.length;
            rows[keys.manufacturerDetails - 1].push("|", "GST", "Phone", "Comment");
            rows[keys.manufacturerDetails].push(data.manufactureGstNo, data.manufacturePhone ? data.manufacturePhone : "NA", data.rfqBidComment ? data.rfqBidComment : "NA", "|");
            rows[keys.manufacturerDetails + 1].push("|", "MOQ", "Price", "_");
            for (let item of data.lineItems) {
                if (itemCount) {
                    rows[productByRows[item.productName]].push(item.moq ? item.moq : "NA", item.price ? item.price : "NA", " ", "|");
                    itemCount = itemCount - 1;
                }
            }
            return rows;
        });
    }
    saveRfqSheetDetails(sheetId, rfqBid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.mapResearchData(rfqBid, sheetId);
            if (data) {
                const auth = new google.auth.GoogleAuth({
                    keyFile: "./credentials.json",
                    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
                });
                const client = yield auth.getClient();
                const spreadsheetId = sheetId;
                const googleSheets = google.sheets({ version: 'v4', auth: client });
                yield googleSheets.spreadsheets.values.clear({
                    auth,
                    spreadsheetId,
                    range: 'Research (Digital)',
                });
                let so = yield googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: 'Research (Digital)',
                    valueInputOption: 'RAW',
                    resource: {
                        values: data,
                    },
                });
                return so;
            }
            else {
                throw new common_3.HttpException({
                    status: common_3.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Sheet details Error"
                }, common_3.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    saveCrmRfqBid(rfqBid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let rfqName = rfqBid.rfqId.substring(11);
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            let line_items = Array.prototype.map.call(rfqBid.lineItems, function (item) { return `${item.productName ? item.productName : "NA"}[Q-${item.moq ? item.moq : "NA"}:P-${item.price ? item.price : "NA"}:U-${item.unit ? item.unit : "NA"}]`; }).join("|---*---|");
            today = yyyy + '-' + mm + '-' + dd;
            let crmRfqBid = {
                Name: `IN/RFQ-BID-${rfqName}${rfqBid.rfqBidNo}`,
                RFQ_ID: { id: rfqBid.rfqId },
                RFQ_Bid_Date: today,
                RFQ_Bid_No: `${rfqBid.rfqBidNo}`,
                GST_Number: rfqBid.manufactureGstNo,
                Manufacturer_Email: rfqBid.manufactureEmail ? rfqBid.manufactureEmail : "NA@NA.com",
                Manufacturer_Phone: rfqBid.manufacturePhone,
                Line_Items: line_items,
                Comment: rfqBid.rfqBidComment ? rfqBid.rfqBidComment : "NA"
            };
            let token = yield this.zohoCrmToken();
            let out = [];
            out.push(crmRfqBid);
            let res = yield fetch(`https://www.zohoapis.in/crm/v2/RFQ_BID`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Content-Length': '904',
                    'Accept': '*/*',
                },
                body: JSON.stringify({ data: out })
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            console.log('Post Req Of Crm', out.data[0].code, crmRfqBid);
            if (out.data[0].code == 'SUCCESS') {
                return out;
            }
            else {
                return false;
            }
        });
    }
    zohoCrmToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('63319be175c56440fb23e962');
            let token = zohoToken.token;
            let kill;
            let res = yield fetch(`https://www.zohoapis.in/crm/v2/Deals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.status) {
                token = yield this.newZohoCrmToken();
                return token;
            }
            return token;
        });
    }
    newZohoCrmToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('63319be175c56440fb23e962');
            let zoho = yield fetch('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.bba0cbaa752d5db9ce7ebaef7c36b08c.e9b334fe092cf9086374ca38ede24ab0',
                   'client_id': '1000.'
                    'client_secret': '52a031a706f9b690694f135702ded10f7af1a44baf',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            zohoToken.token = token;
            let kill = yield this.zohoTokenRepository.save(zohoToken);
            return token;
        });
    }
    getAllCrmRfqDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoCrmToken();
            let kill;
            let res = yield fetch(`https://www.zohoapis.in/crm/v2/Deals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.status) {
                return "error";
            }
            return kill.data;
        });
    }
    getAllCrmRfqBidsDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoCrmToken();
            let out;
            let res = yield fetch(`https://www.zohoapis.in/crm/v2/RFQ_BID`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            if (out) {
                return out.data;
            }
            else {
                return [];
            }
        });
    }
    getOneCrmRfqBidsDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(id);
            let token = yield this.zohoCrmToken();
            let out;
            let res = yield fetch(`https://www.zohoapis.in/crm/v2/RFQ_BID/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            console.log('rescontact', out);
            if (out) {
                return out.data;
            }
            else {
                return false;
            }
        });
    }
    getOneCrmRfqDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoCrmToken();
            let kill;
            let out;
            let res = yield fetch(`https://www.zohoapis.in/crm/v2/Deals/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            if (out) {
                return out.data;
            }
            else {
                return false;
            }
        });
    }
    getAllRfqDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.getAllCrmRfqDetails();
            return data;
            let sheetdata = [];
            yield data.forEach((i) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var url = i.GSheet;
                if (url) {
                    url = url.match(/\/d\/(.+)\//);
                    sheetdata.push(yield this.getRfqDetails(url[1]));
                }
                else {
                    sheetdata.push({ id: i.id, rfqName: i.Deal_Name, message: "Gsheet Id Not Found" });
                }
            }));
            return sheetdata;
        });
    }
    getAllRfqBidsDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.getAllCrmRfqBidsDetails();
            if (data)
                return { statusCode: 200, message: "succes", data: data };
            else
                throw new common_2.NotFoundException(`No Rfq-bid not found`);
        });
    }
    getOneRfqBidsDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.getOneCrmRfqBidsDetails(id);
            if (data)
                return { statusCode: 200, message: "succes", data: data };
            else
                throw new common_2.NotFoundException(` Rfq-bid not found`);
        });
    }
    getRfqDetails(rfqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let range = "RFQ (BD)";
            return yield this.getRfqSheetDetails(rfqId, range);
        });
    }
    RfqDetails(rfqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.getOneCrmRfqDetails(rfqId);
            if (data && data.length > 0) {
                var url = data[0].GSheet;
                if (url) {
                    url = url.match(/\/d\/(.+)\//);
                    let rfqName = rfqId.substring(11);
                    let rfq = {
                        "name": `IN/RFQ-${rfqName}`,
                        "id": data[0].id,
                        "owner": data[0].Owner,
                        "description": data[0].Description,
                        "lineItems": yield this.getRfqDetails(url[1])
                    };
                    return { statusCode: 200, message: "succes", data: rfq };
                }
                else {
                    throw new common_2.NotFoundException(`RFQ ${data[0].Deal_Name} GSheet ID not found`);
                }
            }
            else {
                throw new common_2.NotFoundException(`RFQ with this id not found`);
            }
        });
    }
    getAnySheetDetails(sheetId, sheetRange) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const auth = new google.auth.GoogleAuth({
                keyFile: `./credentials.json`,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = sheetId;
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k = yield googlesheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId,
                range: sheetRange,
            });
            let out = [];
            let no = 0;
            let rowObject = [];
            const rows = k.data.values;
            for (const row of rows) {
                if ("#" == row[0]) {
                    row.map((ColumnName, index) => {
                        ColumnName = ColumnName.replace(/\s+/g, "_");
                        if (index) {
                            rowObject.push({ "index": index, "ColumnName": ColumnName });
                        }
                        return ColumnName;
                    });
                    break;
                }
            }
            for (const row of rows) {
                if ("#" == row[0]) {
                    no = 1;
                }
                else if (no) {
                    let dataObj = {
                        no: no
                    };
                    for (const obj of rowObject) {
                        dataObj[obj.ColumnName] = row[obj.index] ? row[obj.index] : "";
                    }
                    out.push(dataObj);
                    no++;
                }
            }
            return out;
        });
    }
    getManufacturersSheetDetails(sheetId, sheetRange) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const auth = new google.auth.GoogleAuth({
                keyFile: "./credentials.json",
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = sheetId;
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k = yield googlesheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId,
                range: sheetRange,
            });
            let out = [];
            let no = 0;
            const rows = k.data.values;
            let companyName = 0;
            let poc = 0;
            let category = 0;
            let pinCode = 0;
            let email = 0;
            let mobileNo = 0;
            let state = 0;
            let city = 0;
            let typeOfBusiness = 0;
            let address = 0;
            for (const row of rows) {
                if ("#" == row[0]) {
                    companyName = row.indexOf('Company Name');
                    poc = row.indexOf('POC');
                    category = row.indexOf('Fnb Packaging');
                    pinCode = row.indexOf('Pincode');
                    email = row.indexOf('Email');
                    mobileNo = row.indexOf('MobileNo.');
                    state = row.indexOf('State');
                    city = row.indexOf('City');
                    typeOfBusiness = row.indexOf('Type of Business');
                    address = row.indexOf('Address');
                    no = 1;
                }
                else if ((row[email] && no && row[email].indexOf('@') > -1)) {
                    out.push({ 'manufacturerNo': no, 'companyName': row[companyName] ? row[companyName] : '', 'poc': row[poc] ? row[poc] : '', 'category': row[category] ? row[category] : '', 'pinCode': row[pinCode] ? row[pinCode] : '', 'email': row[email] ? row[email] : '', 'mobileNo': row[mobileNo] ? row[mobileNo] : '', 'state': row[state] ? row[state] : '', 'city': row[city] ? row[city] : '', 'typeOfBusiness': row[typeOfBusiness] ? row[typeOfBusiness] : '', 'address': row[address] ? row[address] : '' });
                    no++;
                }
            }
            return out;
        });
    }
    getRfqSheetDetails(sheetId, sheetRange) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const auth = new google.auth.GoogleAuth({
                keyFile: "./credentials.json",
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = sheetId;
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k = yield googlesheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId,
                range: sheetRange,
            });
            let out = [];
            let no = 0;
            const rows = k.data.values;
            let productName = 0;
            let rfqQuantity = 0;
            let category = 0;
            let units = 0;
            let specifications = 0;
            let targetPrice = 0;
            let salesComment = 0;
            let opsRemark = 0;
            for (const row of rows) {
                if ("#" == row[0]) {
                    productName = row.indexOf('Product Name');
                    rfqQuantity = row.indexOf('RFQ Quantity');
                    units = row.indexOf('Units');
                    specifications = row.indexOf('Specifications');
                    category = row.indexOf('Category');
                    targetPrice = row.indexOf('Target Price');
                    salesComment = row.indexOf('Sales Comment');
                    opsRemark = row.indexOf('Ops Remark');
                    no = 1;
                }
                else if (no && row[productName]) {
                    out.push({ 'productNo': no, 'productName': row[productName] ? row[productName] : '', 'rfqQuantity': row[rfqQuantity] ? row[rfqQuantity] : '', 'units': row[units] ? row[units] : '', 'specifications': row[specifications] ? row[specifications] : '', 'category': row[category] ? row[category] : '', 'targetPrice': row[targetPrice] ? row[targetPrice] : '', 'salesComment': row[salesComment] ? row[salesComment] : '', 'opsRemark': row[opsRemark] ? row[opsRemark] : '' });
                    no++;
                }
            }
            return out;
        });
    }
    getManufacturersDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            if (manufactures)
                return { statusCode: 200, message: "succes", data: manufactures };
            else
                throw new common_2.NotFoundException(`No Data found`);
        });
    }
    rfqSendToManufacturers(lineItems) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            let rfqDetails = [];
            for (const item of lineItems) {
                let found = rfqDetails.find(element => element.category === item.category);
                if (found) {
                    found.lineItems.push(item);
                }
                else {
                    rfqDetails.push({ 'category': item.category, 'lineItems': [item], 'manufactureEmail': [], 'count': 0 });
                }
            }
            for (const item of rfqDetails) {
                for (const manufacture of manufactures) {
                    if (item.category == manufacture.category) {
                        item.manufactureEmail.push(manufacture.email);
                        item.count++;
                    }
                }
            }
            return rfqDetails;
        });
    }
    sendMail(itemData, rfqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var mails = itemData.manufactureEmail;
            itemData.arrayMails = [];
            let count = itemData.count;
            for (let i; count > 0; i++) {
                if (count / 95 > 1) {
                    count = count - 94;
                    let mail1 = mails.splice(0, 94);
                    itemData.arrayMails.push(mail1);
                }
                else {
                    count = 0;
                    itemData.arrayMails.push(mails);
                }
            }
            let link = "https://prodo.in/bid/" + rfqId;
            let subject = 'New Rfq-Bid Created Check Details Below ';
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            let mailOutput = [];
            for (let emails of itemData.arrayMails) {
                let bcc = emails;
                bcc.push("mehul.mina@prodo.in");
                let mailTrigger = {
                    from: 'Team Prodo',
                    bcc: bcc,
                    subject: subject,
                    template: 'rfqBidTemplate',
                    templatevars: {
                        itemDetails: itemData.lineItems,
                        date: today,
                        rfqLink: link
                    },
                };
                yield this.mailService.sendBulkMailToManufacturer(mailTrigger);
                mailOutput.push("Mail sent");
            }
            return mailOutput;
        });
    }
    sendMailManufacturersSurvery() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            let data = [];
            let m = 1;
            for (const itemData of manufactures) {
                if (itemData.manufacturerNo % 95 > 0) {
                    let found = data.find(element => element.id === m);
                    if (found) {
                        found.emails.push(itemData.email);
                    }
                    else {
                        data.push({ id: m, emails: [itemData.email] });
                    }
                }
                else {
                    m++;
                    let found = data.find(element => element.id === m);
                    if (found) {
                        found.emails.push(itemData.email);
                    }
                    else {
                        data.push({ id: m, emails: [itemData.email] });
                    }
                }
            }
            let subject = ' Greetings From Prodo!! ';
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            let mailOutput = [];
            for (const itemData of data) {
                let bcc = itemData.emails;
                let mailTrigger = {
                    from: 'Team Prodo',
                    bcc: bcc,
                    subject: subject,
                    template: 'feedbackSurvey',
                    templatevars: {},
                };
                yield this.mailService.sendBulkMailToManufacturer(mailTrigger);
                mailOutput.push("Mail sent");
            }
            return mailOutput;
        });
    }
    sendMailManufacturersWithTemplate(templateName, subject) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            let data = [];
            let m = 1;
            for (const itemData of manufactures) {
                if (itemData.manufacturerNo % 95 > 0) {
                    let found = data.find(element => element.id === m);
                    if (found) {
                        found.emails.push(itemData.email);
                    }
                    else {
                        data.push({ id: m, emails: [itemData.email] });
                    }
                }
                else {
                    m++;
                    let found = data.find(element => element.id === m);
                    if (found) {
                        found.emails.push(itemData.email);
                    }
                    else {
                        data.push({ id: m, emails: [itemData.email] });
                    }
                }
            }
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            let mailOutput = [];
            for (const itemData of data) {
                let bcc = itemData.emails;
                let mailTrigger = {
                    from: 'Team Prodo',
                    bcc: bcc,
                    subject: subject,
                    template: templateName,
                    templatevars: {},
                };
                yield this.mailService.sendBulkMailToManufacturer(mailTrigger);
                mailOutput.push("Mail sent");
            }
            return mailOutput;
        });
    }
    sendWhatsappMessaageManufacturersWithTemplate(templateName, image_link) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            let data = [];
            for (const itemData of manufactures) {
                if (itemData.mobileNo) {
                    let message = yield this.whatsappService.sendTemplateMessageManufacturers(itemData.mobileNo, templateName, image_link);
                    data.push(message);
                }
            }
            return data;
        });
    }
    sendWhatsappBid(rfqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            let out = [];
            for (const itemData of manufactures) {
                if (itemData.mobileNo) {
                    let w = yield this.whatsappService.rfqBidMessage("there", itemData.mobileNo, "rfq_bid_message1", rfqId);
                    out.push(w);
                }
            }
            return out;
        });
    }
    sendWhatsappInstruction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufactures = yield this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ", "DATA for RFQ System");
            let out = [];
            for (const itemData of manufactures) {
                if (itemData.mobileNo) {
                    let document_link = "https://drive.google.com/uc?export=download&id=1AzNfxnSXoZW-15Ck1yZ0vX2IqWwaYHV1";
                    let w1 = yield this.whatsappService.sendInstructions(itemData.mobileNo, document_link);
                    out.push(w1);
                }
            }
            return out;
        });
    }
};
rfqBidService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(2, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__param(3, typeorm_1.InjectRepository(rfqBid_entity_1.rfqBid)),
    tslib_1.__metadata("design:paramtypes", [mail_service_1.MailService,
        whatsapp_service_1.WhatsappService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], rfqBidService);
exports.rfqBidService = rfqBidService;
//# sourceMappingURL=rfqBid.service.js.map