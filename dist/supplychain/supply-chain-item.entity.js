"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../common/common.entity");
const typeorm_1 = require("typeorm");
let SupplyChainFeedItem = class SupplyChainFeedItem extends common_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], SupplyChainFeedItem.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ type: 'int', nullable: true }),
    typeorm_1.Generated('increment'),
    tslib_1.__metadata("design:type", Object)
], SupplyChainFeedItem.prototype, "index", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainFeedItem.prototype, "documentId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainFeedItem.prototype, "action", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], SupplyChainFeedItem.prototype, "actionDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], SupplyChainFeedItem.prototype, "actor", void 0);
SupplyChainFeedItem = tslib_1.__decorate([
    typeorm_1.Entity('SupplyChainFeedItem')
], SupplyChainFeedItem);
exports.SupplyChainFeedItem = SupplyChainFeedItem;
//# sourceMappingURL=supply-chain-item.entity.js.map