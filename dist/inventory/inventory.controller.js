"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jwt_auth_guard_1 = require("./../authentication/jwt-auth.guard");
const typeorm_1 = require("typeorm");
const lot_entity_1 = require("./entities/lot.entity");
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const requests_entity_1 = require("./entities/requests.entity");
const stock_entry_entity_1 = require("./entities/stock-entry.entity");
const inventory_entity_1 = require("./entities/inventory.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const file_utils_1 = require("../files/file.utils");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    findAllInventory(req) {
        return this.inventoryService.findAllInventory(req.user);
    }
    findOne(id) {
        return this.inventoryService.findOneInventory(id);
    }
    findByCode(code) {
        return this.inventoryService.findInventoryByCode(code);
    }
    findByItemCode(itemCode) {
        return this.inventoryService.findInventoryByItemCode(itemCode);
    }
    findByItemId(itemId) {
        return this.inventoryService.findInventoryByItemId(itemId);
    }
    findByItemAndWarehouse(itemId, warehouseId) {
        return this.inventoryService.findInventoryByItemAndWarehouse(itemId, warehouseId);
    }
    findInventoryByWarehouse(warehouseId) {
        return this.inventoryService.findInventoryByWarehouse(warehouseId);
    }
    createInventory(inventory) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.saveInventory(inventory);
        });
    }
    updateInventory(id, inventory) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.updateInventory(id, inventory);
        });
    }
    findAllStockEntries(req) {
        return this.inventoryService.findAllStockEntries(req.user);
    }
    findOneStockEntry(id) {
        return this.inventoryService.findOneStockEntry(id);
    }
    findStockEntryByInventory(inventoryId) {
        return this.inventoryService.findStockEntryByInventory(inventoryId);
    }
    findStockEntryByWarehouse(warehouseId) {
        return this.inventoryService.findStockEntryByWarehouse(warehouseId);
    }
    findStockEntryByWarehouseAndItem(warehouseId, itemId) {
        return this.inventoryService.findStockEntryByWarehouseAndItem(warehouseId, itemId);
    }
    createStockEntry(stockEntry) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const savedStockEntry = yield this.inventoryService.createStockEntry(stockEntry);
            return savedStockEntry;
        });
    }
    updateStockEntry(id, stockEntry) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.updateStockEntry(id, stockEntry);
        });
    }
    findAllLots() {
        return this.inventoryService.findAllLots();
    }
    findOneLot(id) {
        return this.inventoryService.findOneLot(id);
    }
    createLot(createLotDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.saveLot(createLotDto);
        });
    }
    updateLot(id, updateLotDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.updateLot(id, updateLotDto);
        });
    }
    findAllInventoryTransferRequests(req) {
        return this.inventoryService.findAllInventoryTransferRequests(req.user);
    }
    findOneInventoryTransferRequest(id) {
        return this.inventoryService.findOneInventoryTransferRequest(id);
    }
    findInventoryTransferRequestByInventory(inventoryId) {
        return this.inventoryService.findInventoryTransferRequestByInventory(inventoryId);
    }
    findByInventoryTransferRequestByWarehouse(warehouseId) {
        return this.inventoryService.findInventoryTransferRequestByWarehouse(warehouseId);
    }
    findInventoryTransferRequestByWarehouse(warehouseId, itemId) {
        return this.inventoryService.findInventoryTransferRequestByWarehouseAndItem(warehouseId, itemId);
    }
    createInventoryTransferRequest(inventoryTranserRequest, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            inventoryTranserRequest.createdBy = req.user.id;
            return this.inventoryService.createInventoryTransferRequest(inventoryTranserRequest);
        });
    }
    deleteInventoryTransferRequest(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.deleteInventoryTransferRequest(id);
        });
    }
    updateInventoryTransferRequest(id, inventoryTranserRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.updateInventoryTransferRequest(id, inventoryTranserRequest);
        });
    }
    completeInventoryTransferRequest(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.completeInventoryTransferRequest(id, req.user);
        });
    }
    findAllWarehouses(req) {
        console.log(req.user);
        return this.inventoryService.findAllWarehouses(req.user);
    }
    findOneWarehouse(id) {
        return this.inventoryService.findOneWarehouse(id);
    }
    createWarehouse(warehouse) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.createWarehouse(warehouse);
        });
    }
    updateWarehouse(id, warehouse) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.updateWarehouse(id, warehouse);
        });
    }
    deleteWarehouse(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.inventoryService.deleteWarehouse(id);
        });
    }
    uploadDailyInventory(file, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.inventoryService.uploadDailyInventory(file, req.user);
            return result;
        });
    }
    resetInventory(file, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.inventoryService.resetInventory(file, req.user);
            return result;
        });
    }
    getDashDataUSM(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.inventoryService.getDashDataUSM(req.user);
            return result;
        });
    }
    getDashDataWarehouse(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.inventoryService.getDashDataAdmin(req.user);
            return result;
        });
    }
    cleanData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const stockEntry = yield typeorm_1.getRepository(stock_entry_entity_1.StockEntry).find();
            yield typeorm_1.getRepository(stock_entry_entity_1.StockEntry).remove(stockEntry);
            return {
                status: 'success',
                message: 'Data cleaned'
            };
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findAllInventory", null);
tslib_1.__decorate([
    common_1.Get('inventoryById/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('inventoryByCode/:code'),
    tslib_1.__param(0, common_1.Param('code')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findByCode", null);
tslib_1.__decorate([
    common_1.Get('inventoryByItemCode/:itemCode'),
    tslib_1.__param(0, common_1.Param('itemCode')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findByItemCode", null);
tslib_1.__decorate([
    common_1.Get('inventoryByItemId/:itemId'),
    tslib_1.__param(0, common_1.Param('itemId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findByItemId", null);
tslib_1.__decorate([
    common_1.Get('inventoryByItemAndWarehouse/:itemId/:warehouseId'),
    tslib_1.__param(0, common_1.Param('itemId')),
    tslib_1.__param(1, common_1.Param('warehouseId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findByItemAndWarehouse", null);
tslib_1.__decorate([
    common_1.Get('inventoryByWarehouse/:warehouseId'),
    tslib_1.__param(0, common_1.Param('warehouseId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findInventoryByWarehouse", null);
tslib_1.__decorate([
    common_1.Post('createInventory'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [inventory_entity_1.Inventory]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "createInventory", null);
tslib_1.__decorate([
    common_1.Patch('updateInventory/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, inventory_entity_1.Inventory]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "updateInventory", null);
tslib_1.__decorate([
    common_1.Get('stockEntries'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findAllStockEntries", null);
tslib_1.__decorate([
    common_1.Get('stockEntryById/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findOneStockEntry", null);
tslib_1.__decorate([
    common_1.Get('stockEntryByInventory/:inventoryId'),
    tslib_1.__param(0, common_1.Param('inventoryId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findStockEntryByInventory", null);
tslib_1.__decorate([
    common_1.Get('stockEntryByWarehouse/:warehouseId'),
    tslib_1.__param(0, common_1.Param('warehouseId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findStockEntryByWarehouse", null);
tslib_1.__decorate([
    common_1.Get('stockEntryByWarehouseAndItem/:warehouseId/:itemId'),
    tslib_1.__param(0, common_1.Param('warehouseId')),
    tslib_1.__param(1, common_1.Param('itemId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findStockEntryByWarehouseAndItem", null);
tslib_1.__decorate([
    common_1.Post('createStockEntry'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [stock_entry_entity_1.StockEntry]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "createStockEntry", null);
tslib_1.__decorate([
    common_1.Patch('updateStockEntry/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, stock_entry_entity_1.StockEntry]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "updateStockEntry", null);
tslib_1.__decorate([
    common_1.Get('lots'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findAllLots", null);
tslib_1.__decorate([
    common_1.Get('lotById/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findOneLot", null);
tslib_1.__decorate([
    common_1.Post('createLot'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [lot_entity_1.Lot]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "createLot", null);
tslib_1.__decorate([
    common_1.Patch('updateLot/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, lot_entity_1.Lot]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "updateLot", null);
tslib_1.__decorate([
    common_1.Get('inventoryTransferRequests'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findAllInventoryTransferRequests", null);
tslib_1.__decorate([
    common_1.Get('inventoryTransferRequestById/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findOneInventoryTransferRequest", null);
tslib_1.__decorate([
    common_1.Get('inventoryTransferRequestByInventory/:inventoryId'),
    tslib_1.__param(0, common_1.Param('inventoryId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findInventoryTransferRequestByInventory", null);
tslib_1.__decorate([
    common_1.Get('inventoryTransferRequestByWarehouse/:warehouseId'),
    tslib_1.__param(0, common_1.Param('warehouseId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findByInventoryTransferRequestByWarehouse", null);
tslib_1.__decorate([
    common_1.Get('inventoryTransferRequestByWarehouseAndItem/:warehouseId/:itemId'),
    tslib_1.__param(0, common_1.Param('warehouseId')),
    tslib_1.__param(1, common_1.Param('itemId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findInventoryTransferRequestByWarehouse", null);
tslib_1.__decorate([
    common_1.Post('createInventoryTransferRequest'),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [requests_entity_1.InventoryTransferRequest, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "createInventoryTransferRequest", null);
tslib_1.__decorate([
    common_1.Delete('deleteInventoryTransferRequest/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "deleteInventoryTransferRequest", null);
tslib_1.__decorate([
    common_1.Patch('updateInventoryTransferRequest/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, requests_entity_1.InventoryTransferRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "updateInventoryTransferRequest", null);
tslib_1.__decorate([
    common_1.Patch('completeInventoryTransferRequest/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "completeInventoryTransferRequest", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('warehouses'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findAllWarehouses", null);
tslib_1.__decorate([
    common_1.Get('warehouseById/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "findOneWarehouse", null);
tslib_1.__decorate([
    common_1.Post('createWarehouse'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [warehouse_entity_1.Warehouse]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "createWarehouse", null);
tslib_1.__decorate([
    common_1.Patch('updateWarehouse/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, warehouse_entity_1.Warehouse]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "updateWarehouse", null);
tslib_1.__decorate([
    common_1.Delete('deleteWarehouse/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "deleteWarehouse", null);
tslib_1.__decorate([
    common_1.Post('upload-daily-inventory/'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.UploadedFile()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "uploadDailyInventory", null);
tslib_1.__decorate([
    common_1.Post('reset-daily-inventory/'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.UploadedFile()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "resetInventory", null);
tslib_1.__decorate([
    common_1.Get('dash-data-usm/'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "getDashDataUSM", null);
tslib_1.__decorate([
    common_1.Get('dash-data-admin/'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "getDashDataWarehouse", null);
tslib_1.__decorate([
    common_1.Get('clean-data'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "cleanData", null);
InventoryController = tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('inventory'),
    tslib_1.__metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
exports.InventoryController = InventoryController;
//# sourceMappingURL=inventory.controller.js.map