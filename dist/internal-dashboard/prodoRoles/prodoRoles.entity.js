"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
var roleStatus;
(function (roleStatus) {
    roleStatus["ACTIVE"] = "ACTIVE";
    roleStatus["INACTIVE"] = "INACTIVE";
    roleStatus["DELETED"] = "DELETED";
})(roleStatus = exports.roleStatus || (exports.roleStatus = {}));
let prodoRoles = class prodoRoles extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], prodoRoles.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoRoles.prototype, "roleName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoRoles.prototype, "roleDisplayName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: roleStatus,
        default: roleStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], prodoRoles.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], prodoRoles.prototype, "isDefault", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoRoles.prototype, "roleDescription", void 0);
prodoRoles = tslib_1.__decorate([
    typeorm_1.Entity('ProdoRoles')
], prodoRoles);
exports.prodoRoles = prodoRoles;
//# sourceMappingURL=prodoRoles.entity.js.map