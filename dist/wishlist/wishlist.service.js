"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_entity_1 = require("./wishlist.entity");
const product_service_1 = require("../product/product.service");
const crypto = require('crypto');
let WishlistService = class WishlistService {
    constructor(wishlistRepository, productService) {
        this.wishlistRepository = wishlistRepository;
        this.productService = productService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.wishlistRepository.find();
        });
    }
    findByUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const wishlist = yield this.wishlistRepository.find({ userId });
            const wishlistItems = [];
            return yield this.wishlistRepository.find({ userId });
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.wishlistRepository.findOne(id);
        });
    }
    save(wishlist) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.wishlistRepository.findOne({ userId: wishlist.userId }).then(result => {
                this.wishlistRepository.delete(result);
            });
            return yield this.wishlistRepository.save(wishlist);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.wishlistRepository.findOne(id).then(result => {
                this.wishlistRepository.delete(result);
            });
        });
    }
};
WishlistService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(wishlist_entity_1.Wishlist)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        product_service_1.ProductService])
], WishlistService);
exports.WishlistService = WishlistService;
//# sourceMappingURL=wishlist.service.js.map