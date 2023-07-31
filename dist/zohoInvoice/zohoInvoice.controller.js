"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("../users/user.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const common_2 = require("@nestjs/common");
const roles_constants_1 = require("../users/roles.constants");
const typeorm_2 = require("@nestjs/typeorm");
var request = require('request');
const fs = require('fs');
const http = require("https");
const zohoInvoice_service_1 = require("./zohoInvoice.service");
let zohoInvoiceController = class zohoInvoiceController {
    constructor(userRepository, zohoInvoiceService) {
        this.userRepository = userRepository;
        this.zohoInvoiceService = zohoInvoiceService;
    }
    findAll(req, search = "", status = "", limit = 500, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            const attrFilter = [];
            if (status) {
                attrFilter.push({
                    "status": status
                });
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { invoice_id: { $regex: search, $options: 'i' } },
                            { invoice_number: { $regex: search, $options: 'i' } },
                            { customer_name: { $regex: search, $options: 'i' } },
                            { place_of_supply: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { total: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { gst_no: { $regex: search, $options: 'i' } },
                            { salesperson_name: { $regex: search, $options: 'i' } },
                            { submitted_by: { $regex: search, $options: 'i' } },
                            { customer_id: { $regex: search, $options: 'i' } },
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
                            { invoice_id: { $regex: search, $options: 'i' } },
                            { invoice_number: { $regex: search, $options: 'i' } },
                            { customer_name: { $regex: search, $options: 'i' } },
                            { place_of_supply: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { total: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { gst_no: { $regex: search, $options: 'i' } },
                            { salesperson_name: { $regex: search, $options: 'i' } },
                            { submitted_by: { $regex: search, $options: 'i' } },
                            { customer_id: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    let query1 = {
                        where: {
                            $or: [
                                { invoice_id: { $regex: search, $options: 'i' } },
                                { invoice_number: { $regex: search, $options: 'i' } },
                                { customer_name: { $regex: search, $options: 'i' } },
                                { place_of_supply: { $regex: search, $options: 'i' } },
                                { date: { $regex: search, $options: 'i' } },
                                { total: { $regex: search, $options: 'i' } },
                                { status: { $regex: search, $options: 'i' } },
                                { gst_no: { $regex: search, $options: 'i' } },
                                { salesperson_name: { $regex: search, $options: 'i' } },
                                { submitted_by: { $regex: search, $options: 'i' } },
                                { customer_id: { $regex: search, $options: 'i' } },
                            ]
                        }
                    };
                    let attrFilter1 = [];
                    if (status) {
                        attrFilter1.push({
                            "status": status
                        });
                        let query1 = {
                            where: {
                                $or: [
                                    { invoice_id: { $regex: search, $options: 'i' } },
                                    { invoice_number: { $regex: search, $options: 'i' } },
                                    { customer_name: { $regex: search, $options: 'i' } },
                                    { place_of_supply: { $regex: search, $options: 'i' } },
                                    { date: { $regex: search, $options: 'i' } },
                                    { total: { $regex: search, $options: 'i' } },
                                    { status: { $regex: search, $options: 'i' } },
                                    { gst_no: { $regex: search, $options: 'i' } },
                                    { salesperson_name: { $regex: search, $options: 'i' } },
                                    { submitted_by: { $regex: search, $options: 'i' } },
                                    { customer_id: { $regex: search, $options: 'i' } },
                                ],
                                $and: [
                                    ...attrFilter1
                                ]
                            }
                        };
                        result = yield this.zohoInvoiceService.findAll(query1);
                    }
                    else {
                        result = yield this.zohoInvoiceService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Invoices", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoInvoiceService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Invoices", count: result.count, limit: limit, page: page, data: result.data };
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
    updateOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (id) {
                let result = yield this.zohoInvoiceService.saveFromZohoId(id);
                return { statusCode: 200, message: "successfully saved data for this invoice", data: result };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'invoice Id not found',
                    message: "id not found in Request",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    updateAll(start) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = [];
            let page = 1;
            if (start > 200) {
                if (start % 200) {
                    page = ((start - start % 200) / 200) + 1;
                    start = start % 200;
                }
                else {
                    page = start / 200;
                }
            }
            console.log(page);
            for (page; page > 0; page++) {
                let data = yield this.zohoInvoiceService.zohoAll(page);
                if (data.count) {
                    let Orders = data.data;
                    for (let i = start; i < Orders.length; i++) {
                        let order = Orders[i];
                        let out = yield this.zohoInvoiceService.saveFromZohoId(order.invoice_id);
                        console.log("syncing Invoice-", order.invoice_id, "   ", "no-", i, "page-", page);
                        if (out) {
                            result.push({ invoice_id: order.invoice_id, response: out, statusCode: 200, message: "success", number: i });
                        }
                        else {
                            result.push({ invoice_id: order.invoice_id, error: "Error", statusCode: 500, message: "Data invalid", number: i });
                        }
                    }
                    start = 0;
                }
                else {
                    break;
                }
            }
            return result;
        });
    }
    zohoAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.zohoInvoiceService.zohoAll(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All invoices From zoho", count: result.length, data: result };
        });
    }
    zohoOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.zohoInvoiceService.InventoryByID(id);
            return { statusCode: 200, message: "Order Details from zoho mapped", data: data };
        });
    }
    getAttachment(invoiceId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.NOT_IMPLEMENTED,
                error: 'NOT_IMPLEMENTED',
                message: "NOT_IMPLEMENTED",
            }, common_2.HttpStatus.NOT_IMPLEMENTED);
            var attachment = yield this.zohoInvoiceService.getAttachment(invoiceId);
            if (attachment) {
                attachment.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Attachment not found',
                    message: "Attachment not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    Summary(invoiceId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var Summary = yield this.zohoInvoiceService.Summary(invoiceId);
            if (Summary) {
                Summary.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Summary not found',
                    message: "Summary not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(500), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Post('syncOneInvoice'),
    tslib_1.__param(0, common_1.Body('invoice_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "updateOne", null);
tslib_1.__decorate([
    common_1.Post('syncAllInvoice/:start'),
    tslib_1.__param(0, common_1.Param('start')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "updateAll", null);
tslib_1.__decorate([
    common_1.Get('zohoAllInvoice'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "zohoAll", null);
tslib_1.__decorate([
    common_1.Get('zohoOneInvoice/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "zohoOne", null);
tslib_1.__decorate([
    common_1.Get('getAttachment/:invoiceId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('invoiceId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "getAttachment", null);
tslib_1.__decorate([
    common_1.Get('InvoiceSummary/:invoiceId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Summary.pdf'),
    tslib_1.__param(0, common_1.Param('invoiceId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoInvoiceController.prototype, "Summary", null);
zohoInvoiceController = tslib_1.__decorate([
    common_1.Controller('zohoInvoice'),
    tslib_1.__param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        zohoInvoice_service_1.zohoInvoiceService])
], zohoInvoiceController);
exports.zohoInvoiceController = zohoInvoiceController;
//# sourceMappingURL=zohoInvoice.controller.js.map