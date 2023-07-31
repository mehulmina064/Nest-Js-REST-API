"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const org_model_entity_1 = require("./../common/org-model.entity");
var entityStatus;
(function (entityStatus) {
    entityStatus["ACTIVE"] = "ACTIVE";
    entityStatus["INACTIVE"] = "INACTIVE";
    entityStatus["DELETED"] = "DELETED";
})(entityStatus = exports.entityStatus || (exports.entityStatus = {}));
let Entitie = class Entitie extends org_model_entity_1.OrganizationModel {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], Entitie.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Unique(['zipCode']),
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "zipCode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "entityName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "description", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: entityStatus,
        default: entityStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], Entitie.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "billingAddress", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "shippingAddress", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "entityContactNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ default: 'IN' }),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "entityCountry", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "entityState", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "entityCity", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Entitie.prototype, "companyId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Entitie.prototype, "branches", void 0);
Entitie = tslib_1.__decorate([
    typeorm_1.Entity('entities')
], Entitie);
exports.Entitie = Entitie;
//# sourceMappingURL=entity.entity.js.map