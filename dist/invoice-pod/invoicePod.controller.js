"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("./../users/user.entity");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_service_1 = require("./../users/user.service");
const token_entity_1 = require("./../sms/token.entity");
const common_3 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
var request = require('request');
const fs = require('fs');
const http = require("https");
const zohoSalesOrder_entity_1 = require("./../sms/zohoSalesOrder.entity");
const zohoSalesOrderByUser_entity_1 = require("./../sms/zohoSalesOrderByUser.entity");
const product_service_1 = require("./../product/product.service");
const invoicePod_service_1 = require("./invoicePod.service");
let invoicePodController = class invoicePodController {
    constructor(userRepository, zohoTokenRepository, zohoSalesOrderRepository, zohoSalesOrderByUserRepository, userService, productService, invoicePodService) {
        this.userRepository = userRepository;
        this.zohoTokenRepository = zohoTokenRepository;
        this.zohoSalesOrderRepository = zohoSalesOrderRepository;
        this.zohoSalesOrderByUserRepository = zohoSalesOrderByUserRepository;
        this.userService = userService;
        this.productService = productService;
        this.invoicePodService = invoicePodService;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let checkInvoicePod = yield this.invoicePodService.checkInvoicePod(id);
            if (checkInvoicePod.status == 400) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "Link Is Expired"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let token = yield this.newZohoBookTokenFarji();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.invoice) {
                return kill.invoice;
            }
            else {
                throw new common_3.NotFoundException(`Invoice with id ${id} not found`);
            }
        });
    }
    savePod(id, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.newZohoBookTokenFarji();
            body.zohoInvoiceId = id;
            if (!body.podType) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "Please Provide Type Of POD "
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (!body.pod1) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "Please Provide at least one POD "
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (!body.zohoSalesOrderId) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: " Please Provide Sales Order Id "
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (!body.podLocation) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: " Please Provide Your Current Location "
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (body.validity) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: " Validity cannot be changed "
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (body.podType == "Digital") {
                return yield this.invoicePodService.saveDigitalPod(body, token);
            }
            else if (body.podType == "Signed") {
                if (!body.signatureFile) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: " Please Provide Your Signature "
                    }, common_2.HttpStatus.FORBIDDEN);
                }
                return yield this.invoicePodService.saveSignaturePod(body, token);
            }
            else {
                return { message: "Please Provide Correct Type Of POD ", status: 400 };
            }
        });
    }
    renewPodLink(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.invoicePodService.renewPodLink(id);
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
};
tslib_1.__decorate([
    common_1.Get('details/:zohoInvoiceId'),
    tslib_1.__param(0, common_1.Param('zohoInvoiceId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], invoicePodController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post('uploadPod/:zohoInvoiceId'),
    tslib_1.__param(0, common_1.Param('zohoInvoiceId')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], invoicePodController.prototype, "savePod", null);
tslib_1.__decorate([
    common_1.Post('renewPodLink/:zohoInvoiceId'),
    tslib_1.__param(0, common_1.Param('zohoInvoiceId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], invoicePodController.prototype, "renewPodLink", null);
invoicePodController = tslib_1.__decorate([
    common_1.Controller('invoice'),
    tslib_1.__param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__param(1, typeorm_2.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__param(2, typeorm_2.InjectRepository(zohoSalesOrder_entity_1.zohoSalesOrder)),
    tslib_1.__param(3, typeorm_2.InjectRepository(zohoSalesOrderByUser_entity_1.zohoSalesOrderByUser)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        user_service_1.UserService,
        product_service_1.ProductService,
        invoicePod_service_1.invoicePodService])
], invoicePodController);
exports.invoicePodController = invoicePodController;
//# sourceMappingURL=invoicePod.controller.js.map