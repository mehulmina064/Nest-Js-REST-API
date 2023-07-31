"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const supplychain_entity_1 = require("./supplychain.entity");
const supply_chain_item_entity_1 = require("./supply-chain-item.entity");
const supplychain_service_1 = require("./supplychain.service");
let SupplyChainController = class SupplyChainController {
    constructor(supplyChainService) {
        this.supplyChainService = supplyChainService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.findAll();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.filter(filter);
        });
    }
    update(id, supplyChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.update(id, supplyChain);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.remove(id);
        });
    }
    save(supplyChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundSupplyChain = yield this.supplyChainService.findOne({ supplyChainSerialNumber: supplyChain.supplyChainSerialNumber });
            if (foundSupplyChain) {
                return this.supplyChainService.save(supplyChain);
            }
            else {
                return this.supplyChainService.save(supplyChain);
            }
        });
    }
    createSupplyChain(supplyChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.createSupplyChain(supplyChain);
        });
    }
    createSupplyChainFeedItem(id, supplyChainFeedItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainService.createSupplyChainFeedItem(id, supplyChainFeedItem);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('/:id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('/filter'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Post(':id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "remove", null);
tslib_1.__decorate([
    common_1.Post('/save'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [supplychain_entity_1.SupplyChain]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Post('/create'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [supplychain_entity_1.SupplyChain]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "createSupplyChain", null);
tslib_1.__decorate([
    common_1.Post('/create-feed-item/:id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, supply_chain_item_entity_1.SupplyChainFeedItem]),
    tslib_1.__metadata("design:returntype", Promise)
], SupplyChainController.prototype, "createSupplyChainFeedItem", null);
SupplyChainController = tslib_1.__decorate([
    common_1.Controller('supplychain'),
    tslib_1.__metadata("design:paramtypes", [supplychain_service_1.SupplyChainService])
], SupplyChainController);
exports.SupplyChainController = SupplyChainController;
//# sourceMappingURL=supplychain.controller.js.map