"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const org_model_entity_1 = require("./../common/org-model.entity");
var companyStatus;
(function (companyStatus) {
    companyStatus["ACTIVE"] = "ACTIVE";
    companyStatus["INACTIVE"] = "INACTIVE";
    companyStatus["DELETED"] = "DELETED";
})(companyStatus = exports.companyStatus || (exports.companyStatus = {}));
let Company = class Company extends org_model_entity_1.OrganizationModel {
    constructor() {
        super(...arguments);
        this.entityIds = [];
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], Company.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Unique(['gstNo']),
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "gstNo", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ default: 'IN' }),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "companyCountry", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "companyName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "description", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: companyStatus,
        default: companyStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], Company.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "logo", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Company.prototype, "companyCin", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Company.prototype, "companyCinImage", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "companyContactNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Company.prototype, "companyState", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Company.prototype, "entityIds", void 0);
Company = tslib_1.__decorate([
    typeorm_1.Entity('company')
], Company);
exports.Company = Company;
//# sourceMappingURL=company.entity.js.map