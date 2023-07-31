"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const batch_dto_1 = require("./batch.dto");
const batchItemConnection_service_1 = require("./batchItemConnection.service");
const batch_service_1 = require("./batch.service");
const batchItem_service_1 = require("../batchItems/batchItem.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
var ObjectId = require('mongodb').ObjectID;
const fs = require('fs');
const http = require("https");
let batchItemConnectionController = class batchItemConnectionController {
    constructor(batchService, batchItemConnectionService, batchItemService, zohoEmployeeService) {
        this.batchService = batchService;
        this.batchItemConnectionService = batchItemConnectionService;
        this.batchItemService = batchItemService;
        this.zohoEmployeeService = zohoEmployeeService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = yield this.zohoEmployeeService.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let query = {
                where: {
                    $or: [
                        { batchId: { $regex: search, $options: 'i' } },
                        { batchItemId: { $regex: search, $options: 'i' } },
                    ]
                }
            };
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.batchItemConnectionService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All batch items connections", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: 'User does not have permission to perform this action',
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
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
            return this.batchItemConnectionService.findOne(id);
        });
    }
    userRoles(batchId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let query = { where: { batchId: batchId } };
            let result = yield this.batchItemConnectionService.findAll(query);
            return { statusCode: 200, message: "Test batch items", count: result.count, data: result.data };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.batchService.check(role.batchId);
            let permissionCheck = yield this.batchItemService.check(role.batchItemId);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.createdBy = req.user.id;
                    return yield this.batchItemConnectionService.save(role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'batchItemId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'batchId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.batchService.check(role.batchId);
            let permissionCheck = yield this.batchItemService.check(role.batchItemId);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.updatedAt = new Date();
                    return yield this.batchItemConnectionService.update(id, role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'batchItemId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'batchId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.batchItemConnectionService.softRemove(id, req.user.id);
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
], batchItemConnectionController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemConnectionController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('batchItems/:batchId'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('batchId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemConnectionController.prototype, "userRoles", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [batch_dto_1.CreateBatchItemConnectionDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemConnectionController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, batch_dto_1.UpdateBatchItemConnectionDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemConnectionController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemConnectionController.prototype, "softDelete", null);
batchItemConnectionController = tslib_1.__decorate([
    common_1.Controller('internal/batchItemConnection'),
    tslib_1.__metadata("design:paramtypes", [batch_service_1.batchService,
        batchItemConnection_service_1.batchItemConnectionService,
        batchItem_service_1.batchItemService,
        zohoEmployee_service_1.zohoEmployeeService])
], batchItemConnectionController);
exports.batchItemConnectionController = batchItemConnectionController;
//# sourceMappingURL=batchItemConnection.controller.js.map