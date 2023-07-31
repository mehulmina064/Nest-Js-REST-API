"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
let RolesAndPermission = class RolesAndPermission extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], RolesAndPermission.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], RolesAndPermission.prototype, "roleId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], RolesAndPermission.prototype, "permissionGroupId", void 0);
RolesAndPermission = tslib_1.__decorate([
    typeorm_1.Entity('RolesAndPermission')
], RolesAndPermission);
exports.RolesAndPermission = RolesAndPermission;
//# sourceMappingURL=prodoRolesAndPermissionGroups.entity.js.map