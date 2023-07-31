"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../common/common.entity");
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["LOGISTICS"] = "LOGISTICS";
    OrganizationType["PRODO"] = "PRODO";
    OrganizationType["SUPPLIER"] = "SUPPLIER";
    OrganizationType["CLIENT"] = "CLIENT";
    OrganizationType["VENDOR"] = "VENDOR";
    OrganizationType["MANUFACTURER"] = "MANUFACTURER";
})(OrganizationType = exports.OrganizationType || (exports.OrganizationType = {}));
var OrganizationDomain;
(function (OrganizationDomain) {
    OrganizationDomain["PRODO"] = "PRODO";
    OrganizationDomain["MANUFACTURER"] = "MANUFACTURER";
    OrganizationDomain["DISTRIBUTOR"] = "DISTRIBUTOR";
    OrganizationDomain["SUPPLIER"] = "SUPPLIER";
    OrganizationDomain["PROCUREMENT"] = "PROCUREMENT";
    OrganizationDomain["INVENTORY"] = "INVENTORY";
    OrganizationDomain["PURCHASING"] = "PURCHASING";
    OrganizationDomain["SALES"] = "SALES";
    OrganizationDomain["ACCOUNTING"] = "ACCOUNTING";
    OrganizationDomain["HR"] = "HR";
    OrganizationDomain["ADMIN"] = "ADMIN";
    OrganizationDomain["FINANCE"] = "FINANCE";
    OrganizationDomain["CATALOGUE"] = "CATALOGUE";
    OrganizationDomain["ECOMMERCE"] = "ECOMMERCE";
    OrganizationDomain["MARKETING"] = "MARKETING";
    OrganizationDomain["CRM"] = "CRM";
    OrganizationDomain["LOGISTICS"] = "LOGISTICS";
    OrganizationDomain["OTHER"] = "OTHER";
})(OrganizationDomain = exports.OrganizationDomain || (exports.OrganizationDomain = {}));
var OrganizationStatus;
(function (OrganizationStatus) {
    OrganizationStatus["ACTIVE"] = "ACTIVE";
    OrganizationStatus["INACTIVE"] = "INACTIVE";
    OrganizationStatus["DELETED"] = "DELETED";
})(OrganizationStatus = exports.OrganizationStatus || (exports.OrganizationStatus = {}));
let Organization = class Organization extends common_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.companyIds = [];
        this.entityIds = [];
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], Organization.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: OrganizationStatus,
        default: OrganizationStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "description", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "billingAddressId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "shippingAddressId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "logo", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ type: 'enum', enum: OrganizationType, default: OrganizationType.CLIENT }),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_entity_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_contact_number", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_registered_address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_city", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_country", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_state", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_zip", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_phone", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_fax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_website", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_pan", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "gst_treatment", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "created_time", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "created_date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "last_modified_time", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "payment_terms", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "credit_limit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "created_by_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_gstin", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_cin", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "business_cin_image", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: OrganizationDomain,
        default: OrganizationDomain.PROCUREMENT,
    }),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "domains", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "parent_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "account_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "companyIds", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "entityIds", void 0);
tslib_1.__decorate([
    typeorm_1.Unique(['customerId']),
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "customerId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ default: 'IN' }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "country", void 0);
Organization = tslib_1.__decorate([
    typeorm_1.Entity('organizations')
], Organization);
exports.Organization = Organization;
//# sourceMappingURL=organization.entity.js.map