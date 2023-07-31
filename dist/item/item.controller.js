"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jwt_auth_guard_1 = require("./../authentication/jwt-auth.guard");
const common_1 = require("@nestjs/common");
const item_service_1 = require("./item.service");
const item_entity_1 = require("./item.entity");
const utils_1 = require("../common/utils");
let ItemController = class ItemController {
    constructor(itemService) {
        this.itemService = itemService;
    }
    getAllItems(req, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield utils_1.filterAllData(this.itemService, req);
        });
    }
    getItem(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const item = yield this.itemService.findOne(id);
            return yield utils_1.filterSingleObject(req.user, item);
        });
    }
    addItem(item, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            item.organization_id = req.user.organization_id;
            return yield this.itemService.create(item);
        });
    }
    updateItem(id, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.itemService.update(id, item);
        });
    }
    deleteItem(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.itemService.delete(id);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ItemController.prototype, "getAllItems", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ItemController.prototype, "getItem", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [item_entity_1.Item, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ItemController.prototype, "addItem", null);
tslib_1.__decorate([
    common_1.Put(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, item_entity_1.Item]),
    tslib_1.__metadata("design:returntype", Promise)
], ItemController.prototype, "updateItem", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], ItemController.prototype, "deleteItem", null);
ItemController = tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('item'),
    tslib_1.__metadata("design:paramtypes", [item_service_1.ItemService])
], ItemController);
exports.ItemController = ItemController;
//# sourceMappingURL=item.controller.js.map