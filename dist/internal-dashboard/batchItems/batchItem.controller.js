"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const batchItem_dto_1 = require("./batchItem.dto");
var request = require('request');
const fs = require('fs');
const http = require("https");
const batchItem_service_1 = require("./batchItem.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const batchItemProcess_service_1 = require("./batchItemProcess.service");
const process_service_1 = require("../process/process.service");
const batch_service_1 = require("../batches/batch.service");
const purchaseOrder_service_1 = require("../zohoData/services/purchaseOrder.service");
const productPSku_service_1 = require("../zohoData/services/productPSku.service");
var ObjectId = require('mongodb').ObjectID;
let batchItemController = class batchItemController {
    constructor(batchItemService, zohoEmployeeService, ProductPSkuService, processService, batchItemProcessService, batchService, internalPurchaseOrderService) {
        this.batchItemService = batchItemService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.ProductPSkuService = ProductPSkuService;
        this.processService = processService;
        this.batchItemProcessService = batchItemProcessService;
        this.batchService = batchService;
        this.internalPurchaseOrderService = internalPurchaseOrderService;
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
                            { itemId: { $regex: search, $options: 'i' } },
                            { purchaseOrderId: { $regex: search, $options: 'i' } },
                            { assignedTo: { $regex: search, $options: 'i' } },
                            { completionDate: { $regex: search, $options: 'i' } },
                            { quantity: { $regex: search, $options: 'i' } },
                            { dueDate: { $regex: search, $options: 'i' } },
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
                            { itemId: { $regex: search, $options: 'i' } },
                            { purchaseOrderId: { $regex: search, $options: 'i' } },
                            { assignedTo: { $regex: search, $options: 'i' } },
                            { completionDate: { $regex: search, $options: 'i' } },
                            { quantity: { $regex: search, $options: 'i' } },
                            { dueDate: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.batchItemService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All batchItems", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.batchItemService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All batchItems", count: result.count, limit: limit, page: page, data: result.data };
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
            let batchItemProcess = yield this.batchItemProcessService.findAll({ where: { batchItemId: id } });
            let batchItemProcessIds = [];
            let batchItem = yield this.batchItemService.findOne(id);
            if (batchItemProcess.count) {
                for (let a of batchItemProcess.data) {
                    batchItemProcessIds.push({ _id: ObjectId(a.processId) });
                }
                let yep = yield this.processService.findAll({ where: { $or: [...batchItemProcessIds] } });
                batchItem.process = yep.data;
            }
            else {
                batchItem.process = [];
            }
            let parentSku = yield this.ProductPSkuService.findAll({ where: { productSku: batchItem.sku } });
            if (parentSku.count) {
                batchItem.parentSku = parentSku.data;
            }
            else {
                batchItem.parentSku = [];
            }
            return { statusCode: 200, message: "Details", data: batchItem };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.updatedBy = req.user.id;
            role.createdBy = req.user.id;
            let check = yield this.batchService.check(role.batchId);
            if (!check) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Please add correct batch Id',
                    message: "Please add correct batch Id",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            let po = yield this.internalPurchaseOrderService.find(role.purchaseOrderId);
            if (!po) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Please add correct purchase order Id',
                    message: "Please add correct purchase order Id",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            let obj = po.line_items.find(o => (o.sku == role.sku));
            if (!obj) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Sku not present in this purchase order',
                    message: "Please add correct sku",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            if (role.quantity > obj.quantity) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Please add correct quantity',
                    message: "It should be less than or equal to " + obj.quantity,
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            let bacthItems = yield this.batchItemService.findAll({ where: { $and: [{ purchaseOrderId: role.purchaseOrderId }, { sku: role.sku }] } });
            let occupiedQuantity = 0;
            for (let i of bacthItems.data) {
                occupiedQuantity = occupiedQuantity + i.quantity;
            }
            let leftQuantity = obj.quantity - occupiedQuantity;
            if (role.quantity > leftQuantity) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Please add correct quantity',
                    message: "It should be less than or equal to the remaining Quantity " + leftQuantity,
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            role.parentSku = "";
            let save = yield this.batchItemService.save(role);
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
            let save = yield this.batchItemService.update(id, role);
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
            let save = yield this.batchItemService.softRemove(id, req.user.id);
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
                let save = yield this.batchItemService.addFields(id, req.user.id, body);
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
                let save = yield this.batchItemService.editFields(id, req.user.id, body);
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
], batchItemController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [batchItem_dto_1.CreateBatchItemDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, batchItem_dto_1.UpdateBatchItemDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemController.prototype, "softDelete", null);
tslib_1.__decorate([
    common_1.Post('addFields/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: batchItem_dto_1.CreateFieldDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemController.prototype, "addPermissions", null);
tslib_1.__decorate([
    common_1.Patch('editFields/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: batchItem_dto_1.CreateFieldDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemController.prototype, "editPermissions", null);
batchItemController = tslib_1.__decorate([
    common_1.Controller('internal/batchItem'),
    tslib_1.__metadata("design:paramtypes", [batchItem_service_1.batchItemService,
        zohoEmployee_service_1.zohoEmployeeService,
        productPSku_service_1.ProductPSkuService,
        process_service_1.processService,
        batchItemProcess_service_1.batchItemProcessService,
        batch_service_1.batchService,
        purchaseOrder_service_1.internalPurchaseOrderService])
], batchItemController);
exports.batchItemController = batchItemController;
//# sourceMappingURL=batchItem.controller.js.map