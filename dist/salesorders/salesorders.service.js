"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const fetch = require('node-fetch');
var request = require('request');
const http = require('https');
const { google } = require('googleapis');
var cron = require('node-cron');
const axios_1 = require("axios");
const common_2 = require("@nestjs/common");
const url_1 = require("url");
let SalesordersService = class SalesordersService {
    convertData(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 1; i < array.length; i++) {
                array[i] = yield this.convert(array[i]);
            }
            return array;
        });
    }
    convert(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            array = array.split(`$`);
            let data = {};
            data[array[0]] = array[1];
            array = data;
            return array;
        });
    }
    getXmlValue(str) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reg = /(?<=<rows>)(.*)(?=<\/rows>)/s;
            let data = [...str.match(reg)];
            let array = data[0].toString();
            array = array.replace(/<row>/g, '');
            array = array.split("</row>").join("");
            array = array.split("</column>").join("");
            array = array.split("\">").join("$");
            array = array.replace(/\n/g, '');
            array = array.split(`<column name="`);
            array = yield this.convertData(array);
            return array;
        });
    }
    ;
    renameKeys(obj, newKeys) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keyValues = Object.keys(obj).map(key => {
                const newKey = newKeys[key] || key;
                return { [newKey]: obj[key] };
            });
            return Object.assign({}, ...keyValues);
        });
    }
    purchaseOrderItemsDataMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                'Item ID': [],
                'Item Price (BCY)': [],
                'Item Name': [],
                'Quantity': [],
                'Tax Amount': [],
                'Total (BCY)': [],
                'Sub Total (BCY)': [],
                'Purchase Order ID': [],
                'Product ID': [],
                'Warehouse ID': [],
                'Currency Code': [],
                'Account ID': [],
                'Product Category': [],
                'HSN/SAC': [],
                'Destination Of Supply': [],
                'Tax Exemption ID': [],
                'Item Price (FCY)': [],
                'Item Description': [],
                'Usage unit': [],
                'Tax ID': [],
                'FCY Tax Amount': [],
                'Source': [],
                'Total (FCY)': [],
                'Sub Total (FCY)': [],
                'Last Modified Time': [],
                'Created Time': [],
                'Quantity Billed': [],
                'Quantity Cancelled': [],
                'Project ID': [],
                'SO ItemID': [],
                'PriceList ID': [],
                'Quantity Received': [],
                'Non Receive Quantity': [],
            };
            for (let r = 0; r < array.length; r++) {
                let keys = Object.keys(tb);
                let arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : 'NA');
                    }
                }
            }
            return yield this.mapForSheets(tb);
        });
    }
    purchaseOrderDataMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                'Purchase Order ID': [],
                'Purchase Order Number': [],
                'Purchase Order Date': [],
                'Delivery Date': [],
                'Purchase Order Status': [],
                'Total (BCY)': [],
                'Sub Total (BCY)': [],
                'Created Time': [],
                'Attention Content': [],
                'Expected Delivery Date': [],
                'Currency Code': [],
                'Date': [],
                'Sales order ID': [],
                'Last Modified Time': [],
                'Reference number': [],
                'GST Treatment': [],
                'GSTIN': [],
                'Address ID': [],
                'Exchange Rate': [],
                'Delivery Instructions': [],
                'Terms &amp; Conditions': [],
                'Shipment preference': [],
                'Source': [],
                'Total (FCY)': [],
                'Sub Total (FCY)': [],
                'Created By': [],
                'Modified By': [],
                'PriceList ID': [],
                'Billed Status': [],
                'Payment Terms Label': [],
                'Branch ID': [],
                'CRM Reference ID': [],
                'TCS Amount (BCY)': [],
                'TCS Amount (FCY)': []
            };
            let keys = Object.keys(tb);
            for (let r = 0; r < array.length; r++) {
                let arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
                    }
                }
            }
            const newKeys = { "Terms &amp; Conditions": "Terms & Conditions" };
            tb = yield this.renameKeys(tb, newKeys);
            return yield this.mapForSheets(tb);
        });
    }
    podDataMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                'Record ID': [],
                'POD Name': [],
                'Created Time': [],
                'Last Modified Time': [],
                'POD Type': [],
                'Location': [],
                'Signature File': [],
                'POD-1': [],
                'POD-2': [],
                'Other Attachment Link-1': [],
                'Other Attachment Link-2': [],
                'Other Attachment Link-3': [],
                'Other Attachment Link-4': [],
                'Other Attachment Link-5': [],
            };
            let keys = Object.keys(tb);
            for (let r = 0; r < array.length; r++) {
                let arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
                    }
                }
            }
            const newKeys = { "Terms &amp; Conditions": "Terms & Conditions" };
            tb = yield this.renameKeys(tb, newKeys);
            return yield this.mapForSheets(tb);
        });
    }
    invoiceMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                'Invoice ID': [],
                'Invoice Number': [],
                'Invoice Date': [],
                'Invoice Status': [],
                'Customer ID': [],
                'Due Date': [],
                'Discount (%)': [],
                'Sub Total (BCY)': [],
                'Shipping Charge (BCY)': [],
                'Discount Amount': [],
                'Adjustment (BCY)': [],
                'Total (BCY)': [],
                'Sales Person ID': [],
                'Created Time': [],
                'Age In Days': [],
                'Age Tier': [],
                'Subscription ID': [],
                'Source': [],
                'Type': [],
                'Balance (BCY)': [],
                'GST Treatment': [],
                'GSTIN': [],
                'Purchase Order#': [],
                'Currency Code': [],
                'Exchange Rate': [],
                'Discount Type': [],
                'Is Discount Before Tax': [],
                'Is Inclusive Tax': [],
                'Sub Total (FCY)': [],
                'Total (FCY)': [],
                'Balance (FCY)': [],
                'Shiping Charge (FCY)': [],
                'Adjustment (FCY)': [],
                'Payment Terms': [],
                'Payment Terms Label': [],
                'Notes': [],
                'Terms & Conditions': [],
                'Write Off Amount (FCY)': [],
                'Write Off Amount (BCY)': [],
                'Expected Payment Date': [],
                'Last Payment Date': [],
                'Last Modified Time': [],
                'Created By': [],
                'Recurring Invoice ID': [],
                'Address ID': [],
                'Modified By': [],
                'PriceList ID': [],
                'Discount Amount (BCY)': [],
                'Discount Amount (FCY)': [],
                'Write Off Date': [],
                'Branch ID': [],
                'Status': [],
                'CRM Potential ID': [],
                'Write Off Description': [],
                'CRM Refernece ID': [],
                'TCS Amount (BCY)': [],
                'Shipping Charge Tax Amount (FCY)': [],
                'Shipping Charge Tax Amount (BCY)': [],
                'Client PO Reference': [],
            };
            let arrayKey;
            let keys = Object.keys(tb);
            for (let r = 0; r < array.length; r++) {
                arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
                    }
                }
            }
            const newKeys = { "Terms &amp; Conditions": "Terms & Conditions" };
            tb = yield this.renameKeys(tb, newKeys);
            return yield this.mapForSheets(tb);
        });
    }
    customerMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                "Customer ID": [],
                "Customer Name": [],
                "Display Name": [],
                "Email": [],
                "Phone": [],
                "Status": [],
                "Created Time": [],
                "Company Name": [],
                "First Name": [],
                "Last Name": [],
                "Salutation": [],
                "Mobile Phone": [],
                "Payment Terms": [],
                "Place Of Supply": [],
                "Tax Exemption ID": [],
                "GST Treatment": [],
                "GSTIN": [],
                "Currency Code": [],
                "Notes": [],
                "Website": [],
                "Last Modified Time": [],
                "Source": [],
                "Created By": [],
                "Modified By": [],
                "Customer Owner ID": [],
                "PriceList ID": [],
                "Credit Limit": [],
                "Customer Sub Type": [],
                "Default Address ID": [],
                "Opening Balance": [],
                "CRM Reference ID": [],
                "Zoho People Reference ID": [],
                "Zoho Project Reference ID": [],
                "Can pay via Bank Account": [],
                "PAN Number": [],
                "Type of Business": [],
                "Annual Turnover Approximate": [],
                "Bank Name": [],
                "Bank Account Number": [],
                "Bank Branch": [],
                "Bank IFSC": [],
                "Account Type": [],
                "Primary Category": [],
                "Category Code": [],
                "Business Type Code": [],
                "Catalog ID": [],
                "Revenue Code": [],
                "Legacy Code": [],
                "SupplierID": [],
                "Business Type": [],
            };
            let arrayKey;
            let keys = Object.keys(tb);
            for (let r = 0; r < array.length; r++) {
                arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
                    }
                }
            }
            const newKeys = { "Terms &amp; Conditions": "Terms & Conditions" };
            tb = yield this.renameKeys(tb, newKeys);
            return yield this.mapForSheets(tb);
        });
    }
    salesPersonMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                "Sales Person ID": [],
                "Name": [],
                "Status": [],
                "Last Modified Time": [],
                "Created Time": [],
            };
            let arrayKey;
            let keys = Object.keys(tb);
            for (let r = 0; r < array.length; r++) {
                arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
                    }
                }
            }
            const newKeys = { "Terms &amp; Conditions": "Terms & Conditions" };
            tb = yield this.renameKeys(tb, newKeys);
            return yield this.mapForSheets(tb);
        });
    }
    salesOrderDataMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                'Sales order ID': [],
                'Order Date': [],
                'Sales Order#': [],
                'Status': [],
                'Estimate ID': [],
                'Sub Total (BCY)': [],
                'Total (BCY)': [],
                'Discount Amount (BCY)': [],
                'Adjustment (BCY)': [],
                'Sales Person ID': [],
                'Created Time': [],
                'Customer ID': [],
                'Currency Code': [],
                'Exchange Rate': [],
                'Discount (%)': [],
                'Shipping Charge (BCY)': [],
                'Last Modified Time': [],
                'Address ID': [],
                'Reference Number': [],
                'Delivery Method': [],
                'GST Treatment': [],
                'GSTIN': [],
                'Source': [],
                'Discount Type': [],
                'Sub Total (FCY)': [],
                'Total (FCY)': [],
                'Discount Amount (FCY)': [],
                'Shipping Charge (FCY)': [],
                'Adjustment (FCY)': [],
                'Notes': [],
                'Created By': [],
                'Modified By': [],
                'PriceList ID': [],
                'Invoiced Status': [],
                'Paid Status': [],
                'Sales Channel': [],
                'Payment Terms Label': [],
                'Branch ID': [],
                'Expected Shipment Date': [],
                'CRM Reference ID': [],
                'CRM Potential ID': [],
                'Is Discount Before Tax': [],
                'Shipping Charge Tax Amount (FCY)': [],
                'Shipping Charge Tax Amount (BCY)': [],
                'Adjustment Description': [],
                'Terms &amp; Conditions': [],
                'Against LOI': [],
                'Client POC-1 Email': [],
                'Client POC-2 Email': [],
                'Client POC-3 Email': [],
                'Client POC-4 Email': [],
            };
            for (let r = 0; r < array.length; r++) {
                let keys = Object.keys(tb);
                let arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]]);
                    }
                }
            }
            const newKeys = { "Terms &amp; Conditions": "Terms & Conditions" };
            tb = yield this.renameKeys(tb, newKeys);
            return yield this.mapForSheets(tb);
        });
    }
    salesOrderItemsDataMap(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tb = {
                'Item ID': [],
                'Product ID': [],
                'Item Name': [],
                'Quantity': [],
                'Quantity Shipped': [],
                'Sub Total (BCY)': [],
                'Total (BCY)': [],
                'Sales order ID': [],
                'Item Price (BCY)': [],
                'Project ID': [],
                'Warehouse ID': [],
                'Discount Type': [],
                'Is Discount Before Tax': [],
                'Currency Code': [],
                'Account ID': [],
                'Product Category': [],
                'Description': [],
                'HSN/SAC': [],
                'Place Of Supply': [],
                'Tax Exemption ID': [],
                'Quantity Invoiced': [],
                'Quantity Cancelled': [],
                'Item Price (FCY)': [],
                'Entity Discount Percent': [],
                'Discount Amount (FCY)': [],
                'Tax ID': [],
                'FCY Tax Amount': [],
                'Source': [],
                'Total (FCY)': [],
                'Sub Total (FCY)': [],
                'Last Modified Time': [],
                'Created Time': [],
                'PriceList ID': [],
                'Quantity Packed': [],
                'Non Package Quantity': [],
                'Quantity Delivered': [],
                'Invoiced Quantity Cancelled': [],
                'Quantity Dropshipped': [],
                'Manually Fulfilled Quantity': [],
                'CRM Reference ID': [],
                'Client SKU Code': [],
            };
            for (let r = 0; r < array.length; r++) {
                let keys = Object.keys(tb);
                let arrayKey = Object.keys(array[r]);
                for (let o = 0; o < keys.length; o++) {
                    if (keys[o] == arrayKey[0]) {
                        tb[keys[o]].push(array[r][arrayKey[0]]);
                    }
                }
            }
            return yield this.mapForSheets(tb);
        });
    }
    mapToSheetsData(data, range) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (range == "PurchaseOrderItems") {
                return yield this.purchaseOrderItemsDataMap(data);
            }
            else if (range == "SalesOrders") {
                return yield this.salesOrderDataMap(data);
            }
            else if (range == "SalesOrderItems") {
                return yield this.salesOrderItemsDataMap(data);
            }
            else if (range == "PurchaseOrders") {
                return yield this.purchaseOrderDataMap(data);
            }
            else if (range == "PODBooks") {
                return yield this.podDataMap(data);
            }
            else if (range == "invoices") {
                return yield this.invoiceMap(data);
            }
            else if (range == "customers") {
                return yield this.customerMap(data);
            }
            else if (range == "salesman") {
                return yield this.salesPersonMap(data);
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'INTERNAL_SERVER_ERROR',
                    message: "INTERNAL_SERVER_ERROR"
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    mapForSheets(array) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const obj = [];
            let Values = Object.keys(array).map(function (key) {
                return array[key];
            });
            for (let i = 0; i < Values[0].length; i++) {
                let ar = [];
                yield obj.push(ar);
            }
            let o;
            for (let p = 0; p < Values.length; p++) {
                for (let w = 0; w < Values[p].length; w++) {
                    o = w % Values.length;
                    yield obj[w].push(Values[p][w] ? Values[p][w] : 'NA');
                }
            }
            yield obj.unshift(Object.keys(array));
            return obj;
        });
    }
    postToSheets(soData, poData, soItemsData, poItemsData, podData, invoiceData, customerData, salespersonData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const auth = new google.auth.GoogleAuth({
                keyFile: "./credentials.json",
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = '1H02KJG1WVEz3H_3bVD13LRG2Vnywsj-4fhh6wSUWi8I';
            const googleSheets = google.sheets({ version: 'v4', auth: client });
            let outPut = [];
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Sales_Orders',
            });
            let so = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Sales_Orders',
                valueInputOption: 'RAW',
                resource: {
                    values: soData,
                },
            });
            outPut.push({ salesOrderSync: so.statusText, responseURL: so.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Purchase_Orders',
            });
            let po = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Purchase_Orders',
                valueInputOption: 'RAW',
                resource: {
                    values: poData,
                },
            });
            outPut.push({ purchareOrderSync: po.statusText, responseURL: po.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Purchase_Order_Items',
            });
            let poi = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Purchase_Order_Items',
                valueInputOption: 'RAW',
                resource: {
                    values: poItemsData,
                },
            });
            outPut.push({ purchaseOrderItemsSync: poi.statusText, responseURL: poi.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Sales_Order_Items',
            });
            let soi = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Sales_Order_Items',
                valueInputOption: 'RAW',
                resource: {
                    values: soItemsData,
                },
            });
            outPut.push({ salesOrderItemsSync: soi.statusText, responseURL: soi.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Ivoice_POD(ZOHO_BOOKS)',
            });
            let pod = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Ivoice_POD(ZOHO_BOOKS)',
                valueInputOption: 'RAW',
                resource: {
                    values: podData,
                },
            });
            outPut.push({ PODataSync: pod.statusText, responseURL: pod.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Invoices (Zoho Books)',
            });
            let invoice = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Invoices (Zoho Books)',
                valueInputOption: 'RAW',
                resource: {
                    values: invoiceData,
                },
            });
            outPut.push({ InvoicesDataSync: invoice.statusText, responseURL: invoice.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Customers (Zoho Books)',
            });
            let customers = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'Customers (Zoho Books)',
                valueInputOption: 'RAW',
                resource: {
                    values: customerData,
                },
            });
            outPut.push({ CustomersDataSync: customers.statusText, responseURL: customers.request });
            yield googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'sales person (Zoho Books)',
            });
            let salesperson = yield googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'sales person (Zoho Books)',
                valueInputOption: 'RAW',
                resource: {
                    values: salespersonData,
                },
            });
            outPut.push({ salespersonDataSync: salesperson.statusText, responseURL: salesperson.request });
            return outPut;
        });
    }
    tokenfunc() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho = yield fetch('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new url_1.URLSearchParams({
                    refresh_token: '1000.41b575ccee91f8a2c15d8e3c561d8927.6c2f7f1ed922c5420d299908aa4a3bc0',
                    client_id: '1000.5WGI1UXVKY2NCMULPREH62JMPIIPOZ',
                    client_secret: 'addada9d54cc2d40b6531c6f18e22ec73165990bfe',
                    grant_type: 'refresh_token',
                }),
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = 'Zoho-oauthtoken ';
            token = token + zoho.access_token;
            return token;
        });
    }
    GetData(s, token, spreadsheetId, googleSheets, auth) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var Data, res1;
            switch (s) {
                case 'SalesOrderItems':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Sales+Order+Items+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Sales_Order_Items',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Sales_Order_Items',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { salesOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'PurchaseOrders':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Purchase+Orders+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Purchase_Orders',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Purchase_Orders',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'PurchaseOrderItems':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Purchase+Order+Items+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Purchase_Order_Items',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Purchase_Order_Items',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'SalesOrders':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Sales+Orders+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Sales_Orders',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Sales_Orders',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'PODBooks':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/POD+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Invoice_POD(ZOHO_BOOKS)',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Invoice_POD(ZOHO_BOOKS)',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'invoices':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Invoices+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Invoices (Zoho Books)',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Invoices (Zoho Books)',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'customers':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Customers+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'Customers (Zoho Books)',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'Customers (Zoho Books)',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                case 'salesman':
                    yield axios_1.default({
                        method: "GET",
                        url: `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Sales+Persons+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: 'application/json',
                            Authorization: `${token}`,
                        },
                    }).then(res => Data = res.data)
                        .catch(error => Data = error);
                    Data = yield this.getXmlValue(Data);
                    Data = yield this.mapToSheetsData(Data, s);
                    yield googleSheets.spreadsheets.values.clear({
                        auth,
                        spreadsheetId,
                        range: 'sales person (Zoho Books)',
                    });
                    res1 = yield googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: 'sales person (Zoho Books)',
                        valueInputOption: 'RAW',
                        resource: {
                            values: Data,
                        },
                    });
                    return { purchaseOrderSync: res1.statusText, responseURL: res1.request };
                    break;
                default:
                    console.log("Not implemented");
            }
            return "error";
        });
    }
    salesOrdersSheetDataSync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.tokenfunc();
            const auth = new google.auth.GoogleAuth({
                keyFile: "./credentials.json",
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = '1H02KJG1WVEz3H_3bVD13LRG2Vnywsj-4fhh6wSUWi8I';
            const googleSheets = google.sheets({ version: 'v4', auth: client });
            let arrayKey = ['SalesOrderItems', 'PurchaseOrders', 'PurchaseOrderItems', 'SalesOrders', 'PODBooks', 'invoices', 'customers', 'salesman'];
            const promises = arrayKey.map(a => this.GetData(a, token, spreadsheetId, googleSheets, auth));
            const result1 = yield Promise.all(promises);
            return result1;
        });
    }
    autuSyncShedule() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.tokenfunc();
            const auth = new google.auth.GoogleAuth({
                keyFile: "./credentials.json",
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = yield auth.getClient();
            const spreadsheetId = '1H02KJG1WVEz3H_3bVD13LRG2Vnywsj-4fhh6wSUWi8I';
            const googleSheets = google.sheets({ version: 'v4', auth: client });
            let arrayKey = ['SalesOrderItems', 'PurchaseOrders', 'PurchaseOrderItems', 'SalesOrders', 'PODBooks', 'invoices', 'customers', 'salesman'];
            const promises = arrayKey.map(a => this.GetData(a, token, spreadsheetId, googleSheets, auth));
            const result1 = yield Promise.all(promises);
            yield this.postToAutoSheets();
            return ("Started it will sync again after 12 hours");
        });
    }
    postToAutoSheets() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            cron.schedule('0 0 */12 * * *', () => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.salesOrdersSheetDataSync(); }));
        });
    }
};
SalesordersService = tslib_1.__decorate([
    common_1.Injectable()
], SalesordersService);
exports.SalesordersService = SalesordersService;
//# sourceMappingURL=salesorders.service.js.map