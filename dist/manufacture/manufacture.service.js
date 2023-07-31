"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manufacture_entity_1 = require("./manufacture.entity");
const node_fetch_1 = require("node-fetch");
const axios = require("axios");
const token_entity_1 = require("./../sms/token.entity");
const common_2 = require("@nestjs/common");
let ManufactureService = class ManufactureService {
    constructor(manufactureRepository, zohoTokenRepository) {
        this.manufactureRepository = manufactureRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.manufactureRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const manufacture = yield this.manufactureRepository.findOne(String(id));
            if (manufacture) {
                return manufacture;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'NOT FOUND',
                    message: "Manufacturer not found on this id"
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    findByGstNo(gstNo) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield axios({
                method: "POST",
                url: "https://razorpay.com/api/gstin",
                data: {
                    "gstin": gstNo
                },
                headers: { "Content-Type": "application/json" },
            }).then((res2) => {
                return res2.data;
            }).catch((err) => {
                return false;
            });
        });
    }
    zohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            let token = zohoToken.token;
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == 'You are not authorized to perform this operation' || kill.code == 57 || kill.code == 6041) {
                token = yield this.newzohoBookToken();
                return token;
            }
            return token;
        });
    }
    newzohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
                    'client_id': '1000.',
                    'client_secret': 'a106415659f7c06d2406f446068c1739e81174c2b7',
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
    pimcoreManufacturerData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const query = ` {
         getObjectFolder(id:702){
           ...on object_folder{
             id
             key
             children{
               __typename
               ...on object_folder{
                      id
                   key
                   creationDate
                   modificationDateDate
                   index
                 children{
                   __typename
                   ...on object_Manufacturers{
                    id
                index
                FirstName
                LastName
                CompanyName
                email
                Address1
                Address2
                WorkPhone
                Bank_Name
                Bank_IFSC
                Bank_Branch
                Bank_Account_No
                PAN
                City
                Country
                GSTIN
                Latitude
                Longitude
                GMapsLink
                PrimaryCategories
                ProductCategories
                Vendor_ID
                GSTTreatment
                Region_Code
                Standard_Payment_Terms
                Account_Type
                FSAuditReady
                Designation
                Annual_Turnover
                MainContactEmail
                MainContact
                MainContactMobile
                   }
                   
                 }
                     
               }
             }
           }
         }
         
       }`;
            let kill;
            const ret = yield node_fetch_1.default('https://pim.prodo.in/pimcore-graphql-webservices/ManufactureGQL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-Key': "3320267d20c11beba2b392b9fab94db8"
                },
                body: JSON.stringify({ query: query })
            })
                .then(r => r.json())
                .then(data => kill = data);
            kill = kill.data.getObjectFolder.children;
            return kill[0].children;
        });
    }
    zohoManufacturerData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let zoho1 = yield node_fetch_1.default('https://books.zoho.in/api/v3/cm_manufacture', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            return kill.module_records;
        });
    }
    singleZohoManufacturerData(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let zoho1 = yield node_fetch_1.default(`https://books.zoho.in/api/v3/cm_manufacture/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (zoho1.code == "0") {
                return kill.module_record;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_ACCEPTABLE,
                    error: 'NOT_ACCEPTABLE',
                    message: zoho1.message
                }, common_2.HttpStatus.NOT_ACCEPTABLE);
            }
        });
    }
    saveToProdo(arrdata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var manufacture = new manufacture_entity_1.Manufacture();
            let saved = [];
            let updated = [];
            let error = [];
            for (let i = 0; i < arrdata.length; i++) {
                let manufacture = new manufacture_entity_1.Manufacture();
                if (!arrdata[i].GSTIN) {
                    error.push({ status: "error", pimId: arrdata[i].id, message: "Not have GSTIN" });
                }
                else {
                    arrdata[i].GSTIN = String(arrdata[i].GSTIN.replace(/[^0-9A-Z]+/gi, ""));
                    let check = yield this.manufactureRepository.findOne({ where: { GSTIN: arrdata[i].GSTIN } });
                    manufacture.pimId = arrdata[i].id;
                    manufacture.companyName = arrdata[i].companyName ? arrdata[i].companyName : "";
                    manufacture.Address1 = arrdata[i].Address1 ? arrdata[i].Address1 : "";
                    manufacture.Address2 = arrdata[i].Address2 ? arrdata[i].Address2 : "";
                    manufacture.bankAccountNo = arrdata[i].Bank_Account_No ? arrdata[i].Bank_Account_No : "";
                    manufacture.bankIFSC = arrdata[i].Bank_IFSC ? arrdata[i].Bank_IFSC : "";
                    manufacture.bankName = arrdata[i].Bank_Name ? arrdata[i].Bank_Name : "";
                    manufacture.city = arrdata[i].City ? arrdata[i].City : "";
                    manufacture.country = arrdata[i].Country ? arrdata[i].Country : "";
                    manufacture.firstName = arrdata[i].FirstName ? arrdata[i].FirstName : "";
                    manufacture.gMapsLink = arrdata[i].GMapsLink ? arrdata[i].GMapsLink : "";
                    manufacture.GSTIN = arrdata[i].GSTIN;
                    manufacture.lastName = arrdata[i].LastName ? arrdata[i].LastName : "";
                    manufacture.latitude = arrdata[i].Latitude ? arrdata[i].Latitude : "";
                    manufacture.longitude = arrdata[i].Longitude ? arrdata[i].Longitude : "";
                    manufacture.PAN = arrdata[i].PAN ? arrdata[i].PAN : "";
                    manufacture.primaryCategory = arrdata[i].PrimaryCategories ? arrdata[i].PrimaryCategories : [];
                    manufacture.productCategories = arrdata[i].ProductCategories ? arrdata[i].ProductCategories : [];
                    manufacture.WorkPhone = arrdata[i].WorkPhone ? arrdata[i].WorkPhone : "";
                    manufacture.email = arrdata[i].email ? arrdata[i].email : "";
                    manufacture.vendorID = arrdata[i].Vendor_ID ? arrdata[i].Vendor_ID : "";
                    manufacture.GSTTreatment = arrdata[i].GSTTreatment ? arrdata[i].GSTTreatment : "";
                    manufacture.regionCode = arrdata[i].regionCode ? arrdata[i].regionCode : "";
                    manufacture.standardPaymentTerms = arrdata[i].standardPaymentTerms ? arrdata[i].standardPaymentTerms : "";
                    manufacture.accountType = arrdata[i].accountType ? arrdata[i].accountType : "";
                    manufacture.FSAuditReady = arrdata[i].FSAuditReady ? arrdata[i].FSAuditReady : "";
                    manufacture.designation = arrdata[i].designation ? arrdata[i].designation : "";
                    manufacture.annualTurnover = arrdata[i].annualTurnover ? arrdata[i].annualTurnover : "";
                    manufacture.mainContactEmail = arrdata[i].MainContactEmail ? arrdata[i].MainContactEmail : "";
                    manufacture.mainContactMobile = arrdata[i].MainContactMobile ? arrdata[i].MainContactMobile : "";
                    manufacture.mainContactPerson = arrdata[i].MainContact ? arrdata[i].MainContact : "";
                    if (!check) {
                        let m = yield this.manufactureRepository.save(manufacture);
                        saved.push({ status: "saved", pimId: manufacture.pimId, prodoId: m.id, message: "saved" });
                    }
                    else {
                        yield this.manufactureRepository.update(check.id, manufacture);
                        updated.push({ status: "upated", data: manufacture.GSTIN, pimId: manufacture.pimId, prodoId: manufacture.id, message: "updated or maybe duplicate data" });
                    }
                }
            }
            if (error.length > 0) {
                return { statusCode: 400, status: "error", message: "Some entrees have error please check pimcore data", data: { saved: saved, updated: updated, error: error } };
            }
            return { statusCode: 200, status: "success", message: "All entrees saved successfully", data: { saved: saved, updated: updated, error: error } };
        });
    }
    mapZohoData(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let manufacture = {
                "record_name": data.firstName ? data.firstName : "Manufacture",
                "cf_company_name": data.companyName ? data.companyName : "",
                "cf_pan": data.PAN ? data.PAN : "",
                "cf_gstin": data.GSTIN ? data.GSTIN : "",
                "cf_gst_treatment": data.GSTTreatment ? data.GSTTreatment : "",
                "cf_primary_categories": data.primaryCategory ? data.primaryCategory[0] : "",
                "cf_main_contact_person": data.mainContactPerson ? data.mainContactPerson : "",
                "cf_main_contact_email": data.mainContactEmail ? data.mainContactEmail.replace(/ /g, '') : "",
                "cf_main_contact_mobile": data.mainContactMobile ? data.mainContactMobile : "",
                "cf_standard_payment_teams": data.standardPaymentTerms ? data.standardPaymentTerms : "",
                "cf_bank_name": data.bankName ? data.bankName : "",
                "cf_bank_account_no": data.bankAccountNo ? data.bankAccountNo : "",
                "cf_bank_branch": data.bankBranch ? data.bankBranch : "",
                "cf_bank_ifsc_code": data.bankIFSC ? data.bankIFSC : "",
                "cf_account_type": data.accountType ? data.accountType : "",
                "cf_annual_turnover_in_lacs": data.annualTurnover ? data.annualTurnover : "",
                "cf_ready_for_full_scale_audit": data.FSAuditReady ? data.FSAuditReady : "",
                "cf_address_1": data.Address1 ? data.Address1 : "Na",
                "cf_address_2": data.Address2 ? data.Address2 : "Na",
                "cf_region_code": data.regionCode ? data.regionCode : "Na",
                "cf_prodo_id": data.id ? data.id : "",
                "cf_manufacturing_partner_id": data.manufacturingPartnerId ? data.manufacturingPartnerId : "",
                "cf_company_email_address": data.companyEmailAddress ? data.companyEmailAddress : "",
                "cf_status": data.status ? data.status : "",
                "cf_website": data.cf_website ? data.cf_website : "",
                "cf_cancelled_cheque_or_bank_a_": data.cf_cancelled_cheque_or_bank_a_ ? data.cf_cancelled_cheque_or_bank_a_ : "",
                "cf_pan_copy": data.cf_pan_copy ? data.cf_pan_copy : "",
                "cf_gst_certificate": data.cf_gst_certificate ? data.cf_gst_certificate : "",
                "cf_skus": data.skus ? data.skus : "",
                "cf_certification_attachements": data.cf_certification_attachements ? data.cf_certification_attachements : "",
                "cf_prodo_certification": data.cf_prodo_certification ? data.cf_prodo_certification : "",
                "cf_annual_rate_contract": data.cf_annual_rate_contract ? data.cf_annual_rate_contract : "",
                "cf_attention": data.cf_attention ? data.cf_attention : "",
                "cf_country": data.cf_country ? data.cf_country : "",
                "cf_state": data.cf_state ? data.cf_state : "",
                "cf_pin_code": data.cf_pin_code ? data.cf_pin_code : "",
                "cf_phone": data.cf_phone ? data.cf_phone : "",
                "cf_google_maps_link": data.cf_google_maps_link ? data.cf_google_maps_link : "",
                "cf_latitude": data.cf_latitude ? data.cf_latitude : "",
                "cf_longitude": data.cf_longitude ? data.cf_longitude : "",
                "cf_first_name": data.firstName ? data.firstName : "",
                "cf_last_name": data.lastName ? data.lastName : "",
                "cf_email": data.email ? data.email : "",
                "cf_work_phone": data.WorkPhone ? data.WorkPhone : "",
                "cf_mobile": data.cf_mobile ? data.cf_mobile : "",
                "cf_designation": data.designation ? data.designation : "",
                "cf_department": data.cf_department ? data.cf_department : "Na",
            };
            return manufacture;
        });
    }
    saveToZoho(arrdata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let saved = [];
            let updated = [];
            let error = [];
            for (let manufacture of arrdata) {
                let zohoData = yield this.mapZohoData(manufacture);
                if (manufacture.zohoId) {
                    yield this.updateManufacturerToZohoBooks(zohoData, manufacture.zohoId);
                    updated.push({ status: "upated", data: manufacture.GSTIN, pimId: manufacture.pimId, prodoId: manufacture.id, message: "updated or maybe duplicate data" });
                }
                else {
                    let m = yield this.saveManufacturerToZohoBooks(zohoData);
                    manufacture.zohoId = m.module_record_id;
                    yield this.manufactureRepository.update(manufacture.id, manufacture);
                    saved.push({ status: "saved", pimId: manufacture.pimId, prodoId: m.id, message: "saved" });
                }
            }
            if (error.length > 0) {
                return { statusCode: 400, status: "error", message: "Some entrees have error please check pimcore data", data: { saved: saved, updated: updated, error: error } };
            }
            return { statusCode: 200, status: "success", message: "All entrees saved successfully", data: { saved: saved, updated: updated, error: error } };
        });
    }
    saveManufacturerToZohoBooks(manufacture) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let zoho1 = yield node_fetch_1.default('https://books.zoho.in/api/v3/cm_manufacture', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify(manufacture)
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            if (zoho1.code == "0") {
                return zoho1.module_record;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_ACCEPTABLE,
                    error: 'NOT_ACCEPTABLE',
                    message: zoho1.message
                }, common_2.HttpStatus.NOT_ACCEPTABLE);
            }
        });
    }
    updateManufacturerToZohoBooks(manufacture, zohoId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let zoho1 = yield node_fetch_1.default(`https://books.zoho.in/api/v3/cm_manufacture/${zohoId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify(manufacture)
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            if (zoho1.code == "0") {
                console.log(zoho1.message);
                return zoho1.module_record;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_ACCEPTABLE,
                    error: 'NOT_ACCEPTABLE',
                    message: zoho1.message
                }, common_2.HttpStatus.NOT_ACCEPTABLE);
            }
        });
    }
};
ManufactureService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(manufacture_entity_1.Manufacture)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ManufactureService);
exports.ManufactureService = ManufactureService;
//# sourceMappingURL=manufacture.service.js.map