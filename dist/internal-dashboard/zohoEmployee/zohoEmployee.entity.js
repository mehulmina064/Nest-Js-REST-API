"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
const prodoRoles_constants_1 = require("./prodoRoles.constants");
class EmailId {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], EmailId.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], EmailId.prototype, "is_selected", void 0);
exports.EmailId = EmailId;
var ZohoEmployeeStatus;
(function (ZohoEmployeeStatus) {
    ZohoEmployeeStatus["ACTIVE"] = "active";
    ZohoEmployeeStatus["INACTIVE"] = "inactive";
    ZohoEmployeeStatus["DELETED"] = "deleted";
})(ZohoEmployeeStatus = exports.ZohoEmployeeStatus || (exports.ZohoEmployeeStatus = {}));
var UserType;
(function (UserType) {
    UserType["ZOHO"] = "zoho";
    UserType["PRODO"] = "prodo";
})(UserType = exports.UserType || (exports.UserType = {}));
let zohoEmployee = class zohoEmployee extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.teams = [];
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], zohoEmployee.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Date)
], zohoEmployee.prototype, "lastLoginAt", void 0);
tslib_1.__decorate([
    typeorm_1.Unique(['zohoUserId']),
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "zohoUserId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: prodoRoles_constants_1.UserRole,
        default: [prodoRoles_constants_1.UserRole.USER, prodoRoles_constants_1.UserRole.CLIENT],
    }),
    tslib_1.__metadata("design:type", Array)
], zohoEmployee.prototype, "roles", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "contactNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "password", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], zohoEmployee.prototype, "otp", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoEmployee.prototype, "emailIds", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: ZohoEmployeeStatus,
        default: ZohoEmployeeStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], zohoEmployee.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoEmployee.prototype, "teams", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "designation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: UserType,
        default: UserType.ZOHO,
    }),
    tslib_1.__metadata("design:type", Object)
], zohoEmployee.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "profile", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "dateOfBerth", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoEmployee.prototype, "isEmployee", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoEmployee.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoEmployee.prototype, "associatedClients", void 0);
zohoEmployee = tslib_1.__decorate([
    typeorm_1.Entity('ZohoEmployee')
], zohoEmployee);
exports.zohoEmployee = zohoEmployee;
//# sourceMappingURL=zohoEmployee.entity.js.map