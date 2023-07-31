"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const item_service_1 = require("./item.service");
const item_controller_1 = require("./item.controller");
const typeorm_1 = require("@nestjs/typeorm");
const item_entity_1 = require("./item.entity");
let ItemModule = class ItemModule {
};
ItemModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([item_entity_1.Item])],
        providers: [item_service_1.ItemService],
        controllers: [item_controller_1.ItemController]
    })
], ItemModule);
exports.ItemModule = ItemModule;
//# sourceMappingURL=item.module.js.map