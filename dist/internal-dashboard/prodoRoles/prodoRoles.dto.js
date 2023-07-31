"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_app_dto_1 = require("../../common/base-app.dto");
const class_validator_1 = require("class-validator");
var roleStatus;
(function (roleStatus) {
    roleStatus["ACTIVE"] = "ACTIVE";
    roleStatus["INACTIVE"] = "INACTIVE";
    roleStatus["DELETED"] = "DELETED";
})(roleStatus = exports.roleStatus || (exports.roleStatus = {}));
class CreateRoleDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreateRoleDto.prototype, "roleName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateRoleDto.prototype, "roleDisplayName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(roleStatus),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateRoleDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateRoleDto.prototype, "isDefault", void 0);
exports.CreateRoleDto = CreateRoleDto;
class UpdateRoleDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateRoleDto.prototype, "roleName", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateRoleDto.prototype, "isDefault", void 0);
exports.UpdateRoleDto = UpdateRoleDto;
class CreateUserRoleDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateUserRoleDto.prototype, "roleId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateUserRoleDto.prototype, "userId", void 0);
exports.CreateUserRoleDto = CreateUserRoleDto;
class UpdateUserRoleDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateUserRoleDto.prototype, "roleId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateUserRoleDto.prototype, "userId", void 0);
exports.UpdateUserRoleDto = UpdateUserRoleDto;
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
//# sourceMappingURL=prodoRoles.dto.js.map