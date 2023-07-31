"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_app_dto_1 = require("../../../common/base-app.dto");
const class_validator_1 = require("class-validator");
class CreateProductPSkuDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProductPSkuDto.prototype, "pSkuId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProductPSkuDto.prototype, "productSku", void 0);
exports.CreateProductPSkuDto = CreateProductPSkuDto;
class UpdateProductPSkuDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateProductPSkuDto.prototype, "pSkuId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateProductPSkuDto.prototype, "productSku", void 0);
exports.UpdateProductPSkuDto = UpdateProductPSkuDto;
//# sourceMappingURL=ProductPSku.dto.js.map