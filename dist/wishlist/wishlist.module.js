"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wishlist_entity_1 = require("./wishlist.entity");
const wishlist_service_1 = require("./wishlist.service");
const wishlist_controller_1 = require("./wishlist.controller");
const product_module_1 = require("../product/product.module");
let WishlistModule = class WishlistModule {
};
WishlistModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([wishlist_entity_1.Wishlist]), product_module_1.ProductModule],
        providers: [wishlist_service_1.WishlistService],
        controllers: [wishlist_controller_1.WishlistController],
    })
], WishlistModule);
exports.WishlistModule = WishlistModule;
//# sourceMappingURL=wishlist.module.js.map