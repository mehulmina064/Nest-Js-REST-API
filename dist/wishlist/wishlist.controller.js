"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const wishlist_service_1 = require("./wishlist.service");
const wishlist_entity_1 = require("./wishlist.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let WishlistController = class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    findAll() {
        return this.wishlistService.findAll();
    }
    findByUser(userId) {
        return this.wishlistService.findByUser(userId);
    }
    findOne(id) {
        return this.wishlistService.findOne(id);
    }
    save(category) {
        return this.wishlistService.save(category);
    }
    delete(id) {
        return this.wishlistService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], WishlistController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('user/:userId'),
    tslib_1.__param(0, common_1.Param('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], WishlistController.prototype, "findByUser", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], WishlistController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [wishlist_entity_1.Wishlist]),
    tslib_1.__metadata("design:returntype", void 0)
], WishlistController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WishlistController.prototype, "delete", null);
WishlistController = tslib_1.__decorate([
    common_1.Controller('wishlist'),
    tslib_1.__metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
exports.WishlistController = WishlistController;
//# sourceMappingURL=wishlist.controller.js.map