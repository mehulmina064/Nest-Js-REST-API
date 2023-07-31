"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const prodoRoles_entity_1 = require("./prodoRoles.entity");
const prodoRoles_dto_1 = require("./prodoRoles.dto");
const prodoRoles_service_1 = require("./prodoRoles.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const prodoPermission_service_1 = require("../prodoPermissionAndGroup/prodoPermission.service");
const rolesPermission_service_1 = require("../prodoPermissionAndGroup/rolesPermission.service");
var ObjectId = require('mongodb').ObjectID;
const fs = require('fs');
const http = require("https");
let prodoRolesController = class prodoRolesController {
    constructor(prodoRolesService, zohoEmployeeService, prodoPermissionService, rolesPermissionGroupService) {
        this.prodoRolesService = prodoRolesService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.prodoPermissionService = prodoPermissionService;
        this.rolesPermissionGroupService = rolesPermissionGroupService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1, isDefault = "NA") {
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
            if (isDefault != "NA") {
                if (isDefault == "true") {
                    attrFilter.push({
                        "isDefault": true
                    });
                }
                else {
                    attrFilter.push({
                        "isDefault": false
                    });
                }
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { roleName: { $regex: search, $options: 'i' } },
                            { roleDisplayName: { $regex: search, $options: 'i' } },
                            { roleDescription: { $regex: search, $options: 'i' } }
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
                            { roleName: { $regex: search, $options: 'i' } },
                            { roleDisplayName: { $regex: search, $options: 'i' } },
                            { roleDescription: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.prodoRolesService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Roles", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.prodoRolesService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Roles", count: result.count, limit: limit, page: page, data: result.data };
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
            let PermissionGroups = yield this.rolesPermissionGroupService.findAll({ where: { roleId: id } });
            let PermissionGroupsIds = [];
            for (let a of PermissionGroups.data) {
                PermissionGroupsIds.push({ _id: ObjectId(a.permissionGroupId) });
            }
            let yep = yield this.prodoPermissionService.findAll({ where: { $or: [...PermissionGroupsIds] } });
            let role = yield this.prodoRolesService.findOne(id);
            role.permissions = yep.data;
            return { statusCode: 200, message: "Details", data: role };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.updatedBy = req.user.id;
            role.createdBy = req.user.id;
            return yield this.prodoRolesService.save(role);
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (role.status == prodoRoles_entity_1.roleStatus.DELETED) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'status must be not ' + role.status,
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            role.updatedBy = req.user.id;
            role.updatedAt = new Date();
            return yield this.prodoRolesService.update(id, role);
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.prodoRolesService.softRemove(id, req.user.id);
        });
    }
    hardDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (req.user.roles.includes('PRODO_ADMIN')) {
                return yield this.prodoRolesService.hardRemove(id, req.user.id);
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.EXPECTATION_FAILED);
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
    tslib_1.__param(5, common_1.Query('isDefault', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], prodoRolesController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], prodoRolesController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [prodoRoles_dto_1.CreateRoleDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], prodoRolesController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, prodoRoles_dto_1.UpdateRoleDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], prodoRolesController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], prodoRolesController.prototype, "softDelete", null);
tslib_1.__decorate([
    common_1.Delete('permanentDelete/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], prodoRolesController.prototype, "hardDelete", null);
prodoRolesController = tslib_1.__decorate([
    common_1.Controller('internal/roles'),
    tslib_1.__metadata("design:paramtypes", [prodoRoles_service_1.prodoRolesService,
        zohoEmployee_service_1.zohoEmployeeService,
        prodoPermission_service_1.prodoPermissionService,
        rolesPermission_service_1.rolesPermissionGroupService])
], prodoRolesController);
exports.prodoRolesController = prodoRolesController;
//# sourceMappingURL=prodoRoles.controller.js.map