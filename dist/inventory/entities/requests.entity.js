"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const org_model_entity_1 = require("../../common/org-model.entity");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let InventoryTransferRequest = class InventoryTransferRequest extends org_model_entity_1.OrganizationModel {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], InventoryTransferRequest.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "code", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "item_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "inventory_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "warehouse_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "warehouse_id_to", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], InventoryTransferRequest.prototype, "uom", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], InventoryTransferRequest.prototype, "quantity", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], InventoryTransferRequest.prototype, "isApproved", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], InventoryTransferRequest.prototype, "isCompleted", void 0);
InventoryTransferRequest = tslib_1.__decorate([
    typeorm_1.Entity('inventory-transfer-requests')
], InventoryTransferRequest);
exports.InventoryTransferRequest = InventoryTransferRequest;
//# sourceMappingURL=requests.entity.js.map