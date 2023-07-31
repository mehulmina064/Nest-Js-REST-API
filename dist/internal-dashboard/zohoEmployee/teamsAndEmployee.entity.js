"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["MEMBER"] = "MEMBER";
    Role["VIEWER"] = "VIEWER";
})(Role = exports.Role || (exports.Role = {}));
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
], prodoRoles.prototype, "teamId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: Role,
        default: Role.MEMBER,
    }),
    tslib_1.__metadata("design:type", Object)
], prodoRoles.prototype, "role", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], prodoRoles.prototype, "userId", void 0);
prodoRoles = tslib_1.__decorate([
    typeorm_1.Entity('UserAndRoles')
], prodoRoles);
exports.prodoRoles = prodoRoles;
//# sourceMappingURL=teamsAndEmployee.entity.js.map