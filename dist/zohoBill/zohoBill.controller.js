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
const zohoBill_service_1 = require("./zohoBill.service");
let zohoBillController = class zohoBillController {
    constructor(userRepository, zohoBillService) {
        this.userRepository = userRepository;
        this.zohoBillService = zohoBillService;
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
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { purchaseorder_number: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { reference_number: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { order_status: { $regex: search, $options: 'i' } },
                            { received_status: { $regex: search, $options: 'i' } },
                            { billed_status: { $regex: search, $options: 'i' } },
                            { vendor_name: { $regex: search, $options: 'i' } },
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
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { purchaseorder_number: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { reference_number: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { order_status: { $regex: search, $options: 'i' } },
                            { received_status: { $regex: search, $options: 'i' } },
                            { billed_status: { $regex: search, $options: 'i' } },
                            { vendor_name: { $regex: search, $options: 'i' } },
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
                                { name: { $regex: search, $options: 'i' } },
                                { description: { $regex: search, $options: 'i' } },
                                { customerName: { $regex: search, $options: 'i' } },
                                { purchaseorder_number: { $regex: search, $options: 'i' } },
                                { date: { $regex: search, $options: 'i' } },
                                { reference_number: { $regex: search, $options: 'i' } },
                                { status: { $regex: search, $options: 'i' } },
                                { order_status: { $regex: search, $options: 'i' } },
                                { received_status: { $regex: search, $options: 'i' } },
                                { billed_status: { $regex: search, $options: 'i' } },
                                { vendor_name: { $regex: search, $options: 'i' } },
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
                                    { name: { $regex: search, $options: 'i' } },
                                    { description: { $regex: search, $options: 'i' } },
                                    { customerName: { $regex: search, $options: 'i' } },
                                    { purchaseorder_number: { $regex: search, $options: 'i' } },
                                    { date: { $regex: search, $options: 'i' } },
                                    { reference_number: { $regex: search, $options: 'i' } },
                                    { status: { $regex: search, $options: 'i' } },
                                    { order_status: { $regex: search, $options: 'i' } },
                                    { received_status: { $regex: search, $options: 'i' } },
                                    { billed_status: { $regex: search, $options: 'i' } },
                                    { vendor_name: { $regex: search, $options: 'i' } },
                                ],
                                $and: [
                                    ...attrFilter1
                                ]
                            }
                        };
                        result = yield this.zohoBillService.findAll(query1);
                    }
                    else {
                        result = yield this.zohoBillService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoBillService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
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
                let result = yield this.zohoBillService.saveFromZohoId(id);
                return { statusCode: 200, message: "successfully saved data for this bill", data: result };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Bill Id not found',
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
                let data = yield this.zohoBillService.zohoAll(page);
                if (data.count) {
                    let Orders = data.data;
                    for (let i = start; i < Orders.length; i++) {
                        let order = Orders[i];
                        let out = yield this.zohoBillService.saveFromZohoId(order.bill_id);
                        console.log("syncing Bill-", order.bill_id, "   ", "no-", i, "page-", page);
                        if (out) {
                            result.push({ bill_id: order.bill_id, response: out, statusCode: 200, message: "success", number: i });
                        }
                        else {
                            result.push({ bill_id: order.bill_id, error: "Error", statusCode: 500, message: "Data invalid", number: i });
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
                let data = yield this.zohoBillService.zohoAll(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All Orders From zoho", count: result.length, data: result };
        });
    }
    zohoOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.zohoBillService.InventoryByID(id);
            return { statusCode: 200, message: "Order Details from zoho mapped", data: data };
        });
    }
    getAttachment(purchaseOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.NOT_IMPLEMENTED,
                error: 'NOT_IMPLEMENTED',
                message: "NOT_IMPLEMENTED",
            }, common_2.HttpStatus.NOT_IMPLEMENTED);
            var attachment = yield this.zohoBillService.getAttachment(billId);
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
    Summary(billId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var Summary = yield this.zohoBillService.Summary(billId);
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
], zohoBillController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Post('syncOneBill'),
    tslib_1.__param(0, common_1.Body('bill_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoBillController.prototype, "updateOne", null);
tslib_1.__decorate([
    common_1.Post('syncAllBill/:start'),
    tslib_1.__param(0, common_1.Param('start')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoBillController.prototype, "updateAll", null);
tslib_1.__decorate([
    common_1.Get('zohoAllBill'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoBillController.prototype, "zohoAll", null);
tslib_1.__decorate([
    common_1.Get('zohoOneBill/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoBillController.prototype, "zohoOne", null);
tslib_1.__decorate([
    common_1.Get('getAttachment/:billId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('billId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoBillController.prototype, "getAttachment", null);
tslib_1.__decorate([
    common_1.Get('BillSummary/:billId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Summary.pdf'),
    tslib_1.__param(0, common_1.Param('billId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoBillController.prototype, "Summary", null);
zohoBillController = tslib_1.__decorate([
    common_1.Controller('zohoBill'),
    tslib_1.__param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        zohoBill_service_1.zohoBillService])
], zohoBillController);
exports.zohoBillController = zohoBillController;
//# sourceMappingURL=zohoBill.controller.js.map