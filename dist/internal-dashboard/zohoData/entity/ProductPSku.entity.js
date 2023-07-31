"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../../common/base-app.entity");
let ProductPSku = class ProductPSku extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], ProductPSku.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], ProductPSku.prototype, "pSkuId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], ProductPSku.prototype, "productSku", void 0);
ProductPSku = tslib_1.__decorate([
    typeorm_1.Entity('ProductParentSku')
], ProductPSku);
exports.ProductPSku = ProductPSku;
//# sourceMappingURL=ProductPSku.entity.js.map