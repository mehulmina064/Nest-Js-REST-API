"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Wishlist = class Wishlist {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], Wishlist.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Wishlist.prototype, "userId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Wishlist.prototype, "productIds", void 0);
Wishlist = tslib_1.__decorate([
    typeorm_1.Entity('wishlist')
], Wishlist);
exports.Wishlist = Wishlist;
//# sourceMappingURL=wishlist.entity.js.map