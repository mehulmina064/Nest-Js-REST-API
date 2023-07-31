"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./product.entity");
const product_service_1 = require("./product.service");
const product_controller_1 = require("./product.controller");
const category_module_1 = require("../categories/category.module");
const productRating_entity_1 = require("./productRating.entity");
const userReview_entity_1 = require("./userReview.entity");
const zohoPurchaseOrder_entity_1 = require("./../zohoPurchaseOrder/zohoPurchaseOrder.entity");
const zohoSalesOrder_entity_1 = require("./../zohoSalesOrder/zohoSalesOrder.entity");
let ProductModule = class ProductModule {
};
ProductModule = tslib_1.__decorate([
    common_1.Module({
        imports: [category_module_1.CategoryModule, typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, productRating_entity_1.ProductRating, userReview_entity_1.UserReview, zohoPurchaseOrder_entity_1.zohoPurchaseOrder, zohoSalesOrder_entity_1.zohoSalesOrder])],
        providers: [product_service_1.ProductService],
        controllers: [product_controller_1.ProductController],
        exports: [product_service_1.ProductService],
    })
], ProductModule);
exports.ProductModule = ProductModule;
//# sourceMappingURL=product.module.js.map