"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const org_model_entity_1 = require("./../common/org-model.entity");
const roles_constants_1 = require("./roles.constants");
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["DELETED"] = "DELETED";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var UserType;
(function (UserType) {
    UserType["PRODO"] = "PRODO";
    UserType["ZOHO"] = "ZOHO";
})(UserType = exports.UserType || (exports.UserType = {}));
let User = class User extends org_model_entity_1.OrganizationModel {
    constructor() {
        super(...arguments);
        this.permissions = [];
        this.teams = [];
        this.orgRole = "";
        this.orgIds = [];
        this.orgIdRoles = [];
        this.companyIds = [];
        this.companyRole = "";
        this.companyIdRoles = [];
        this.entityRole = "";
        this.entityIds = [];
        this.entityIdRoles = [];
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "firstName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "lastName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "profilePicture", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: roles_constants_1.UserRole,
        default: [roles_constants_1.UserRole.USER, roles_constants_1.UserRole.CLIENT],
    }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "roles", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "designation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "companyName", void 0);
tslib_1.__decorate([
    typeorm_1.Unique(['email']),
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "contactNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "otp", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "gstin", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "businessEntityName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "businessContactNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "businessRegisteredAddress", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "businessCity", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "businessState", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "businessPinCode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: UserType,
        default: UserType.PRODO,
    }),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "userType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "accountId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "permissions", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "teams", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "orgRole", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "orgIds", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "orgIdRoles", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "companyId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "companyIds", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "companyRole", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "companyIdRoles", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "entityId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "entityRole", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "entityIds", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "entityIdRoles", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
User = tslib_1.__decorate([
    typeorm_1.Entity('users')
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map