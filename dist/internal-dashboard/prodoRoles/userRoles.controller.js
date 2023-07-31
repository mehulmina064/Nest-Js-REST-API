"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const prodoRoles_dto_1 = require("./prodoRoles.dto");
const prodoRoles_service_1 = require("./prodoRoles.service");
const userRoles_service_1 = require("./userRoles.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const fs = require('fs');
const http = require("https");
let userRolesController = class userRolesController {
    constructor(prodoRolesService, zohoEmployeeService, userRolesService) {
        this.prodoRolesService = prodoRolesService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.userRolesService = userRolesService;
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
                        { roleId: { $regex: search, $options: 'i' } },
                        { userId: { $regex: search, $options: 'i' } },
                    ]
                }
            };
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.userRolesService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All UserRoles", count: result.count, limit: limit, page: page, data: result.data };
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
            return yield this.userRolesService.findOne(id);
        });
    }
    userRoles(userId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let query = { where: { userId: userId } };
            if (req.user.id == userId || req.user.roles.includes('PRODO_ADMIN')) {
                let result = yield this.userRolesService.findAll(query);
                return { statusCode: 200, message: "Your Roles", count: result.count, data: result.data };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.prodoRolesService.check(role.roleId);
            let userCheck = yield this.zohoEmployeeService.check(role.userId);
            if (roleCheck) {
                if (userCheck) {
                    role.updatedBy = req.user.id;
                    role.createdBy = req.user.id;
                    return yield this.userRolesService.save(role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'UserId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'RoleId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.prodoRolesService.check(role.roleId);
            let userCheck = yield this.zohoEmployeeService.check(role.userId);
            if (roleCheck) {
                if (userCheck) {
                    role.updatedBy = req.user.id;
                    role.updatedAt = new Date();
                    return yield this.userRolesService.update(id, role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'UserId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'RoleId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userRolesService.softRemove(id, req.user.id);
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
], userRolesController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], userRolesController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('myRoles/:userId'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('userId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userRolesController.prototype, "userRoles", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [prodoRoles_dto_1.CreateUserRoleDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userRolesController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, prodoRoles_dto_1.UpdateUserRoleDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userRolesController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userRolesController.prototype, "softDelete", null);
userRolesController = tslib_1.__decorate([
    common_1.Controller('internal/userRoles'),
    tslib_1.__metadata("design:paramtypes", [prodoRoles_service_1.prodoRolesService,
        zohoEmployee_service_1.zohoEmployeeService,
        userRoles_service_1.userRolesService])
], userRolesController);
exports.userRolesController = userRolesController;
//# sourceMappingURL=userRoles.controller.js.map