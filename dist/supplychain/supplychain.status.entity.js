"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../common/common.entity");
const typeorm_1 = require("typeorm");
let SupplyChainStatus = class SupplyChainStatus extends common_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], SupplyChainStatus.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainStatus.prototype, "documentType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainStatus.prototype, "action", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainStatus.prototype, "actor", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainStatus.prototype, "statusforrequestee", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainStatus.prototype, "statusforrequestor", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainStatus.prototype, "statusforapprover", void 0);
SupplyChainStatus = tslib_1.__decorate([
    typeorm_1.Entity('SupplyChainStatus')
], SupplyChainStatus);
exports.SupplyChainStatus = SupplyChainStatus;
//# sourceMappingURL=supplychain.status.entity.js.map