"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const fulfillmentTracker_dto_1 = require("./fulfillmentTracker.dto");
var request = require('request');
const fs = require('fs');
const http = require("https");
const fulfillmentTracker_service_1 = require("./fulfillmentTracker.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const salesOrder_service_1 = require("../zohoData/services/salesOrder.service");
const batch_service_1 = require("../batches/batch.service");
let fulfillmentTrackerController = class fulfillmentTrackerController {
    constructor(fulfillmentTrackerService, zohoEmployeeService, batchService, internalSalesOrderService) {
        this.fulfillmentTrackerService = fulfillmentTrackerService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.batchService = batchService;
        this.internalSalesOrderService = internalSalesOrderService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1) {
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
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { salesOrderId: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { companyName: { $regex: search, $options: 'i' } },
                            { salesOrderNumber: { $regex: search, $options: 'i' } },
                            { businessLead: { $regex: search, $options: 'i' } },
                            { fulfillmentLead: { $regex: search, $options: 'i' } },
                            { productionDate: { $regex: search, $options: 'i' } },
                            { fulfillmentDate: { $regex: search, $options: 'i' } },
                            { clientPurchaseOrderDate: { $regex: search, $options: 'i' } },
                            { completionDate: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
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
                            { salesOrderId: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { companyName: { $regex: search, $options: 'i' } },
                            { salesOrderNumber: { $regex: search, $options: 'i' } },
                            { businessLead: { $regex: search, $options: 'i' } },
                            { fulfillmentLead: { $regex: search, $options: 'i' } },
                            { productionDate: { $regex: search, $options: 'i' } },
                            { fulfillmentDate: { $regex: search, $options: 'i' } },
                            { clientPurchaseOrderDate: { $regex: search, $options: 'i' } },
                            { completionDate: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.fulfillmentTrackerService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All FulfillmentTracker", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.fulfillmentTrackerService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All FulfillmentTracker", count: result.count, limit: limit, page: page, data: result.data };
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
            let ft = yield this.fulfillmentTrackerService.findOne(id);
            let batches = yield this.batchService.findAll({ where: { salesOrderId: ft.salesOrderId } });
            ft.batches = batches.data;
            return { statusCode: 200, message: "Details", data: ft };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.updatedBy = req.user.id;
            role.createdBy = req.user.id;
            let check = yield this.internalSalesOrderService.check(role.salesOrderId);
            if (!check) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Please add correct sales order Id',
                    message: "Please add correct sales order Id",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            let save = yield this.fulfillmentTrackerService.save(role);
            if (save) {
                return { statusCode: 200, message: "Successfully created", data: save };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Not saved',
                    message: "Not saved",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.updatedBy = req.user.id;
            role.updatedAt = new Date();
            let save = yield this.fulfillmentTrackerService.update(id, role);
            if (save) {
                return { statusCode: 200, message: "Successfully updated", data: save };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Not updated',
                    message: "Not updated",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let save = yield this.fulfillmentTrackerService.softRemove(id, req.user.id);
            if (save) {
                return { statusCode: 200, message: "Successfully Deleted", data: save };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Not Deleted',
                    message: "Not Deleted",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    addPermissions(id, req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d = body.map(item => item.apiName);
            if (new Set(d).size !== d.length) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'apiName name must be unique',
                    message: 'apiName name must be unique',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                let save = yield this.fulfillmentTrackerService.addFields(id, req.user.id, body);
                if (save) {
                    return { statusCode: 200, message: "Successfully added fields", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not added fields',
                        message: "Not added fields",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    editPermissions(id, req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d = body.map(item => item.apiName);
            if (new Set(d).size !== d.length) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'apiName name must be unique',
                    message: 'apiName name must be unique',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                let save = yield this.fulfillmentTrackerService.editFields(id, req.user.id, body);
                if (save) {
                    return { statusCode: 200, message: "Successfully updated fields", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not updated fields',
                        message: "Not updated fields",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [fulfillmentTracker_dto_1.CreateFTDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, fulfillmentTracker_dto_1.UpdateFTDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "softDelete", null);
tslib_1.__decorate([
    common_1.Post('addFields/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: fulfillmentTracker_dto_1.CreateFieldDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "addPermissions", null);
tslib_1.__decorate([
    common_1.Patch('editFields/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: fulfillmentTracker_dto_1.CreateFieldDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], fulfillmentTrackerController.prototype, "editPermissions", null);
fulfillmentTrackerController = tslib_1.__decorate([
    common_1.Controller('internal/FulfillmentTracker'),
    tslib_1.__metadata("design:paramtypes", [fulfillmentTracker_service_1.fulfillmentTrackerService,
        zohoEmployee_service_1.zohoEmployeeService,
        batch_service_1.batchService,
        salesOrder_service_1.internalSalesOrderService])
], fulfillmentTrackerController);
exports.fulfillmentTrackerController = fulfillmentTrackerController;
//# sourceMappingURL=fulfillment.cntroller.js.map