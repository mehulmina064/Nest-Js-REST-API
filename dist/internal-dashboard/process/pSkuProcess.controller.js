"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const process_dto_1 = require("./process.dto");
const pSkuProcess_service_1 = require("./pSkuProcess.service");
const process_service_1 = require("./process.service");
const parentSku_service_1 = require("../parentSku/parentSku.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const fs = require('fs');
const http = require("https");
let PSkuProcessController = class PSkuProcessController {
    constructor(processService, PSkuProcessService, parentSkuService, zohoEmployeeService) {
        this.processService = processService;
        this.PSkuProcessService = PSkuProcessService;
        this.parentSkuService = parentSkuService;
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
                        { pSkuId: { $regex: search, $options: 'i' } },
                        { processId: { $regex: search, $options: 'i' } },
                    ]
                }
            };
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.PSkuProcessService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All  PSkuProcess", count: result.count, limit: limit, page: page, data: result.data };
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
            return this.PSkuProcessService.findOne(id);
        });
    }
    userRoles(pSkuId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let query = { where: { pSkuId: pSkuId } };
            let result = yield this.PSkuProcessService.findAll(query);
            return { statusCode: 200, message: "Test PSku Process", count: result.count, data: result.data };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.processService.check(role.processId);
            let permissionCheck = yield this.parentSkuService.check(role.pSkuId);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.createdBy = req.user.id;
                    return yield this.PSkuProcessService.save(role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'pSkuId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'ProcessId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.processService.check(role.processId);
            let permissionCheck = yield this.parentSkuService.check(role.pSkuId);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.updatedAt = new Date();
                    return yield this.PSkuProcessService.update(id, role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'pSkuId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'ProcessId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.PSkuProcessService.softRemove(id, req.user.id);
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
], PSkuProcessController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PSkuProcessController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('pSkuProcess/:pSkuId'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('pSkuId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PSkuProcessController.prototype, "userRoles", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [process_dto_1.CreatePSkuProcessDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PSkuProcessController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, process_dto_1.UpdatePSkuProcessDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PSkuProcessController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PSkuProcessController.prototype, "softDelete", null);
PSkuProcessController = tslib_1.__decorate([
    common_1.Controller('internal/pSkuProcess'),
    tslib_1.__metadata("design:paramtypes", [process_service_1.processService,
        pSkuProcess_service_1.PSkuProcessService,
        parentSku_service_1.parentSkuService,
        zohoEmployee_service_1.zohoEmployeeService])
], PSkuProcessController);
exports.PSkuProcessController = PSkuProcessController;
//# sourceMappingURL=pSkuProcess.controller.js.map