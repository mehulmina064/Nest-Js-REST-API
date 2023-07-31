"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const common_3 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const node_fetch_1 = require("node-fetch");
var request = require('request');
const fs = require('fs');
const http = require("https");
const internalInvoicePod_service_1 = require("./internalInvoicePod.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
let invoicePodController = class invoicePodController {
    constructor(zohoTokenRepository, invoicePodService, zohoEmployeeService) {
        this.zohoTokenRepository = zohoTokenRepository;
        this.invoicePodService = invoicePodService;
        this.zohoEmployeeService = zohoEmployeeService;
    }
    find() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.invoicePodService.findAll();
        });
    }
    findAll(req, search = "", status = "NA", limit = 500, page = 1, isEmployee = "NA") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            const attrFilter = [];
            if (status != "NA") {
                attrFilter.push({
                    "status": status
                });
            }
            if (isEmployee != "NA") {
                if (isEmployee == "true") {
                    attrFilter.push({
                        "isEmployee": true
                    });
                }
                else {
                    attrFilter.push({
                        "isEmployee": false
                    });
                }
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { contactNumber: { $regex: search, $options: 'i' } },
                            { designation: { $regex: search, $options: 'i' } },
                            { dateOfBerth: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { zohoUserId: { $regex: search, $options: 'i' } },
                        ],
                        $and: [
                            ...attrFilter
                        ]
                    }
                };
            }
            else {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { contactNumber: { $regex: search, $options: 'i' } },
                            { designation: { $regex: search, $options: 'i' } },
                            { dateOfBerth: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { zohoUserId: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.zohoEmployeeService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Employees", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoEmployeeService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Employees", count: result.count, limit: limit, page: page, data: result.data };
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
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
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], invoicePodController.prototype, "find", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(500), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('isEmployee', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], invoicePodController.prototype, "findAll", null);
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
    common_1.Controller('internal/InvoicePod'),
    tslib_1.__param(0, typeorm_2.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        internalInvoicePod_service_1.invoicePodService,
        zohoEmployee_service_1.zohoEmployeeService])
], invoicePodController);
exports.invoicePodController = invoicePodController;
//# sourceMappingURL=internalInvoicePod.controller.js.map