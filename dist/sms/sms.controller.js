"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("./../users/user.entity");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const superagent_1 = require("superagent");
const sms_service_1 = require("./sms.service");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_service_1 = require("./../users/user.service");
const token_entity_1 = require("./token.entity");
const node_fetch_1 = require("node-fetch");
var request = require('request');
const fs = require('fs');
const http = require("https");
const console = require("console");
const zohoSalesOrder_entity_1 = require("./zohoSalesOrder.entity");
const zohoSalesOrderByUser_entity_1 = require("./zohoSalesOrderByUser.entity");
const product_service_1 = require("./../product/product.service");
let SmsController = class SmsController {
    constructor(userRepository, zohoTokenRepository, zohoSalesOrderRepository, zohoSalesOrderByUserRepository, SmsService, userService, productService) {
        this.userRepository = userRepository;
        this.zohoTokenRepository = zohoTokenRepository;
        this.zohoSalesOrderRepository = zohoSalesOrderRepository;
        this.zohoSalesOrderByUserRepository = zohoSalesOrderByUserRepository;
        this.SmsService = SmsService;
        this.userService = userService;
        this.productService = productService;
    }
    sendOtp(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ contactNumber: body.mobileNo });
            if (foundUser) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "User already exists"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let SMS = {
                authkey: '366411AamHKyDckoqf6129d4c4P1',
                template_id: '62c2c993686eff1b09630536',
                mobile: '91'
            };
            SMS.mobile = SMS.mobile + body.mobileNo;
            let SmsOptions = {
                path: `https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
            };
            let res = yield node_fetch_1.default(SmsOptions.path);
            res = yield res.text();
            res = JSON.parse(res);
            if (res.type === "error") {
                throw new common_2.HttpException({
                    status: 400,
                    error: "Bad Request",
                    message: res.message
                }, common_2.HttpStatus.FORBIDDEN);
            }
            else {
                this.SmsService.saveData(SMS);
                throw new common_2.HttpException({
                    status: 200,
                    type: 'success',
                    message: "OTP sent successfully",
                    request_id: '32676568326c323434363631'
                }, common_2.HttpStatus.OK);
            }
        });
    }
    verifyOtp(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let SMS = {
                authkey: '366411AamHKyDckoqf6129d4c4P1',
                otp: '',
                mobile: '91'
            };
            SMS.mobile = SMS.mobile + body.mobileNo;
            SMS.otp = body.otp;
            let SmsOptions = {
                path: `https://api.msg91.com/api/v5/otp/verify?otp=${SMS.otp}&authkey=${SMS.authkey}&mobile=${SMS.mobile}`,
            };
            console.log('sms', SmsOptions);
            let res = yield node_fetch_1.default(SmsOptions.path);
            res = yield res.text();
            res = JSON.parse(res);
            res.status = res.status;
            if (res.type === "error") {
                if (res.message == "Mobile no. not found") {
                    throw new common_2.HttpException({
                        status: 404,
                        error: res.error,
                        message: "Mobile Number is not valid"
                    }, common_2.HttpStatus.FORBIDDEN);
                }
                throw new common_2.HttpException({
                    status: 404,
                    error: res.error,
                    message: res.message
                }, common_2.HttpStatus.FORBIDDEN);
            }
            else {
                throw new common_2.HttpException({
                    status: 200,
                    error: res.error,
                    message: res.message
                }, common_2.HttpStatus.OK);
            }
        });
    }
    resendOtp(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let SMS = {
                authkey: '366411AamHKyDckoqf6129d4c4P1',
                template_id: '62c2c993686eff1b09630536',
                mobile: '91',
            };
            SMS.mobile = SMS.mobile + body.mobileNo;
            let SmsOptions = {
                path: `https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
            };
            let res = yield node_fetch_1.default(SmsOptions.path);
            res = yield res.text();
            res = JSON.parse(res);
            if (res.type === "error") {
                throw new common_2.HttpException({
                    status: 400,
                    error: "Bad Request",
                    message: res.message
                }, common_2.HttpStatus.FORBIDDEN);
            }
            else {
                throw new common_2.HttpException({
                    status: 200,
                    type: 'success',
                    message: "OTP sent successfully",
                    request_id: '32676568326c323434363631'
                }, common_2.HttpStatus.OK);
            }
        });
    }
    sendSms(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let SMS = {
                flow_id: "62c2c6b528e92365c24410b5",
                sender: "mPRODO",
                short_url: "1 (On) or 0 (Off)",
                mobile: "+91",
                name: "",
                authkey: "366411AamHKyDckoqf6129d4c4P1"
            };
            SMS.mobile = SMS.mobile + body.mobileNo;
            SMS.name = SMS.name + body.name;
            const SmsOptions = {
                "method": "POST",
                "hostname": "api.msg91.com",
                "port": null,
                "path": "/api/v5/flow/",
                "headers": {
                    "authkey": "366411AamHKyDckoqf6129d4c4P1",
                    "content-type": "application/JSON"
                }
            };
            let data;
            const rep = yield http.request(SmsOptions, function (res) {
                const chunks = [];
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                res.on("end", function () {
                    const body = Buffer.concat(chunks);
                    data = body.toString();
                    data = JSON.parse(data);
                });
            });
            rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
            data = {
                type: 'success',
                message: "Message sent successfully"
            };
            rep.end();
            return data;
        });
    }
    sendBulkSms(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let SMS = {
                flow_id: "62c2c6b528e92365c24410b5",
                sender: "mPRODO",
                short_url: "1 (On) or 0 (Off)",
                recipients: [],
                authkey: "366411AamHKyDckoqf6129d4c4P1"
            };
            SMS.recipients.push({ mobile: req.body.mobileNo, name: req.body.name });
            const SmsOptions = {
                "method": "POST",
                "hostname": "api.msg91.com",
                "port": null,
                "path": "/api/v5/flow/",
                "headers": {
                    "authkey": "366411AamHKyDckoqf6129d4c4P1",
                    "content-type": "application/JSON"
                }
            };
            let data;
            const rep = yield http.request(SmsOptions, function (res) {
                const chunks = [];
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                res.on("end", function () {
                    const body = Buffer.concat(chunks);
                    data = body.toString();
                    data = JSON.parse(data);
                });
            });
            rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
            data = {
                type: 'success',
                message: "Message sent successfully"
            };
            rep.end();
            return data;
        });
    }
    test() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield superagent_1.get('https://api.ipify.org/?format=json');
            return res.body.ip;
        });
    }
    productMapByAPI(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoKeys = body.zohoKeys;
            let pimcoreKeys = body.pimcoreKeys;
            let item = body.item;
            console.log(pimcoreKeys);
            console.log(zohoKeys);
            console.log(item);
            let productMap = {};
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                if (zohoKeys[i] == "D") {
                    productMap[zohoKeys[i]] = item.k.g;
                }
                else {
                    console.log(pimcoreKeys[j]);
                    if (Object.keys(item).includes(pimcoreKeys[j])) {
                        productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                    }
                    else {
                        console.log("hello");
                        productMap[zohoKeys[i]] = "";
                    }
                    j++;
                }
            }
            return productMap;
        });
    }
    userSendOtp(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!req.body.mobileNumber) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "Mobile number is required",
                    message: "Mobile number is required"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "User not found",
                    message: "User not found"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            const foundUser = yield this.userRepository.findOne({ contactNumber: req.body.mobileNumber });
            if (foundUser) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "User already exists on this number"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            user.contactNumber = req.body.mobileNumber;
            if (user.isVerified) {
                return {
                    type: 'error',
                    message: "User already verified"
                };
            }
            else {
                let SMS = {
                    authkey: '366411AamHKyDckoqf6129d4c4P1',
                    template_id: '62c2c993686eff1b09630536',
                    mobile: '91'
                };
                SMS.mobile = SMS.mobile + user.contactNumber;
                let SmsOptions = {
                    path: `https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
                };
                let res = yield node_fetch_1.default(SmsOptions.path);
                res = yield res.text();
                res = JSON.parse(res);
                if (res.type === "error") {
                    throw new common_2.HttpException({
                        status: 400,
                        error: "Bad Request",
                        message: res.message
                    }, common_2.HttpStatus.FORBIDDEN);
                }
                else {
                    this.SmsService.saveData(SMS);
                    throw new common_2.HttpException({
                        status: 200,
                        type: 'success',
                        message: "OTP sent successfully",
                        request_id: '32676568326c323434363631'
                    }, common_2.HttpStatus.OK);
                }
            }
        });
    }
    userVerifyOtp(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!req.body.otp) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "OTP is required",
                    message: "OTP is required"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (!req.body.mobileNumber) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "Mobile number is required",
                    message: "Mobile number is required"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "User not found",
                    message: "User not found"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let SMS = {
                authkey: '366411AamHKyDckoqf6129d4c4P1',
                otp: '',
                mobile: '91'
            };
            user.contactNumber = req.body.mobileNumber;
            SMS.mobile = SMS.mobile + user.contactNumber;
            SMS.otp = req.body.otp;
            let SmsOptions = {
                path: `https://api.msg91.com/api/v5/otp/verify?otp=${SMS.otp}&authkey=${SMS.authkey}&mobile=${SMS.mobile}`,
            };
            let res = yield node_fetch_1.default(SmsOptions.path);
            res = yield res.text();
            res = JSON.parse(res);
            res.status = res.status;
            if (res.type === "error") {
                if (res.message == "Mobile no. not found") {
                    throw new common_2.HttpException({
                        status: 404,
                        error: res.error,
                        message: "Mobile Number is not valid"
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
                throw new common_2.HttpException({
                    status: 404,
                    error: res.error,
                    message: res.message
                }, common_2.HttpStatus.FORBIDDEN);
            }
            else {
                user.isVerified = true;
                let SMS = {
                    flow_id: "62c2c6b528e92365c24410b5",
                    sender: "mPRODO",
                    short_url: "1 (On) or 0 (Off)",
                    mobile: "+91",
                    name: "",
                    authkey: "366411AamHKyDckoqf6129d4c4P1"
                };
                SMS.mobile = SMS.mobile + user.contactNumber;
                SMS.name = SMS.name + user.firstName;
                let k = yield this.userRepository.save(user);
                console.log("user -V", user);
                const SmsOptions = {
                    "method": "POST",
                    "hostname": "api.msg91.com",
                    "port": null,
                    "path": "/api/v5/flow/",
                    "headers": {
                        "authkey": "366411AamHKyDckoqf6129d4c4P1",
                        "content-type": "application/JSON"
                    }
                };
                let data;
                const rep = yield http.request(SmsOptions, function (res) {
                    const chunks = [];
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                    res.on("end", function () {
                        const body = Buffer.concat(chunks);
                        data = body.toString();
                        data = JSON.parse(data);
                    });
                });
                rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
                data = {
                    type: 'success',
                    message: "Message sent successfully"
                };
                rep.end();
                throw new common_2.HttpException({
                    status: 200,
                    error: res.error,
                    message: res.message
                }, common_2.HttpStatus.OK);
            }
        });
    }
    userResendOtp(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!req.body.mobileNumber) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "Mobile number is required",
                    message: "Mobile number is required"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: 404,
                    error: "User not found",
                    message: "User not found"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            user.contactNumber = req.body.mobileNumber;
            if (user.isVerified) {
                return {
                    type: 'error',
                    message: "User already verified"
                };
            }
            else {
                let SMS = {
                    authkey: '366411AamHKyDckoqf6129d4c4P1',
                    template_id: '62c2c993686eff1b09630536',
                    mobile: '91'
                };
                SMS.mobile = SMS.mobile + user.contactNumber;
                let SmsOptions = {
                    path: `https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
                };
                let res = yield node_fetch_1.default(SmsOptions.path);
                res = yield res.text();
                res = JSON.parse(res);
                if (res.type === "error") {
                    throw new common_2.HttpException({
                        status: 400,
                        error: "Bad Request",
                        message: res.message
                    }, common_2.HttpStatus.FORBIDDEN);
                }
                else {
                    this.SmsService.saveData(SMS);
                    throw new common_2.HttpException({
                        status: 200,
                        type: 'success',
                        message: "OTP sent successfully",
                        request_id: '32676568326c323434363631'
                    }, common_2.HttpStatus.OK);
                }
            }
        });
    }
    productMap(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {};
            let papa = item.parent.Name;
            let path = item.parent.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'Super_Category_L0':
                        productMap[zohoKeys[i]] = l0;
                        break;
                    case 'Product_Name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${papa} (${item[pimcoreKeys[j]]})`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Category_L1':
                        productMap[zohoKeys[i]] = l1;
                        break;
                    case 'Sub_Category_L2':
                        productMap[zohoKeys[i]] = l2;
                        break;
                    case 'Sub_sub_Category_L3':
                        productMap[zohoKeys[i]] = l3;
                        j++;
                        break;
                    case 'Selling_Price':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Cost_Price':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'type':
                        if (item.type) {
                            productMap[zohoKeys[i]] = item.type;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'SalesInformation':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = true;
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = true;
                        }
                        j++;
                        break;
                    case 'PurchaseInformation':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = true;
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = true;
                        }
                        j++;
                        break;
                    case 'TrackInventory':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = true;
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = true;
                        }
                        j++;
                        break;
                    case 'Display_On':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'Manufacturers':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Brand':
                        if (item.Brand) {
                            productMap[zohoKeys[i]] = item.Brands.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Weight':
                        if (item.Weight) {
                            productMap[zohoKeys[i]] = item.Weight.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Height':
                        if (item.Height) {
                            productMap[zohoKeys[i]] = item.Height.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Breadth':
                        if (item.Breadth) {
                            productMap[zohoKeys[i]] = item.Breadth.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Length':
                        if (item.Length) {
                            productMap[zohoKeys[i]] = item.Length.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'PIMCORE_ID':
                        console.log(pimcoreKeys[j]);
                        console.log("hello id", item.id);
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    default:
                        console.log(pimcoreKeys[j], zohoKeys[i]);
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null && item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                }
            }
            return productMap;
        });
    }
    productMap1(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {};
            let papa = item.parent.Name;
            let path = item.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'Super_Category_L0':
                        productMap[zohoKeys[i]] = l0;
                        break;
                    case 'Product_Name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${item[pimcoreKeys[j]]}`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Category_L1':
                        productMap[zohoKeys[i]] = l1;
                        break;
                    case 'Sub_Category_L2':
                        productMap[zohoKeys[i]] = l2;
                        break;
                    case 'Sub_sub_Category_L3':
                        productMap[zohoKeys[i]] = l3;
                        j++;
                        break;
                    case 'type':
                        if (item.type) {
                            productMap[zohoKeys[i]] = item.type;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'SalesInformation':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = true;
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = true;
                        }
                        j++;
                        break;
                    case 'PurchaseInformation':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = true;
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = true;
                        }
                        j++;
                        break;
                    case 'TrackInventory':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = true;
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = true;
                        }
                        j++;
                        break;
                    case 'Display_On':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null) {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'Manufacturers':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Brand':
                        if (item.Brand) {
                            productMap[zohoKeys[i]] = item.Brands.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Weight':
                        if (item.Weight) {
                            productMap[zohoKeys[i]] = item.Weight.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Height':
                        if (item.Height) {
                            productMap[zohoKeys[i]] = item.Height.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Breadth':
                        if (item.Breadth) {
                            productMap[zohoKeys[i]] = item.Breadth.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'Length':
                        if (item.Length) {
                            productMap[zohoKeys[i]] = item.Length.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'PIMCORE_ID':
                        console.log(pimcoreKeys[j]);
                        console.log("hello id", item.id);
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    default:
                        console.log(pimcoreKeys[j], zohoKeys[i]);
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null && item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                }
            }
            return productMap;
        });
    }
    zohoToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.c236170cf7209060b3760ad60ba68035.5fd6722cf25268cb92f26e3417e3fd19',
                    'client_id': '1000.',
                    'client_secret': 'a106415659f7c06d2406f446068c1739e81174c2b7',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            return token;
        });
    }
    zohoCrmProduct(item, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho1 = yield node_fetch_1.default('https://www.zohoapis.in/crm/v2/Products', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify({ data: item })
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            console.log("zoho product post", zoho1);
            if (zoho1.data[0].code == "SUCCESS") {
                return zoho1;
            }
            else if (zoho1.data[0].code == "DUPLICATE_DATA") {
                let id = zoho1.data[0].details.id;
                console.log("id", id);
                console.log("duplicate data", token);
                let zoho2 = yield node_fetch_1.default(`https://www.zohoapis.in/crm/v2/Products/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Content-Length': '904'
                    },
                    body: JSON.stringify({ data: item })
                });
                zoho2 = yield zoho2.text();
                zoho2 = JSON.parse(zoho2);
                console.log("zoho product put", zoho2.data);
                return zoho2;
            }
            else if (zoho1.data[0].code == "INVALID_DATA") {
                console.log("invalid data", zoho1.data[0].details);
                return item;
            }
            if (zoho1.data[0].code == "INVALID_TOKEN") {
                console.log("invalid token", zoho1.data[0].details);
                return "INVALID_TOKEN";
            }
        });
    }
    test1() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("hello");
            const query = `{
      getObjectFolder(id:1189){
...on object_folder{
  id
  key
  index
  childrenSortBy
  fullpath
  modificationDateDate
  children{
    ...on object_folder{
      id
      index
      creationDate
      fullpath
      key
      children{
        ... on object_folder{
          id
          index
          fullpath
          key
          children{
            ... on object_folder{
              id
              index
              fullpath
              key
              children{
                ... on object_folder{
                  id
                  index
                  fullpath
                  key
                  children{
                    __typename
                    ... on object_GeneralClass{
                            Name
                          id
                          Description
                          SKU
                          DisplayOn
                          Tags
                          HSN_Code
                          EcoFriendly
                          ReadyStock
                          GreenProduct
                          GoodsOrService
                          ProdoExclusive
                          TrackInventory
                          AdvancedInventoryTracking
                          LeadTime
                          MOQ
                          Unit
                          Fragile
                          Biodegradable
                          OneTimeUse
                          Tags
                         
                          AdvancedInventoryTracking
                          TrackInventory
                          InterStateGSTRate
                          DisplayOn
                          ProdoExclusive
                          EcoFriendly
                          WhiteLabeled
                          MadeToOrder
                          LeadTime
                          ISBN
                          EAN
                          MPN
                          TaxPreferance
                          HSNCode
                          Brand{
                            __typename
                          }
                          Weight{
                            value
                          }
                          Height{
                            value
                          }
                          Breadth{
                            value
                          }
                           Length{
                            value
                          }
                         
                          SellingPrice{
                            value
                          }
                          CostPrice{
                            value
                          }
                          Manufacturers{
                            ... on object_GeneralClass{
                              id
                              Name
                            }
                          }
                          parent{
                            __typename
                            ... on object_folder{
                                   fullpath
                                 }
                          }
                      children(objectTypes:["variant","object"]){
                        __typename
                        ... on object_GeneralClass{
                          Name
                          id
                          Description
                          SKU
                          DisplayOn
                          Tags
                          HSN_Code
                          EcoFriendly
                          ReadyStock
                          GreenProduct
                          GoodsOrService
                          ProdoExclusive
                          TrackInventory
                          AdvancedInventoryTracking
                          LeadTime
                          MOQ
                          Unit
                          Fragile
                          Biodegradable
                          OneTimeUse
                          Tags
                         
                          AdvancedInventoryTracking
                          TrackInventory
                          InterStateGSTRate
                          DisplayOn
                          ProdoExclusive
                          EcoFriendly
                          WhiteLabeled
                          MadeToOrder
                          LeadTime
                          ISBN
                          EAN
                          MPN
                          TaxPreferance
                          HSNCode
                          Brand{
                            __typename
                          }
                          Weight{
                            value
                          }
                          Height{
                            value
                          }
                          Breadth{
                            value
                          }
                           Length{
                            value
                          }
                         
                          SellingPrice{
                            value
                          }
                          CostPrice{
                            value
                          }
                          Manufacturers{
                            ... on object_GeneralClass{
                              id
                              Name
                            }
                          }
                          parent{
                            __typename
                            ... on object_GeneralClass{
                              Name
                              parent{
                                ... on object_folder{
                                  fullpath
                                }
                              }
                            }
                          }
                   
                        }
                      }
                   
                  }
                   
                  }
                 
                }
              }
            }
          }
         
        }
      }
    }
  }
}
}
  }`;
            let kill;
            const ret = yield node_fetch_1.default('https://pim.prodo.in/pimcore-graphql-webservices/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-Key': "8f7bb0951b624784d0b08ba94a56218a"
                },
                body: JSON.stringify({ query: query })
            })
                .then(r => r.json())
                .then(data => console.log('data returned:', kill = data));
            kill = kill.data.getObjectFolder.children;
            let res = [];
            let token = yield this.zohoToken();
            let pimcoreKeys = [
                "GoodsOrService",
                "Name",
                "SKU",
                "Unit",
                "Returnable",
                "HSNCode",
                "TaxPreferance",
                "Length",
                "Breadth",
                "Height",
                "Weight",
                "Brand",
                "Manufacurers",
                "UPC",
                "MPN",
                "EAN",
                "ISBN",
                "LeadTime",
                "MadeToOrder",
                "ReadyStock",
                "WhiteLabeled",
                "GreenProduct",
                "EcoFriendly",
                "ProdoExclusive",
                "MOQ",
                "DisplayOn",
                "Description",
                "SubSubCategory",
                "SalesInformation",
                "SellingPrice",
                "SalesAccount",
                "SalesDescription",
                "PurchaseInformation",
                "CostPrice",
                "PurchaseAccount",
                "IntraStateGSTRate",
                "InterStateGSTRate",
                "TrackInventory",
                "AdvancedInventoryTracking",
                "id",
                "Fragile",
                "Biodegradable",
                "OneTimeUse",
                "Tags",
                "ZBooksItemID",
                "ZCRMItemID"
            ];
            let zohoKeys = [
                "type",
                "Product_Name",
                "SKU_ID",
                "Unit",
                "Returnable",
                "HSNCode",
                "Taxable",
                "Length_in_cm",
                "Breadth_in_cm",
                "Height_in_cm",
                "Weight_in_gm",
                "Brand",
                "Manufacturers",
                "UPC",
                "MPN",
                "EAN",
                "ISBN",
                "LeadTime_in_days",
                "Made_to_Order",
                "Ready_Stock",
                "White_labeled",
                "Green_Product",
                "Eco_Friendly",
                "Prodo_Exclusive",
                "MOQ",
                "Display_On",
                "Description",
                "Super_Category_L0",
                "Category_L1",
                "Sub_Category_L2",
                "Sub_sub_Category_L3",
                "SalesInformation",
                "Selling_Price",
                "SalesAccount",
                "SalesDescription",
                "PurchaseInformation",
                "Cost_Price",
                "PurchaseAccount",
                "Intra_State_Tax_Rate",
                "Inter_State_GST_Rate",
                "TrackInventory",
                "AdvancedInventoryTracking",
                "PIMCORE_ID",
                "Fragile",
                "Biodegradable",
                "One_Time_Use",
                "SEO_Tags",
                "ZBooksItemID",
                "Product_id"
            ];
            for (let i = 0; i < kill.length; i++) {
                console.log("level0", kill.length);
                if (Object.keys(kill[i]).includes("children")) {
                    let child = kill[i].children;
                    if (child.length > 0) {
                        console.log("level1", child.length);
                        for (let j = 0; j < child.length; j++) {
                            if (Object.keys(child[j]).includes("children")) {
                                let child2 = child[j].children;
                                if (child2.length > 0) {
                                    console.log("level2", child2.length);
                                    for (let k = 0; k < child2.length; k++) {
                                        if (Object.keys(child2[k]).includes("children")) {
                                            let child3 = child2[k].children;
                                            if (child3.length > 0) {
                                                console.log("level3", child3.length);
                                                for (let l = 0; l < child3.length; l++) {
                                                    if (Object.keys(child3[l]).includes("children")) {
                                                        let child4 = child3[l].children;
                                                        console.log("level4", child4.length);
                                                        if (child4.length > 0) {
                                                            for (let m = 0; m < child4.length; m++) {
                                                                if (Object.keys(child4[m]).includes("children")) {
                                                                    let out = [];
                                                                    let data = yield this.productMap1(zohoKeys, pimcoreKeys, child4[m]);
                                                                    if (data) {
                                                                        out.push(data);
                                                                        let res1 = yield this.zohoCrmProduct(out, token);
                                                                        if (res1 == "INVALID_TOKEN") {
                                                                            token = yield this.zohoToken();
                                                                            let res1 = yield this.zohoCrmProduct(out, token);
                                                                        }
                                                                        res.push(res1);
                                                                    }
                                                                    else {
                                                                        console.log("error");
                                                                    }
                                                                    let child5 = child4[m].children;
                                                                    console.log("level--------------5", child5.length);
                                                                    for (let n = 0; n < child5.length; n++) {
                                                                        let out = [];
                                                                        let data = yield this.productMap(zohoKeys, pimcoreKeys, child5[n]);
                                                                        if (data) {
                                                                            out.push(data);
                                                                            let res1 = yield this.zohoCrmProduct(out, token);
                                                                            if (res1 == "INVALID_TOKEN") {
                                                                                token = yield this.zohoToken();
                                                                                let res1 = yield this.zohoCrmProduct(out, token);
                                                                            }
                                                                            res.push(res1);
                                                                        }
                                                                        else {
                                                                            console.log("error");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return res;
        });
    }
    zohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.ed1558439de1a92a10ea765558341e0a.491937e36a45f1ec81808449305ed2fd',
                    'client_id': '1000.'
                    'client_secret': '3992ea3c6a7e219c3d4acfb9240ad3be1f595eff08',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            return token;
        });
    }
    zohoBookProduct(item, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("item in sync ", item.sku);
            let zoho1 = yield node_fetch_1.default('https://books.zoho.in/api/v3/items?organization_id=60015092519', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify(item)
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            if (zoho1.message == "The item has been added.") {
                return { itemSku: item.sku, message: "zoho item added", status: "success" };
            }
            else if (zoho1.code == "120124") {
                console.log("invalid data", zoho1.message);
                return { itemSku: item.sku, message: "invalid data", status: "error" };
            }
            else if (zoho1.code == "1001") {
                console.log("item in update", item.sku);
                if (item.sku !== "5236") {
                    return { itemSku: item.sku, status: "updated" };
                }
                let kill;
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/items?organization_id=60015092519&search_text=${item.sku}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                if (kill.items == undefined) {
                    console.log("no item found");
                    return { itemSku: item.sku, message: "zoho item not found on this sku id", status: "error" };
                }
                if (!(kill.items.length > 0)) {
                    return { itemSku: item.sku, message: "zoho item not found on this sku id", status: "error" };
                }
                let id = kill.items[0].item_id;
                let zoho5 = yield node_fetch_1.default(`https://books.zoho.in/api/v3/items/${id}?organization_id=60015092519`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Content-Length': '904'
                    },
                    body: JSON.stringify(item)
                });
                zoho5 = yield zoho5.text();
                zoho5 = JSON.parse(zoho5);
                return { itemSku: item.sku, message: zoho5.message, status: "updated" };
            }
            else if (zoho1.code == "1002") {
                return { itemSku: item.sku, message: zoho1.message, item: item, status: "error" };
            }
            else if (zoho1.code == "4") {
                return { itemSku: item.sku, message: zoho1.message, details: "check pimcore product", item: item, status: "error" };
            }
            if (zoho1.code == "57" || zoho1.code == "14") {
                return "INVALID_TOKEN";
            }
            else {
                return { itemSku: item.sku, message: zoho1.message, details: "pimcore or zoho token error", status: "error" };
            }
        });
    }
    bookproductMapVar(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {
                "custom_fields": [],
                "item_tax_preferences": [
                    {
                        "tax_specification": "inter",
                        "tax_id": "",
                    },
                    {
                        "tax_specification": "intra",
                        "tax_id": "",
                    }
                ],
                "package_details": {
                    "length": "",
                    "width": "",
                    "height": "",
                    "weight": "",
                    "weight_unit": "g",
                    "dimension_unit": "cm"
                }
            };
            let papa = item.parent.Name;
            let badepapa = item.parent.parent.Name;
            let path = item.parent.parent.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            let custom_Field = {
                "api_name": typeorm_1.Any,
                "value": typeorm_1.Any
            };
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'cf_category_l0':
                        productMap.custom_fields.push({ "api_name": "cf_category_l0", "value": l0 });
                        break;
                    case 'cf_sub_category_l1':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l1", "value": l1 });
                        break;
                    case 'cf_sub_category_l2':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l2", "value": l2 });
                        break;
                    case 'cf_sub_sub_category_l3':
                        productMap.custom_fields.push({ "api_name": "cf_sub_sub_category_l3", "value": l3 });
                        break;
                    case 'product_type':
                        productMap[zohoKeys[i]] = "goods";
                        j++;
                        break;
                    case 'package_details{dimension_unit}':
                        break;
                    case 'package_details{weight_unit}':
                        break;
                    case 'is_taxable':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'package_details{length}':
                        if (item.Length) {
                            productMap.package_details.length = item.Length.value;
                        }
                        j++;
                        break;
                    case 'package_details{width}':
                        if (item.Breadth) {
                            productMap.package_details.width = item.Breadth.value;
                        }
                        j++;
                        break;
                    case 'package_details{height}':
                        if (item.Height) {
                            productMap.package_details.height = item.Height.value;
                        }
                        j++;
                        break;
                    case 'package_details{weight}':
                        if (item.Weight) {
                            productMap.package_details.weight = item.Weight.value;
                        }
                        j++;
                        break;
                    case 'name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${badepapa} (${papa}) [${item[pimcoreKeys[j]]}]`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'account_name':
                        productMap[zohoKeys[i]] = "Sales";
                        j++;
                        break;
                    case 'purchase_description':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'purchase_account_name':
                        productMap[zohoKeys[i]] = "Cost of Goods Sold";
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]inter':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%intra':
                        productMap.item_tax_preferences[1].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%inter':
                        productMap.item_tax_preferences[0].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]inter':
                        j++;
                        break;
                    case 'inventory_account_name':
                        productMap[zohoKeys[i]] = "Finished Goods";
                        j++;
                        break;
                    case 'track_batch_number':
                        productMap[zohoKeys[i]] = false;
                        break;
                    case 'item_type':
                        productMap[zohoKeys[i]] = "inventory";
                        break;
                    case 'is_linked_with_zohocrm':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'sales_rate':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'purchase_rate':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'manufacturer':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'sku':
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    case 'cf_pimcore_id':
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": item.id });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let value = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value = "TRUE";
                                }
                                else {
                                    value = "FALSE";
                                }
                            }
                        }
                        else {
                            value = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'description':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                let description = item[pimcoreKeys[j]];
                                let description_json = JSON.stringify(description);
                                let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
                                description_json_without_html = description_json_without_html.replace(/\\n/g, '');
                                productMap[zohoKeys[i]] = description_json_without_html;
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'cf_display_on':
                        let k = "";
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": k });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let v = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                v = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    v = "TRUE";
                                }
                                else {
                                    v = "FALSE";
                                }
                            }
                        }
                        else {
                            v = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'cf_made_to_order':
                        let value1 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value1 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value1 = "TRUE";
                                }
                                else {
                                    value1 = "FALSE";
                                }
                            }
                        }
                        else {
                            value1 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value1 });
                        j++;
                        break;
                    case 'cf_white_labeled':
                        let value3 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value3 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value3 = "TRUE";
                                }
                                else {
                                    value3 = "FALSE";
                                }
                            }
                        }
                        else {
                            value3 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value3 });
                        j++;
                        break;
                    case 'cf_biodegradable':
                        let value4 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value4 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value4 = "Yes";
                                }
                                else {
                                    value4 = "No";
                                }
                            }
                        }
                        else {
                            value4 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value4 });
                        j++;
                        break;
                    case 'cf_onetimeuse':
                        let value5 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value5 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value5 = "Yes";
                                }
                                else {
                                    value5 = "No";
                                }
                            }
                        }
                        else {
                            value5 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value5 });
                        j++;
                        break;
                    default:
                        if (zohoKeys[i].startsWith("cf_")) {
                            let value = typeorm_1.Any;
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    value = "";
                                }
                                else {
                                    value = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                value = "";
                            }
                            productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                            j++;
                        }
                        else {
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    productMap[zohoKeys[i]] = "";
                                }
                                else {
                                    productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                productMap[zohoKeys[i]] = "";
                            }
                            j++;
                            break;
                        }
                }
            }
            return productMap;
        });
    }
    bookproductMap(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {
                "custom_fields": [],
                "item_tax_preferences": [
                    {
                        "tax_specification": "inter",
                        "tax_id": "",
                    },
                    {
                        "tax_specification": "intra",
                        "tax_id": "",
                    }
                ],
                "package_details": {
                    "length": "",
                    "width": "",
                    "height": "",
                    "weight": "",
                    "weight_unit": "g",
                    "dimension_unit": "cm"
                }
            };
            let papa = item.parent.Name;
            let path = item.parent.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            let custom_Field = {
                "api_name": typeorm_1.Any,
                "value": typeorm_1.Any
            };
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'cf_category_l0':
                        productMap.custom_fields.push({ "api_name": "cf_category_l0", "value": l0 });
                        break;
                    case 'cf_sub_category_l1':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l1", "value": l1 });
                        break;
                    case 'cf_sub_category_l2':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l2", "value": l2 });
                        break;
                    case 'cf_sub_sub_category_l3':
                        productMap.custom_fields.push({ "api_name": "cf_sub_sub_category_l3", "value": l3 });
                        break;
                    case 'product_type':
                        productMap[zohoKeys[i]] = "goods";
                        j++;
                        break;
                    case 'package_details{dimension_unit}':
                        break;
                    case 'package_details{weight_unit}':
                        break;
                    case 'is_taxable':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'package_details{length}':
                        if (item.Length) {
                            productMap.package_details.length = item.Length.value;
                        }
                        j++;
                        break;
                    case 'package_details{width}':
                        if (item.Breadth) {
                            productMap.package_details.width = item.Breadth.value;
                        }
                        j++;
                        break;
                    case 'package_details{height}':
                        if (item.Height) {
                            productMap.package_details.height = item.Height.value;
                        }
                        j++;
                        break;
                    case 'package_details{weight}':
                        if (item.Weight) {
                            productMap.package_details.weight = item.Weight.value;
                        }
                        j++;
                        break;
                    case 'name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${papa} (${item[pimcoreKeys[j]]})`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'account_name':
                        productMap[zohoKeys[i]] = "Sales";
                        j++;
                        break;
                    case 'purchase_description':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'purchase_account_name':
                        productMap[zohoKeys[i]] = "Cost of Goods Sold";
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]inter':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%intra':
                        productMap.item_tax_preferences[1].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%inter':
                        productMap.item_tax_preferences[0].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]inter':
                        j++;
                        break;
                    case 'inventory_account_name':
                        productMap[zohoKeys[i]] = "Finished Goods";
                        j++;
                        break;
                    case 'track_batch_number':
                        productMap[zohoKeys[i]] = false;
                        break;
                    case 'item_type':
                        productMap[zohoKeys[i]] = "inventory";
                        break;
                    case 'is_linked_with_zohocrm':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'sales_rate':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'purchase_rate':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'manufacturer':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'sku':
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    case 'cf_pimcore_id':
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": item.id });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let value = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value = "TRUE";
                                }
                                else {
                                    value = "FALSE";
                                }
                            }
                        }
                        else {
                            value = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'description':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                let description = item[pimcoreKeys[j]];
                                let description_json = JSON.stringify(description);
                                let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
                                description_json_without_html = description_json_without_html.replace(/\\n/g, '');
                                productMap[zohoKeys[i]] = description_json_without_html;
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'cf_display_on':
                        let k = "";
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": k });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let v = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                v = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    v = "TRUE";
                                }
                                else {
                                    v = "FALSE";
                                }
                            }
                        }
                        else {
                            v = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'cf_made_to_order':
                        let value1 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value1 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value1 = "TRUE";
                                }
                                else {
                                    value1 = "FALSE";
                                }
                            }
                        }
                        else {
                            value1 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value1 });
                        j++;
                        break;
                    case 'cf_white_labeled':
                        let value3 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value3 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value3 = "TRUE";
                                }
                                else {
                                    value3 = "FALSE";
                                }
                            }
                        }
                        else {
                            value3 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value3 });
                        j++;
                        break;
                    case 'cf_biodegradable':
                        let value4 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value4 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value4 = "Yes";
                                }
                                else {
                                    value4 = "No";
                                }
                            }
                        }
                        else {
                            value4 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value4 });
                        j++;
                        break;
                    case 'cf_onetimeuse':
                        let value5 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value5 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value5 = "Yes";
                                }
                                else {
                                    value5 = "No";
                                }
                            }
                        }
                        else {
                            value5 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value5 });
                        j++;
                        break;
                    default:
                        if (zohoKeys[i].startsWith("cf_")) {
                            let value = typeorm_1.Any;
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    value = "";
                                }
                                else {
                                    value = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                value = "";
                            }
                            productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                            j++;
                        }
                        else {
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    productMap[zohoKeys[i]] = "";
                                }
                                else {
                                    productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                productMap[zohoKeys[i]] = "";
                            }
                            j++;
                            break;
                        }
                }
            }
            return productMap;
        });
    }
    bookproductMap1(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {
                "custom_fields": [],
                "item_tax_preferences": [
                    {
                        "tax_specification": "inter",
                        "tax_id": "",
                    },
                    {
                        "tax_specification": "intra",
                        "tax_id": "",
                    }
                ],
                "package_details": {
                    "length": "",
                    "width": "",
                    "height": "",
                    "weight": "",
                    "weight_unit": "g",
                    "dimension_unit": "cm"
                }
            };
            let papa = item.parent.Name;
            let path = item.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            let custom_Field = {
                "api_name": typeorm_1.Any,
                "value": typeorm_1.Any
            };
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'cf_category_l0':
                        productMap.custom_fields.push({ "api_name": "cf_category_l0", "value": l0 });
                        break;
                    case 'cf_sub_category_l1':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l1", "value": l1 });
                        break;
                    case 'cf_sub_category_l2':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l2", "value": l2 });
                        break;
                    case 'cf_sub_sub_category_l3':
                        productMap.custom_fields.push({ "api_name": "cf_sub_sub_category_l3", "value": l3 });
                        break;
                    case 'product_type':
                        productMap[zohoKeys[i]] = "goods";
                        j++;
                        break;
                    case 'package_details{dimension_unit}':
                        break;
                    case 'package_details{weight_unit}':
                        break;
                    case 'is_taxable':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'package_details{length}':
                        if (item.Length) {
                            productMap.package_details.length = item.Length.value;
                        }
                        j++;
                        break;
                    case 'package_details{width}':
                        if (item.Breadth) {
                            productMap.package_details.width = item.Breadth.value;
                        }
                        j++;
                        break;
                    case 'package_details{height}':
                        if (item.Height) {
                            productMap.package_details.height = item.Height.value;
                        }
                        j++;
                        break;
                    case 'package_details{weight}':
                        if (item.Weight) {
                            productMap.package_details.weight = item.Weight.value;
                        }
                        j++;
                        break;
                    case 'name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${item[pimcoreKeys[j]]}`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'account_name':
                        productMap[zohoKeys[i]] = "Sales";
                        j++;
                        break;
                    case 'purchase_description':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'purchase_account_name':
                        productMap[zohoKeys[i]] = "Cost of Goods Sold";
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]inter':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%intra':
                        productMap.item_tax_preferences[1].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%inter':
                        productMap.item_tax_preferences[0].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]inter':
                        j++;
                        break;
                    case 'inventory_account_name':
                        productMap[zohoKeys[i]] = "Finished Goods";
                        j++;
                        break;
                    case 'track_batch_number':
                        productMap[zohoKeys[i]] = false;
                        break;
                    case 'item_type':
                        productMap[zohoKeys[i]] = "inventory";
                        break;
                    case 'is_linked_with_zohocrm':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'sales_rate':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'purchase_rate':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'manufacturer':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'sku':
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    case 'cf_pimcore_id':
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": item.id });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let value = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value = "TRUE";
                                }
                                else {
                                    value = "FALSE";
                                }
                            }
                        }
                        else {
                            value = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'cf_made_to_order':
                        let value1 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value1 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value1 = "TRUE";
                                }
                                else {
                                    value1 = "FALSE";
                                }
                            }
                        }
                        else {
                            value1 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value1 });
                        j++;
                        break;
                    case 'cf_white_labeled':
                        let value3 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value3 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value3 = "TRUE";
                                }
                                else {
                                    value3 = "FALSE";
                                }
                            }
                        }
                        else {
                            value3 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value3 });
                        j++;
                        break;
                    case 'cf_biodegradable':
                        let value4 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value4 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value4 = "Yes";
                                }
                                else {
                                    value4 = "No";
                                }
                            }
                        }
                        else {
                            value4 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value4 });
                        j++;
                        break;
                    case 'cf_onetimeuse':
                        let value5 = typeorm_1.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value5 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value5 = "Yes";
                                }
                                else {
                                    value5 = "No";
                                }
                            }
                        }
                        else {
                            value5 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value5 });
                        j++;
                        break;
                    case 'description':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                let description = item[pimcoreKeys[j]];
                                let description_json = JSON.stringify(description);
                                let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
                                description_json_without_html = description_json_without_html.replace(/\\n/g, '');
                                productMap[zohoKeys[i]] = description_json_without_html;
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'cf_display_on':
                        let k = "";
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": k });
                        j++;
                        break;
                    default:
                        if (zohoKeys[i].startsWith("cf_")) {
                            let value = typeorm_1.Any;
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    value = "";
                                }
                                else {
                                    value = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                value = "";
                            }
                            productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                            j++;
                        }
                        else {
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    productMap[zohoKeys[i]] = "";
                                }
                                else {
                                    productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                productMap[zohoKeys[i]] = "";
                            }
                            j++;
                            break;
                        }
                }
            }
            return productMap;
        });
    }
    zohoBooks() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("Pimcore-Books-Syncing-");
            const query = `{
    getObjectFolder(id:1189){
...on object_folder{
id
key
index
childrenSortBy
fullpath
modificationDateDate
children{
  ...on object_folder{
    id
    index
    creationDate
    fullpath
    key
    children{
      ... on object_folder{
        id
        index
        fullpath
        key
        children{
          ... on object_folder{
            id
            index
            fullpath
            key
            children{
              ... on object_folder{
                id
                index
                fullpath
                key
                children{
                  __typename
                  ... on object_GeneralClass{
                          Name
                    
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Country
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        images
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                        Country
                        ClientSKUCode

                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                         ... on object_folder{
                                fullpath
                              }
                        }
                    children(objectTypes:["variant","object"]){
                      __typename
                      ... on object_GeneralClass{
                        Name
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                       
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                        
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        images
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                           Country
                    ClientSKUCode
                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                          ... on object_GeneralClass{
                            Name
                            parent{
                              ... on object_folder{
                                fullpath
                              }
                            }
                          }
                        }
                       
                      children(objectTypes:["variant","object"]){
                        __typename
                        ... on object_GeneralClass{
                          Name
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                        images
                       
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                          
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                           Country
                    ClientSKUCode
                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                          ... on object_GeneralClass{
                            Name
                            parent{
                              __typename
                              ... on object_GeneralClass{
                                Name
                                id
                                parent{
                               ... on object_folder{
                                fullpath
                              }
                                }
                              }
                  
                            }
                          }
                        }
                       
                        }
                        
                      }
                      }
                      
                      
                    }
                 
                }
                 
                }
               
              }
            }
          }
        }
       
      }
    }
  }
}
}
}
}`;
            let kill;
            const ret = yield node_fetch_1.default('https://pim.prodo.in/pimcore-graphql-webservices/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-Key': "8f7bb0951b624784d0b08ba94a56218a"
                },
                body: JSON.stringify({ query: query })
            })
                .then(r => r.json())
                .then(data => kill = data);
            kill = kill.data.getObjectFolder.children;
            let res = [];
            let added = 0;
            let fail = 0;
            let updated = 0;
            let token = yield this.zohoBookToken();
            let pimcoreKeys = [
                "GoodsOrService",
                "Unit",
                "TaxPreferance",
                "Name",
                "ID",
                "Returnable",
                "HSN_Code",
                "Length",
                "Breadth",
                "Height",
                "Weight",
                "Brand",
                "Manufacurers",
                "UPC",
                "MPN",
                "EAN",
                "ISBN",
                "LeadTime",
                "MadeToOrder",
                "ReadyStock",
                "WhiteLabeled",
                "GreenProduct",
                "EcoFriendly",
                "ProdoExclusive",
                "MOQ",
                "DisplayOn",
                "SalesDescription",
                "SellingPrice",
                "SalesAccount",
                "Description",
                "PurchaseInformation",
                "CostPrice",
                "PurchaseAccount",
                "Intra",
                "IntraStateGSTRate",
                "IntraType",
                "Inter",
                "InterStateGSTRate",
                "interType",
                "ID",
                "Biodegradable",
                "OneTimeUse",
                "Tags",
                "Country",
                "ClientSKUCode",
                "SKU",
                "ModelNo",
                "images"
            ];
            let zohoKeys = [
                "product_type",
                "unit",
                "package_details{dimension_unit}",
                "package_details{weight_unit}",
                "is_taxable",
                "name",
                "sku",
                "cf_returnable_item",
                "hsn_or_sac",
                "package_details{length}",
                "package_details{width}",
                "package_details{height}",
                "package_details{weight}",
                "brand",
                "manufacturer",
                "upc",
                "cf_mpn",
                "ean",
                "isbn",
                "cf_lead_time",
                "cf_made_to_order",
                "cf_ready_to_product",
                "cf_white_labeled",
                "cf_green_product",
                "cf_eco_friendly",
                "cf_prodo_exclusive",
                "cf_minimum_order_quantity",
                "cf_display_on",
                "cf_variant_description",
                "cf_category_l0",
                "cf_sub_category_l1",
                "cf_sub_category_l2",
                "cf_sub_sub_category_l3",
                "sales_rate",
                "account_name",
                "description",
                "purchase_description",
                "purchase_rate",
                "purchase_account_name",
                "item_tax_preferences [{tax_specification,tax_name}]intra",
                "item_tax_preferences [{tax_percentage}]%intra",
                "item_tax_preferences [{tax_type}]intra",
                "item_tax_preferences [{tax_specification,tax_name}]inter",
                "item_tax_preferences [{tax_percentage}]%inter",
                "item_tax_preferences [{tax_type}]inter",
                "cf_pimcore_id",
                "cf_biodegradable",
                "cf_onetimeuse",
                "cf_seo_tags",
                "cf_country_of_origin",
                "cf_client_sku_code",
                "cf_prodo_sku_id",
                "cf_model_no",
                "cf_images",
                "inventory_account_name",
                "track_batch_number",
                "item_type",
                "is_linked_with_zohocrm",
            ];
            for (let i = 0; i < kill.length; i++) {
                if (Object.keys(kill[i]).includes("children")) {
                    let child = kill[i].children;
                    if (child.length > 0) {
                        for (let j = 0; j < child.length; j++) {
                            if (Object.keys(child[j]).includes("children")) {
                                let child2 = child[j].children;
                                if (child2.length > 0) {
                                    for (let k = 0; k < child2.length; k++) {
                                        if (Object.keys(child2[k]).includes("children")) {
                                            let child3 = child2[k].children;
                                            if (child3.length > 0) {
                                                for (let l = 0; l < child3.length; l++) {
                                                    if (Object.keys(child3[l]).includes("children")) {
                                                        let child4 = child3[l].children;
                                                        if (child4.length > 0) {
                                                            for (let m = 0; m < child4.length; m++) {
                                                                if (Object.keys(child4[m]).includes("children")) {
                                                                    let out = [];
                                                                    let data = yield this.bookproductMap1(zohoKeys, pimcoreKeys, child4[m]);
                                                                    if (data) {
                                                                        out.push(data);
                                                                        let res1 = yield this.zohoBookProduct(data, token);
                                                                        if (res1.status) {
                                                                            if (res1.status == "updated") {
                                                                                updated++;
                                                                            }
                                                                            else if (res1.status == "success") {
                                                                                added++;
                                                                            }
                                                                            else if (res1.status == "error") {
                                                                                fail++;
                                                                            }
                                                                        }
                                                                        if (res1 == "INVALID_TOKEN") {
                                                                            token = yield this.zohoBookToken();
                                                                            res1 = yield this.zohoBookProduct(data, token);
                                                                        }
                                                                        res.push({ res: res1, level: "P-Type" });
                                                                    }
                                                                    else {
                                                                        console.log("error");
                                                                    }
                                                                    let child5 = child4[m].children;
                                                                    if (child5.length > 0) {
                                                                        for (let n = 0; n < child5.length; n++) {
                                                                            let out = [];
                                                                            let data = yield this.bookproductMap(zohoKeys, pimcoreKeys, child5[n]);
                                                                            if (data) {
                                                                                out.push(data);
                                                                                let res1 = yield this.zohoBookProduct(data, token);
                                                                                if (res1.status) {
                                                                                    if (res1.status == "updated") {
                                                                                        updated++;
                                                                                    }
                                                                                    else if (res1.status == "success") {
                                                                                        added++;
                                                                                    }
                                                                                    else if (res1.status == "error") {
                                                                                        fail++;
                                                                                    }
                                                                                }
                                                                                if (res1 == "INVALID_TOKEN") {
                                                                                    token = yield this.zohoToken();
                                                                                    res1 = yield this.zohoBookProduct(data, token);
                                                                                }
                                                                                res.push({ res: res1, level: "Sub-Type" });
                                                                            }
                                                                            else {
                                                                                console.log("error");
                                                                            }
                                                                            let child6 = child5[n].children;
                                                                            if (child6.length > 0) {
                                                                                for (let o = 0; o < child6.length; o++) {
                                                                                    let out = [];
                                                                                    let data = yield this.bookproductMapVar(zohoKeys, pimcoreKeys, child6[o]);
                                                                                    if (data) {
                                                                                        out.push(data);
                                                                                        let res1 = yield this.zohoBookProduct(data, token);
                                                                                        if (res1.status) {
                                                                                            if (res1.status == "updated") {
                                                                                                updated++;
                                                                                            }
                                                                                            else if (res1.status == "success") {
                                                                                                added++;
                                                                                            }
                                                                                            else if (res1.status == "error") {
                                                                                                fail++;
                                                                                            }
                                                                                        }
                                                                                        if (res1 == "INVALID_TOKEN") {
                                                                                            token = yield this.zohoToken();
                                                                                            res1 = yield this.zohoBookProduct(data, token);
                                                                                        }
                                                                                        res.push({ res: res1, level: "Varient" });
                                                                                    }
                                                                                    else {
                                                                                        console.log("error");
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return { Products_Added: added, Products_Updated: updated, failed: fail, Response: res };
        });
    }
    zohoBookTokenFarji() {
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
                token = yield this.newZohoBookTokenFarji();
                return token;
            }
            return token;
        });
    }
    newZohoBookTokenFarji() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            console.log("zohoToken", zohoToken);
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
    zohoBookSalesOrder(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            let userEmail = user.email;
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders?organization_id=60015313630`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.code == 6041) {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders?organization_id=60015313630`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            if (kill.message == "You are not authorized to perform this operation") {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders?organization_id=60015313630`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let orders = [];
            let salesOrder = kill.salesorders;
            if (salesOrder == undefined) {
                return [];
            }
            salesOrder = salesOrder.filter(item => item.cf_client_poc_1 == userEmail || item.cf_client_poc_1_unformatted == userEmail || item.cf_client_poc_2 == userEmail || item.cf_client_poc_2_unformatted == userEmail || item.cf_client_poc_3 == userEmail || item.cf_client_poc_3_unformatted == userEmail);
            if (!(salesOrder.length > 0)) {
                return "NO_DATA";
            }
            for (let i = 0; i < salesOrder.length; i++) {
                let id = salesOrder[i].salesorder_id;
                console.log("id", id);
                let orderDetails = yield this.SalesOrderByID(id);
                salesOrder[i].details = orderDetails;
                orders.push(salesOrder[i]);
            }
            return orders;
        });
    }
    zohoBookPurchaseOrder() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let userEmail = "kamran.khan@niyotail.com";
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation") {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let orders = [];
            let purchaseOrder = kill.purchaseorders;
            for (let i = 0; i < purchaseOrder.length; i++) {
                let id = purchaseOrder[i].purchaseorder_id;
                let orderDetails = yield this.PurchaseOrderByID(id);
                purchaseOrder[i].details = orderDetails;
                orders.push(purchaseOrder[i]);
            }
            return orders;
        });
    }
    SalesOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015313630`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630.") {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                return kill.salesorder;
            }
            return kill.salesorder;
        });
    }
    zohoBookSalesOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015313630`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation") {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015313630`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                return kill.salesorder;
            }
            return kill.salesorder;
        });
    }
    PurchaseOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation") {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                return kill.purchaseorder;
            }
            return kill.purchaseorder;
        });
    }
    zohoBookPurchaseOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation") {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                return kill.purchaseorder;
            }
            return kill.purchaseorder;
        });
    }
    zohoInventorySalesOrderSave() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
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
            if (kill.code == 6041) {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                console.log("update", kill);
            }
            if (kill.message == 'You are not authorized to perform this operation' || kill.code == 57 || kill.code == 6041) {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let orders = [];
            let salesOrder = kill.salesorders;
            if (salesOrder == undefined) {
                console.log("No Data-in main");
                return [];
            }
            if (!(salesOrder.length > 0)) {
                return "NO_DATA";
            }
            for (let i = 0; i < salesOrder.length; i++) {
                let id = salesOrder[i].salesorder_id;
                let orderDetails = yield this.InventorySalesOrderByID(id);
                salesOrder[i].details = orderDetails;
                let data = {
                    orderDetails: salesOrder[i],
                    zohoId: salesOrder[i].salesorder_id
                };
                let k = yield this.zohoSalesOrderRepository.findOne({ zohoId: salesOrder[i].salesorder_id });
                if (k) {
                    let id = k.id;
                    orders.push(yield this.zohoSalesOrderRepository.update(id, data));
                }
                else {
                    orders.push(yield this.zohoSalesOrderRepository.save(data));
                }
            }
            return orders;
        });
    }
    conectPoc() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
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
            if (kill.code == 6041) {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            if (kill.message == 'You are not authorized to perform this operation' || kill.code == 57 || kill.code == 6041) {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let orders = [];
            let salesOrder = kill.salesorders;
            if (salesOrder == undefined) {
                return [];
            }
            if (!(salesOrder.length > 0)) {
                return "NO_DATA";
            }
            for (let i = 0; i < salesOrder.length; i++) {
                let id = salesOrder[i].salesorder_id;
                let k = yield this.zohoSalesOrderRepository.findOne({ zohoId: id });
                if (k) {
                    orders.push(yield this.updatePocOnSalesOrder(id, salesOrder[i]));
                }
                else {
                    orders.push(`order not found ${salesOrder[i].salesorder_id}`);
                }
            }
            return orders;
        });
    }
    addordersToAdmin(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let order = yield this.zohoSalesOrderByUserRepository.findOne('62e96b5037a104c778675a7b');
            order.orderIds.push(id);
            return yield this.zohoSalesOrderByUserRepository.update('62e96b5037a104c778675a7b', order);
        });
    }
    updatePocOnSalesOrder(id, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = [];
            let cf_1_email = salesOrder.cf_client_poc_1_email ? (salesOrder.cf_client_poc_1_email == "" ? "NA" : salesOrder.cf_client_poc_1_email) : "NA";
            let cf_2_email = salesOrder.cf_client_poc_2_email ? (salesOrder.cf_client_poc_2_email == "" ? "NA" : salesOrder.cf_client_poc_2_email) : "NA";
            let cf_3_email = salesOrder.cf_client_poc_3_email ? (salesOrder.cf_client_poc_3_email == "" ? "NA" : salesOrder.cf_client_poc_3_email) : "NA";
            let cf_4_email = salesOrder.cf_client_poc_4_email ? (salesOrder.cf_client_poc_4_email == "" ? "NA" : salesOrder.cf_client_poc_4_email) : "NA";
            if (cf_1_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_1_email });
                if (userdata) {
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                }
                else {
                    let kill = {
                        email: cf_1_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                }
            }
            if (cf_2_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_2_email });
                if (userdata) {
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                }
                else {
                    let kill = {
                        email: cf_2_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                }
            }
            if (cf_3_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_3_email });
                if (userdata) {
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                }
                else {
                    let kill = {
                        email: cf_3_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                }
            }
            if (cf_4_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_4_email });
                if (userdata) {
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                }
                else {
                    let kill = {
                        email: cf_4_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                }
            }
            return res;
        });
    }
    zohoInventorySalesOrder(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (req.user.roles.includes('PRODO_ADMIN')) {
                let p = yield this.zohoSalesOrderRepository.find();
                let orders = [];
                for (let i = 0; i < p.length; i++) {
                    let order = p[i];
                    let orderDetails = order.orderDetails;
                    orders.push(orderDetails);
                }
                return orders;
            }
            let user = yield this.userRepository.findOne(req.user.id);
            let userEmail = user.email;
            let salesOrder_list1 = yield this.zohoSalesOrderByUserRepository.find({ email: userEmail });
            if (salesOrder_list1[0]) {
                const attrFilter = [];
                let Ids = [];
                let salesOrder_list = salesOrder_list1[0].orderIds;
                for (let j = 0; j < salesOrder_list.length; j++) {
                    let Ac_id = salesOrder_list[j];
                    attrFilter.push({ "zohoId": Ac_id });
                }
                const query = {
                    where: {
                        $or: [
                            ...attrFilter
                        ]
                    }
                };
                let ui = yield this.zohoSalesOrderRepository.find(query);
                let orders = [];
                for (let i = 0; i < ui.length; i++) {
                    let order = ui[i];
                    let orderDetails = order.orderDetails;
                    orders.push(orderDetails);
                }
                return orders;
            }
            else {
                return [];
            }
        });
    }
    InventorySalesOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                let salesOrder1 = kill.salesorder;
                if (salesOrder1 == undefined) {
                    console("No Data-in error", kill);
                    return [];
                }
                let lineItems = salesOrder1.line_items;
                let k1 = salesOrder1.packages;
                let packages1 = {};
                for (let ii = 0; ii < lineItems.length; ii++) {
                    lineItems[ii].package_id = [];
                }
                lineItems = yield this.itemStatus(lineItems, salesOrder1);
                if (k1.length > 0) {
                    for (let j = 0; j < k1.length; j++) {
                        let data = yield this.packageDetails(k1[j].package_id);
                        packages1[k1[j].package_id] = data;
                        for (let k = 0; k < lineItems.length; k++) {
                            let p_id = yield this.itemDetails(lineItems[k], data);
                            if (p_id == "NA") {
                            }
                            else {
                                lineItems[k].package_id.push(p_id);
                            }
                        }
                    }
                    salesOrder1.package_list = packages1;
                    console.log("items in  error");
                    lineItems = yield this.setItemPrice(lineItems, salesOrder1.date);
                    lineItems = yield this.calShipment(lineItems, packages);
                    salesOrder1.line_items = lineItems;
                    return salesOrder1;
                }
                else {
                    console.log("items in  error");
                    lineItems = yield this.setItemPrice(lineItems, salesOrder1.date);
                    lineItems = yield this.calShipment(lineItems, packages);
                    salesOrder1.line_items = lineItems;
                    salesOrder.package_list = packages;
                    return salesOrder;
                }
            }
            let salesOrder = kill.salesorder;
            if (salesOrder == undefined) {
                console.log("No Data-without", kill, id);
                return [];
            }
            let lineItems2 = salesOrder.line_items;
            let k = salesOrder.packages;
            let packages = {};
            for (let ii = 0; ii < lineItems2.length; ii++) {
                lineItems2[ii].package_id = [];
            }
            lineItems2 = yield this.itemStatus(lineItems2, salesOrder);
            if (k.length > 0) {
                for (let j = 0; j < k.length; j++) {
                    let data1 = yield this.packageDetails(k[j].package_id);
                    packages[k[j].package_id] = data1;
                    for (let k = 0; k < lineItems2.length; k++) {
                        let p_id = yield this.itemDetails(lineItems2[k], data1);
                        if (p_id == "NA") {
                        }
                        else {
                            lineItems2[k].package_id.push(p_id);
                        }
                    }
                }
                salesOrder.package_list = packages;
                lineItems2 = yield this.setItemPrice(lineItems2, salesOrder.date);
                lineItems2 = yield this.calShipment(lineItems2, packages);
                salesOrder.line_items = lineItems2;
                return salesOrder;
            }
            else {
                lineItems2 = yield this.setItemPrice(lineItems2, salesOrder.date);
                lineItems2 = yield this.calShipment(lineItems2, packages);
                salesOrder.line_items = lineItems2;
                salesOrder.package_list = packages;
                return salesOrder;
            }
        });
    }
    setItemPrice(lineItems, date) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < lineItems.length; i++) {
                let sku = lineItems[i].sku;
                if (sku.startsWith('.')) {
                    sku = sku.substring(1);
                }
                let item = yield this.productService.getProductBySku(sku);
                if (item) {
                    let item_date = item.date;
                    let item_date_arr = item_date.split("-");
                    let item_date_year = item_date_arr[0];
                    let item_date_month = item_date_arr[1];
                    let item_date_day = item_date_arr[2];
                    let item_date_date = new Date(item_date_year, item_date_month, item_date_day);
                    let date_arr = date.split("-");
                    let date_year = date_arr[0];
                    let date_month = date_arr[1];
                    let date_day = date_arr[2];
                    let date_date = new Date(date_year, date_month, date_day);
                    if (item_date_date > date_date) {
                        lineItems[i].prodo_price = item.price;
                        lineItems[i].prodo_images = item.productImages;
                    }
                    else {
                        item.price = yield this.productService.currentPriceUpdate(item, date, lineItems[i].rate);
                        lineItems[i].prodo_pricee = item.price;
                        lineItems[i].prodo_images = item.productImages;
                    }
                }
                else {
                    lineItems[i].prodo_pricee = lineItems[i].rate;
                    lineItems[i].prodo_images = [];
                }
            }
            return lineItems;
        });
    }
    itemDetails(lineItem, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let itemDetails = "NA";
            let item_id = lineItem.item_id;
            let line_items = data.line_items;
            for (let i = 0; i < line_items.length; i++) {
                if (line_items[i].item_id == item_id) {
                    itemDetails = data.package_id;
                }
            }
            return itemDetails;
        });
    }
    calShipment(lineItems, packages) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < lineItems.length; i++) {
                if (lineItems[i].package_id.length > 0) {
                    lineItems[i].shipment_status = [{ status: "In Production", date: new Date(), quantity: lineItems[i].quantity, package_id: "" }];
                    for (let j = 0; j < lineItems[i].package_id.length; j++) {
                        let package_id1 = lineItems[i].package_id[j];
                        let pkg = packages[package_id1];
                        for (let k = 0; k < pkg.line_items.length; k++) {
                            if (pkg.line_items[k].item_id == lineItems[i].item_id) {
                                if (pkg.status == "delivered") {
                                    lineItems[i].shipment_status.push({ status: "Delivered", date: pkg.shipment_delivered_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                                else if (pkg.status == "not_shipped") {
                                    lineItems[i].shipment_status.push({ status: "In Production", date: pkg.date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                                else if (pkg.status == "shipped") {
                                    lineItems[i].shipment_status.push({ status: "Shipped", date: pkg.shipping_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                                else {
                                    lineItems[i].shipment_status.push({ status: "Quality Check", date: pkg.shipping_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                            }
                        }
                    }
                }
                else {
                    lineItems[i].shipment_status = [{ status: "In Production", date: new Date(), quantity: lineItems[i].quantity, package_id: "" }];
                }
            }
            return lineItems;
        });
    }
    itemStatus(lineItems, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (salesOrder.status == "draft") {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "Order Received";
                }
            }
            else if (salesOrder.status == "partially_shipped") {
                if (salesOrder.current_sub_status == "closed") {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = "Delivered";
                    }
                }
                else {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = yield this.calculateStatus(lineItems[i]);
                    }
                }
            }
            else if (salesOrder.status == "fulfilled") {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "Delivered";
                }
            }
            else if (salesOrder.status == "confirmed") {
                if (salesOrder.current_sub_status == "closed") {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = "Delivered";
                    }
                }
                else {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = "Order Accepted";
                    }
                }
            }
            else if (salesOrder.status == "shipped") {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "In Transit";
                }
            }
            else {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "NA";
                }
            }
            return lineItems;
        });
    }
    calculateStatus(lineItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoiced = lineItem.quantity_invoiced;
            let shipped = lineItem.quantity_shipped;
            let packed = lineItem.quantity_packed;
            let backordered = lineItem.quantity_backordered;
            let dropshipped = lineItem.quantity_dropshipped;
            let cancelled = lineItem.quantity_cancelled;
            let quantity = lineItem.quantity;
            if (packed == quantity) {
                if (shipped == quantity) {
                    if (invoiced == quantity) {
                        return "Delivered";
                    }
                    else {
                        return "In Transit[Fully Shipped]";
                    }
                }
                return " In Transit[Fully packed]";
            }
            else if (packed > 0) {
                if (shipped < packed) {
                    if (shipped > 0) {
                        return "In Transit[Partially Shipped]";
                    }
                    else {
                        return "In Transit[Partially Packed]";
                    }
                }
                return "In Transit[Partially Packed]";
            }
            else {
                return "Quality Check";
            }
        });
    }
    packageDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.newZohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                return kill.package;
            }
            return kill.package;
        });
    }
    order_invoice(id, res1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            kill.pipe(res1);
            return res1;
        });
    }
    order_summery(id, res1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            kill.pipe(res1);
            return res1;
        });
    }
    order_package(id, res1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/print?organization_id=60015092519&package_ids=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            kill.pipe(res1);
            return res1;
        });
    }
    order_bill(id, res1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            kill.pipe(res1);
            return res1;
        });
    }
    order_po(id, res1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders/${id}/attachment?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            kill.pipe(res1);
            return res1;
        });
    }
    create_order(body, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let orders = body;
            let line_items = [];
            for (let i = 0; i < orders.length; i++) {
                let order1 = orders[i];
                line_items.push({
                    "item_id": order1.item_id,
                    "quantity": order1.qty,
                    "rate": order1.price,
                    "description": order1.description
                });
            }
            let order = orders[0].salesorder;
            let customer_id = orders[0].customer_id;
            let salesperson_name = order.salesperson_name;
            let custom_fields = [];
            if (Object.keys(order).includes("cf_client_poc_1_email")) {
                custom_fields.push({
                    "api_name": "cf_client_poc_1_email",
                    "value": order.cf_client_poc_1_email
                });
            }
            if (Object.keys(order).includes("cf_client_poc_2_email")) {
                custom_fields.push({
                    "api_name": "cf_client_poc_2_email",
                    "value": order.cf_client_poc_2_email
                });
            }
            if (Object.keys(order).includes("cf_client_poc_3_email")) {
                custom_fields.push({
                    "api_name": "cf_client_poc_3_email",
                    "value": order.cf_client_poc_3_email
                });
            }
            if (Object.keys(order).includes("cf_client_poc_4_email")) {
                custom_fields.push({
                    "api_name": "cf_client_poc_4_email",
                    "value": order.cf_client_poc_4_email
                });
            }
            let salesOrder = {
                "customer_id": customer_id,
                "salesperson_name": salesperson_name,
                "custom_fields": custom_fields,
                "notes": "Created from Prodo Website",
                "line_items": line_items
            };
            let token = yield this.zohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/salesorders?organization_id=60015092519`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(salesOrder)
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "Sales Order has been created.") {
                let saveOrderId = kill.salesorder.salesorder_id;
                return { "status": "success", "message": "Order created successfully", "order": kill.salesorder };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Forbidden',
                    message: "Order not created"
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    newTokenForReorder() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.4465f9e1efe1561cb882ac213c5ab38a.33e74308926b912fc92bce7fabb1ad8b',
                 'client_id': '1000.'
                    'client_secret': 'bb85cabde8bb17d1fa0c75dde4285f85788d219741',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            return token;
        });
    }
    reOrderDetails(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (salesOrder == undefined) {
                console.log("No details found");
                return [];
            }
            let lineItems2 = salesOrder.line_items;
            let k = salesOrder.packages;
            let packages = {};
            for (let ii = 0; ii < lineItems2.length; ii++) {
                lineItems2[ii].package_id = [];
                lineItems2[ii].status = "Order Received";
            }
            salesOrder.line_items = lineItems2;
            salesOrder.package_list = packages;
            return salesOrder;
        });
    }
    saveReOrder(id, sales) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.newTokenForReorder();
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
            let orders = [];
            let salesOrder = kill.salesorders;
            if (salesOrder == undefined) {
                console.log("No Data saved in prodo");
                return ["no data saved in prodo"];
            }
            if (!(salesOrder.length > 0)) {
                return "NO_DATA saved in prodo";
            }
            for (let i = 0; i < salesOrder.length; i++) {
                if (salesOrder[i].salesorder_id == id) {
                    let orderDetails = yield this.reOrderDetails(sales);
                    salesOrder[i].details = orderDetails;
                    let data = {
                        orderDetails: salesOrder[i],
                        zohoId: id
                    };
                    let ui = yield this.zohoSalesOrderRepository.save(data);
                    yield this.updatePocOnSalesOrder(ui.id, ui.orderDetails);
                    orders.push(ui);
                }
            }
            return orders;
        });
    }
    schedule() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.zohoBooks();
            console.log("items updated");
            setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.schedule();
            }), 7200000);
        });
    }
    all_data(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let k = yield this.userService.userdashboardData(req.user);
            if (k == "NA") {
                let orders = yield this.zohoInventorySalesOrder(req);
                let res = yield this.userService.calDashboardData(req.user, orders);
                return res.data;
            }
            else {
                return k;
            }
        });
    }
    all_data1() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out = [];
            let k = yield this.userService.allDashboardData();
            for (let i = 0; i < k.length; i++) {
                let id = k[i].userId.toString();
                let user = yield this.userService.findOne(id);
                let req = {
                    user: user
                };
                let orders = yield this.zohoInventorySalesOrder(req);
                console.log("orders");
                out.push(yield this.userService.calDashboardData(req.user, orders));
                console.log("hello sync3 out");
            }
            return out;
        });
    }
    updateSalesOrder(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let currentTime = new Date();
            let currentTime1 = currentTime.toLocaleTimeString();
            console.log("currentTime", currentTime1);
            let id = body.salesorder ? (body.salesorder.salesorder_id ? body.salesorder.salesorder_id : "false") : "false";
            return id;
        });
    }
};
tslib_1.__decorate([
    common_1.Post("sendOtp"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "sendOtp", null);
tslib_1.__decorate([
    common_1.Post("verifyOtp"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "verifyOtp", null);
tslib_1.__decorate([
    common_1.Post("resendOtp"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "resendOtp", null);
tslib_1.__decorate([
    common_1.Post("sendSms"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "sendSms", null);
tslib_1.__decorate([
    common_1.Post("send-bulk-Sms"),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "sendBulkSms", null);
tslib_1.__decorate([
    common_1.Get('/test'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "test", null);
tslib_1.__decorate([
    common_1.Post("mapProduct"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "productMapByAPI", null);
tslib_1.__decorate([
    common_1.Post("user-sendOtp"),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "userSendOtp", null);
tslib_1.__decorate([
    common_1.Post("user-verifyOtp"),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "userVerifyOtp", null);
tslib_1.__decorate([
    common_1.Post("user-resendOtp"),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "userResendOtp", null);
tslib_1.__decorate([
    common_1.Get('zohoCrmToken'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoToken", null);
tslib_1.__decorate([
    common_1.Get('pimcore-product-to-zoho-crm'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "test1", null);
tslib_1.__decorate([
    common_1.Get('zohoBookToken'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBookToken", null);
tslib_1.__decorate([
    common_1.Get('pimcore-product-to-zoho-books'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBooks", null);
tslib_1.__decorate([
    common_1.Get('zohoFarjiToken'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBookTokenFarji", null);
tslib_1.__decorate([
    common_1.Get('newZohoFarjiToken'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "newZohoBookTokenFarji", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get("zohoBooks-salesOrder"),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBookSalesOrder", null);
tslib_1.__decorate([
    common_1.Get("zohoBooks-purchaseOrder"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBookPurchaseOrder", null);
tslib_1.__decorate([
    common_1.Get("zohoBooks-salesOrder/:id"),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBookSalesOrderByID", null);
tslib_1.__decorate([
    common_1.Get("zohoBooks-purchaseOrder/:id"),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoBookPurchaseOrderByID", null);
tslib_1.__decorate([
    common_1.Get("salesOrder-save-to-prodo"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoInventorySalesOrderSave", null);
tslib_1.__decorate([
    common_1.Get("salesOrder-connect-poc"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "conectPoc", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get("zohoInventory-salesOrder"),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "zohoInventorySalesOrder", null);
tslib_1.__decorate([
    common_1.Get('zohoInventory-salesOrder-invoice/:id'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Invoice.pdf'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "order_invoice", null);
tslib_1.__decorate([
    common_1.Get('zohoInventory-salesOrder-summary/:id'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "order_summery", null);
tslib_1.__decorate([
    common_1.Get('zohoInventory-salesOrder-package/:id'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Package.pdf'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "order_package", null);
tslib_1.__decorate([
    common_1.Get('zohoInventory-salesOrder-bill/:id'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Bill.pdf'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "order_bill", null);
tslib_1.__decorate([
    common_1.Get('zohoInventory-salesOrder-po/:id'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=po.pdf'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "order_po", null);
tslib_1.__decorate([
    common_1.Post('zohoInventory-salesOrder-create'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "create_order", null);
tslib_1.__decorate([
    common_1.Get("sync-pimcore-zohoBooks"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "schedule", null);
tslib_1.__decorate([
    common_1.Get('dashboard-data'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "all_data", null);
tslib_1.__decorate([
    common_1.Get('sync-dashboard-data'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "all_data1", null);
tslib_1.__decorate([
    common_1.Post('sales-order-update'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SmsController.prototype, "updateSalesOrder", null);
SmsController = tslib_1.__decorate([
    common_1.Controller('sms'),
    tslib_1.__param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__param(1, typeorm_2.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__param(2, typeorm_2.InjectRepository(zohoSalesOrder_entity_1.zohoSalesOrder)),
    tslib_1.__param(3, typeorm_2.InjectRepository(zohoSalesOrderByUser_entity_1.zohoSalesOrderByUser)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        sms_service_1.SmsService,
        user_service_1.UserService,
        product_service_1.ProductService])
], SmsController);
exports.SmsController = SmsController;
//# sourceMappingURL=sms.controller.js.map