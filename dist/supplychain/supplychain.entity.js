"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const org_model_entity_1 = require("../common/org-model.entity");
const typeorm_1 = require("typeorm");
var SupplyChainType;
(function (SupplyChainType) {
    SupplyChainType["PurchaseOrder"] = "PurchaseOrder";
    SupplyChainType["ECOMMERCE"] = "ECOMMERCE";
    SupplyChainType["RFQ"] = "RFQ";
    SupplyChainType["Other"] = "Other";
})(SupplyChainType = exports.SupplyChainType || (exports.SupplyChainType = {}));
let SupplyChain = class SupplyChain extends org_model_entity_1.OrganizationModel {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], SupplyChain.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ enum: SupplyChainType, nullable: true }),
    tslib_1.__metadata("design:type", String)
], SupplyChain.prototype, "supplychainType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ unique: true }),
    tslib_1.__metadata("design:type", String)
], SupplyChain.prototype, "supplychainSerialNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChain.prototype, "supplychainName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChain.prototype, "supplychainDescription", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChain.prototype, "supplychainStatus", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], SupplyChain.prototype, "supplychainStartDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], SupplyChain.prototype, "supplychainEndDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], SupplyChain.prototype, "supplychainItems", void 0);
SupplyChain = tslib_1.__decorate([
    typeorm_1.Entity('SupplyChain')
], SupplyChain);
exports.SupplyChain = SupplyChain;
//# sourceMappingURL=supplychain.entity.js.map