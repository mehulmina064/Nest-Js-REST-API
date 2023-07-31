"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const requests_entity_1 = require("./entities/requests.entity");
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const inventory_controller_1 = require("./inventory.controller");
const typeorm_1 = require("@nestjs/typeorm");
const inventory_entity_1 = require("./entities/inventory.entity");
const lot_entity_1 = require("./entities/lot.entity");
const bin_entity_1 = require("./entities/bin.entity");
const stock_entry_entity_1 = require("./entities/stock-entry.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
let InventoryModule = class InventoryModule {
};
InventoryModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [inventory_controller_1.InventoryController],
        imports: [typeorm_1.TypeOrmModule.forFeature([inventory_entity_1.Inventory, lot_entity_1.Lot, bin_entity_1.Bin, stock_entry_entity_1.StockEntry, warehouse_entity_1.Warehouse, requests_entity_1.InventoryTransferRequest])],
        providers: [inventory_service_1.InventoryService],
        exports: [inventory_service_1.InventoryService, typeorm_1.TypeOrmModule.forFeature([inventory_entity_1.Inventory, lot_entity_1.Lot, bin_entity_1.Bin, stock_entry_entity_1.StockEntry, warehouse_entity_1.Warehouse, requests_entity_1.InventoryTransferRequest])]
    })
], InventoryModule);
exports.InventoryModule = InventoryModule;
//# sourceMappingURL=inventory.module.js.map