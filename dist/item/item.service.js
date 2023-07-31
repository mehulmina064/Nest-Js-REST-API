"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_entity_1 = require("./item.entity");
let ItemService = class ItemService {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    findAll(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (filter) {
                return yield this.itemRepository.find(filter);
            }
            return yield this.itemRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.itemRepository.findOne(id);
        });
    }
    create(itemDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const item = new item_entity_1.Item();
            item.name = itemDto.name;
            item.description = itemDto.description;
            item.price = itemDto.price;
            item.quantity = itemDto.quantity;
            item.image = itemDto.image;
            item.category = itemDto.category;
            return yield this.itemRepository.save(item);
        });
    }
    update(id, itemDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const item = yield this.itemRepository.findOne(id);
            item.name = itemDto.name;
            item.description = itemDto.description;
            item.price = itemDto.price;
            item.quantity = itemDto.quantity;
            item.image = itemDto.image;
            item.category = itemDto.category;
            return yield this.itemRepository.save(item);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const item = yield this.itemRepository.findOne(id);
            return yield this.itemRepository.remove(item);
        });
    }
};
ItemService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(item_entity_1.Item)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], ItemService);
exports.ItemService = ItemService;
//# sourceMappingURL=item.service.js.map