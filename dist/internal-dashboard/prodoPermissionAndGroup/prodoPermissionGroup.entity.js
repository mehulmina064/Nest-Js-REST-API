"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
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
let prodoPermissionGroup = class prodoPermissionGroup extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], prodoPermissionGroup.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoPermissionGroup.prototype, "permissionGroupName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoPermissionGroup.prototype, "permissionGroupDisplayName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        default: 'ALL'
    }),
    tslib_1.__metadata("design:type", String)
], prodoPermissionGroup.prototype, "accessType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: permissionGroupStatus,
        default: permissionGroupStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], prodoPermissionGroup.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], prodoPermissionGroup.prototype, "isDefault", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoPermissionGroup.prototype, "permissionGroupDescription", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], prodoPermissionGroup.prototype, "permissions", void 0);
prodoPermissionGroup = tslib_1.__decorate([
    typeorm_1.Entity('ProdoPermissionGroup')
], prodoPermissionGroup);
exports.prodoPermissionGroup = prodoPermissionGroup;
//# sourceMappingURL=prodoPermissionGroup.entity.js.map