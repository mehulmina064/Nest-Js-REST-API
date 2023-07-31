"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let SupplyChainAction = class SupplyChainAction {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], SupplyChainAction.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainAction.prototype, "documentType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainAction.prototype, "action", void 0);
SupplyChainAction = tslib_1.__decorate([
    typeorm_1.Entity('SupplyChainAction')
], SupplyChainAction);
exports.SupplyChainAction = SupplyChainAction;
//# sourceMappingURL=supplychain-action.entity.js.map