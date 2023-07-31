"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_dto_1 = require("../../common/base-app.dto");
const moduleNames_constant_1 = require("./moduleNames.constant");
const class_validator_1 = require("class-validator");
var permissionGroupStatus;
(function (permissionGroupStatus) {
    permissionGroupStatus["ACTIVE"] = "ACTIVE";
    permissionGroupStatus["INACTIVE"] = "INACTIVE";
    permissionGroupStatus["DELETED"] = "DELETED";
})(permissionGroupStatus = exports.permissionGroupStatus || (exports.permissionGroupStatus = {}));
class MorePermission {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MorePermission.prototype, "permission", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MorePermission.prototype, "permissionFormatted", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], MorePermission.prototype, "is_enabled", void 0);
exports.MorePermission = MorePermission;
class Permission {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Permission.prototype, "moduleName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "fullAccess", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "canShare", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "canExport", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "canCreate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "canDelete", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "canView", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Permission.prototype, "canEdit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Date)
], Permission.prototype, "createdAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Date)
], Permission.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Permission.prototype, "morePermissions", void 0);
exports.Permission = Permission;
class CreateModulePermissionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateModulePermissionDto.prototype, "moduleName", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "fullAccess", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canShare", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canExport", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canCreate", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canDelete", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canView", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canEdit", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateModulePermissionDto.prototype, "canView", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    tslib_1.__metadata("design:type", Array)
], CreateModulePermissionDto.prototype, "morePermissions", void 0);
exports.CreateModulePermissionDto = CreateModulePermissionDto;
class UpdateModulePermissionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateModulePermissionDto.prototype, "moduleName", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "fullAccess", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canShare", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canExport", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canCreate", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canDelete", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canView", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canEdit", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateModulePermissionDto.prototype, "canView", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    tslib_1.__metadata("design:type", Array)
], UpdateModulePermissionDto.prototype, "morePermissions", void 0);
exports.UpdateModulePermissionDto = UpdateModulePermissionDto;
class CreateRolePermissionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateRolePermissionDto.prototype, "roleId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateRolePermissionDto.prototype, "permissionGroupId", void 0);
exports.CreateRolePermissionDto = CreateRolePermissionDto;
class UpdateRolePermissionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateRolePermissionDto.prototype, "roleId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateRolePermissionDto.prototype, "permissionGroupId", void 0);
exports.UpdateRolePermissionDto = UpdateRolePermissionDto;
class CreatePermissionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreatePermissionDto.prototype, "permissionGroupName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreatePermissionDto.prototype, "permissionGroupDisplayName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(permissionGroupStatus),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreatePermissionDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePermissionDto.prototype, "isDefault", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Array)
], CreatePermissionDto.prototype, "permissions", void 0);
exports.CreatePermissionDto = CreatePermissionDto;
class UpdatePermissionDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdatePermissionDto.prototype, "permissionGroupName", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePermissionDto.prototype, "isDefault", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Array)
], UpdatePermissionDto.prototype, "permissions", void 0);
exports.UpdatePermissionDto = UpdatePermissionDto;
//# sourceMappingURL=rolePermission.dto.js.map