"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supply_chain_item_entity_1 = require("./supply-chain-item.entity");
const supplychain_entity_1 = require("../supplychain/supplychain.entity");
let SupplyChainService = class SupplyChainService {
    constructor(supplyChainFeedItemRepository, supplyChainRepository) {
        this.supplyChainFeedItemRepository = supplyChainFeedItemRepository;
        this.supplyChainRepository = supplyChainRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainRepository.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainRepository.find(filter);
        });
    }
    update(id, supplyChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainRepository.update(id, supplyChain);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const supplyChain = this.supplyChainRepository.findOne(id).then(result => {
                this.supplyChainRepository.delete(result);
            });
        });
    }
    save(supplyChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundSupplyChain = yield this.supplyChainRepository.findOne({ supplyChainSerialNumber: supplyChain.supplyChainSerialNumber });
            if (foundSupplyChain) {
                return this.supplyChainRepository.save(supplyChain);
            }
            else {
                return this.supplyChainRepository.save(supplyChain);
            }
        });
    }
    createSupplyChain(supplyChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainRepository.save(supplyChain);
        });
    }
    createSupplyChainFeedItem(id, supplyChainFeedItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let supplychain = yield this.supplyChainRepository.findOne(id);
            supplychain.supplyChainFeedItems = [...supplychain.supplyChainFeedItems, supplyChainFeedItem];
            return supplychain.save();
        });
    }
    findSupplyChainFeedItem(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainFeedItemRepository.findOne(id);
        });
    }
    findSupplyChainFeedItems(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainFeedItemRepository.find(filter);
        });
    }
    findSupplyChainFeedItemsBySupplyChain(supplyChainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.supplyChainFeedItemRepository.find({ id: supplyChainId });
        });
    }
};
SupplyChainService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(supply_chain_item_entity_1.SupplyChainFeedItem)),
    tslib_1.__param(1, typeorm_1.InjectRepository(supplychain_entity_1.SupplyChain)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SupplyChainService);
exports.SupplyChainService = SupplyChainService;
//# sourceMappingURL=supplychain.service.js.map