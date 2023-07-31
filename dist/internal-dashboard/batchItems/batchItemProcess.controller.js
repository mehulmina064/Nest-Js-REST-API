"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const batchItem_dto_1 = require("./batchItem.dto");
const batchItemProcess_service_1 = require("./batchItemProcess.service");
const process_service_1 = require("../process/process.service");
const batchItem_service_1 = require("../batchItems/batchItem.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const fs = require('fs');
const http = require("https");
let batchItemProcessController = class batchItemProcessController {
    constructor(processService, batchItemProcessService, batchItemService, zohoEmployeeService) {
        this.processService = processService;
        this.batchItemProcessService = batchItemProcessService;
        this.batchItemService = batchItemService;
        this.zohoEmployeeService = zohoEmployeeService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            let query = {
                where: {
                    $or: [
                        { batchItemId: { $regex: search, $options: 'i' } },
                        { processId: { $regex: search, $options: 'i' } },
                        { assignedTo: { $regex: search, $options: 'i' } },
                        { dueDate: { $regex: search, $options: 'i' } },
                        { completionDate: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                    ]
                }
            };
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.batchItemProcessService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All batch items process", count: result.count, limit: limit, page: page, data: result.data };
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
            return this.batchItemProcessService.findOne(id);
        });
    }
    userRoles(batchItemId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let query = { where: { batchItemId: batchItemId } };
            let result = yield this.batchItemProcessService.findAll(query);
            return { statusCode: 200, message: "Test batchItem process", count: result.count, data: result.data };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.processService.check(role.processId);
            let permissionCheck = yield this.batchItemService.check(role.batchItemId);
            if (roleCheck) {
                if (permissionCheck) {
                    if (permissionCheck.parentSku) {
                        role.updatedBy = req.user.id;
                        role.createdBy = req.user.id;
                        return yield this.batchItemProcessService.save(role);
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.BAD_REQUEST,
                            error: 'EXPECTATION_FAILED',
                            message: 'Parent SKU of Batch Item is not defined please add by BatchItem Section',
                        }, common_2.HttpStatus.BAD_REQUEST);
                    }
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
                    message: 'processId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.processService.check(role.processId);
            let permissionCheck = yield this.batchItemService.check(role.batchItemId);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.updatedAt = new Date();
                    return yield this.batchItemProcessService.update(id, role);
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
                    message: 'processId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.batchItemProcessService.softRemove(id, req.user.id);
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
], batchItemProcessController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemProcessController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('batchItemProcess/:batchItemId'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('batchItemId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemProcessController.prototype, "userRoles", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [batchItem_dto_1.CreateBatchItemProcessDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemProcessController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, batchItem_dto_1.UpdateBatchItemProcessDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemProcessController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], batchItemProcessController.prototype, "softDelete", null);
batchItemProcessController = tslib_1.__decorate([
    common_1.Controller('internal/batchItemProcess'),
    tslib_1.__metadata("design:paramtypes", [process_service_1.processService,
        batchItemProcess_service_1.batchItemProcessService,
        batchItem_service_1.batchItemService,
        zohoEmployee_service_1.zohoEmployeeService])
], batchItemProcessController);
exports.batchItemProcessController = batchItemProcessController;
//# sourceMappingURL=batchItemProcess.controller.js.map