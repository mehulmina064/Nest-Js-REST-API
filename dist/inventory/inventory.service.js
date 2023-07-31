"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const roles_constants_1 = require("./../users/roles.constants");
const item_entity_1 = require("./../item/item.entity");
const requests_entity_1 = require("./entities/requests.entity");
let xlsx = require('xlsx');
const territory_entity_1 = require("./../territory/territory.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bin_entity_1 = require("./entities/bin.entity");
const inventory_entity_1 = require("./entities/inventory.entity");
const lot_entity_1 = require("./entities/lot.entity");
const stock_entry_entity_1 = require("./entities/stock-entry.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const unimove_filter_1 = require("./unimove.filter");
const utils_1 = require("../common/utils");
let InventoryService = class InventoryService {
    constructor(inventoryRepository, stockEntryRepository, lotRepository, treeRepository, warehouseRepository, inventoryTransferRequestRepository) {
        this.inventoryRepository = inventoryRepository;
        this.stockEntryRepository = stockEntryRepository;
        this.lotRepository = lotRepository;
        this.treeRepository = treeRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryTransferRequestRepository = inventoryTransferRequestRepository;
    }
    findAllInventory(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.role === roles_constants_1.UserRole.PRODO) {
                return yield this.inventoryRepository.find();
            }
            const filter = unimove_filter_1.UnimoveFilter(user);
            return yield this.inventoryRepository.find({ where: filter });
        });
    }
    findOneInventory(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.findOne(id);
        });
    }
    findInventoryByCode(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.findOne({ code: code });
        });
    }
    findInventoryByItemCode(itemCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.findOne({ itemCode: itemCode });
        });
    }
    findInventoryByItemId(itemId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.findOne({ itemId: itemId });
        });
    }
    findInventoryByItemAndWarehouse(itemId, warehouseId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.findOne({ itemId: itemId, warehouseId: warehouseId });
        });
    }
    findInventoryByWarehouse(warehouseId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.find({ warehouseId: warehouseId });
        });
    }
    saveInventory(inventory) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.save(inventory);
        });
    }
    deleteInventory(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.inventoryRepository.delete(id);
        });
    }
    updateInventory(id, inventory) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryRepository.update(id, inventory);
        });
    }
    findAllStockEntries(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.role === roles_constants_1.UserRole.PRODO) {
                return yield this.stockEntryRepository.find();
            }
            const filter = unimove_filter_1.UnimoveFilter(user);
            return yield this.stockEntryRepository.find({ where: filter });
        });
    }
    findOneStockEntry(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.stockEntryRepository.findOne(id);
        });
    }
    findStockEntryByWarehouse(warehouseId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.stockEntryRepository.find({ warehouseId: warehouseId });
        });
    }
    findStockEntryByInventory(inventoryId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.stockEntryRepository.find({ inventory_id: inventoryId });
        });
    }
    findStockEntryByWarehouseAndItem(warehouseId, itemId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.stockEntryRepository.find({ warehouse_id: warehouseId, item_id: itemId });
        });
    }
    createStockEntry(stockEntry) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const inventory = yield this.inventoryRepository.findOne(stockEntry.inventory_id);
            const foundStockEntry = yield this.stockEntryRepository.findOne({
                inventory_id: stockEntry.inventory_id,
                item_id: stockEntry.item_id,
                entry_date: stockEntry.entry_date,
                entry_type: stockEntry.entry_type,
            });
            if (foundStockEntry) {
                foundStockEntry.qty = stockEntry.qty;
                console.log('StockEntry', stockEntry);
                console.log('foundStockEntry', foundStockEntry);
                return yield this.stockEntryRepository.update(foundStockEntry.id, foundStockEntry).then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (foundStockEntry.entry_type === 'IN' && inventory) {
                        inventory.current_qty = Number(inventory.current_qty) + Number(stockEntry.qty) - Number(foundStockEntry.qty);
                        return yield this.inventoryRepository.save(inventory).then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            return yield this.stockEntryRepository.save(foundStockEntry);
                        }));
                    }
                    if (foundStockEntry.entry_type === 'OUT' && inventory) {
                        inventory.current_qty = Number(inventory.current_qty) - Number(stockEntry.qty) + Number(foundStockEntry.qty);
                        return yield this.inventoryRepository.save(inventory).then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            return yield this.stockEntryRepository.save(foundStockEntry);
                        }));
                    }
                    return yield this.stockEntryRepository.save(foundStockEntry);
                }));
            }
            else {
                return yield this.stockEntryRepository.save(stockEntry).then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (stockEntry.entry_type === 'IN' && inventory) {
                        inventory.current_qty = Number(inventory.current_qty) + Number(stockEntry.qty);
                        inventory.last_uploaded_date = stockEntry.entry_date;
                        console.log('inventory', inventory);
                        return yield this.inventoryRepository.save(inventory).then(() => {
                            console.log('stockEntry updated with inventory', stockEntry);
                            return stockEntry;
                        });
                    }
                    if (stockEntry.entry_type === 'OUT' && inventory) {
                        inventory.current_qty = Number(inventory.current_qty || 0) - Number(stockEntry.qty);
                        inventory.last_uploaded_date = stockEntry.entry_date;
                        console.log('inventory', inventory);
                        return yield this.inventoryRepository.save(inventory).then(() => {
                            console.log('stockEntry updated out  with inventory', stockEntry);
                            if (stockEntry.item_id === '625d46484d1db7278d8ba88e') {
                                console.log('stockEntry updated seal out  with inventory', stockEntry);
                                console.log('inventory seal out', inventory);
                            }
                            return stockEntry;
                        });
                    }
                    return stockEntry;
                }));
            }
        });
    }
    deleteStockEntry(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.stockEntryRepository.delete(id);
        });
    }
    updateStockEntry(id, stockEntry) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.stockEntryRepository.update(id, stockEntry);
        });
    }
    findAllLots() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.lotRepository.find();
        });
    }
    findOneLot(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.lotRepository.findOne(id);
        });
    }
    findLotsByInventoryAndLot(inventoryId, lotId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.lotRepository.findOne({ inventoryId: inventoryId, lotId: lotId });
        });
    }
    saveLot(lot) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.lotRepository.save(lot);
        });
    }
    deleteLot(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.lotRepository.delete(id);
        });
    }
    updateLot(id, lot) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.lotRepository.update(id, lot);
        });
    }
    findAllBins() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.treeRepository.find();
        });
    }
    findOneBin(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.treeRepository.findOne(id);
        });
    }
    findBinsByWarehouseAndBin(warehouseId, binId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.treeRepository.findOne({ warehouse_id: warehouseId, bin_id: binId });
        });
    }
    saveBin(bin) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.treeRepository.save(bin);
        });
    }
    deleteBin(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.treeRepository.delete(id);
        });
    }
    updateBin(id, bin) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.treeRepository.update(id, bin);
        });
    }
    findAllWarehouses(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.role === roles_constants_1.UserRole.PRODO) {
                return yield this.warehouseRepository.find();
            }
            const filter = unimove_filter_1.UnimoveFilter(user);
            return yield this.warehouseRepository.find({ where: filter });
        });
    }
    findOneWarehouse(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.warehouseRepository.findOne(id);
        });
    }
    findWarehousesByCode(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.warehouseRepository.findOne({ code: code });
        });
    }
    createWarehouse(warehouse) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.warehouseRepository.save(warehouse);
        });
    }
    deleteWarehouse(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.warehouseRepository.delete(id);
        });
    }
    updateWarehouse(id, warehouse) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.warehouseRepository.update(id, warehouse);
        });
    }
    getAllWarehousesForTerritory(territoryId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield typeorm_2.getTreeRepository(territory_entity_1.Territory).findOne(territoryId);
            if (!territory) {
                throw new common_1.NotFoundException(`Territory with id ${territoryId} not found`);
            }
            const territories = yield typeorm_2.getTreeRepository(territory_entity_1.Territory).findDescendants(territory);
            const warehouses = yield typeorm_2.getRepository(warehouse_entity_1.Warehouse).find({ where: {
                    territoryId: { $in: territories.map(t => t.id) }
                } });
            return warehouses;
        });
    }
    getInventoryForWarehouses(warehouseIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const inventories = yield typeorm_2.getRepository(inventory_entity_1.Inventory).find({ where: {
                    warehouseId: { $in: warehouseIds }
                } });
            return inventories;
        });
    }
    findAllInventoryTransferRequests(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryTransferRequestRepository.find();
        });
    }
    findOneInventoryTransferRequest(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryTransferRequestRepository.findOne(id);
        });
    }
    findInventoryTransferRequestByInventory(inventoryId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryTransferRequestRepository.find({ inventoryId: inventoryId });
        });
    }
    findInventoryTransferRequestByWarehouseAndItem(warehouseId, itemId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryTransferRequestRepository.findOne({ warehouse_id: warehouseId, item_id: itemId });
        });
    }
    findInventoryTransferRequestByWarehouse(warehouseId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.inventoryTransferRequestRepository.find({ warehouse_id: warehouseId });
        });
    }
    createInventoryTransferRequest(inventoryTransferRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('inventoryTransferRequest', inventoryTransferRequest);
            const sn1 = inventoryTransferRequest.type === 'Buy' ? 'BUY' : 'RET';
            const sn2 = yield typeorm_2.getRepository(territory_entity_1.Territory).findOne(inventoryTransferRequest.territory_id[0]).then(t => t.code);
            const sn3 = new Date().getFullYear().toString().substr(2, 2) + (new Date().getFullYear() + 1).toString().substr(2, 2);
            console.log('sn3', sn3);
            const sn4 = yield typeorm_2.getRepository(item_entity_1.Item).findOne(inventoryTransferRequest.item_id).then(i => String(i.name).toUpperCase()[0]);
            const sn5 = yield this.inventoryTransferRequestRepository.count({
                inventory_id: inventoryTransferRequest.inventory_id,
                type: inventoryTransferRequest.type
            }).then(c => String(c + 1).padStart(5, '0'));
            inventoryTransferRequest.code = `${sn1}/${sn2}/${sn3}/${sn4}${sn5}`;
            return yield this.inventoryTransferRequestRepository.save(inventoryTransferRequest);
        });
    }
    deleteInventoryTransferRequest(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.inventoryTransferRequestRepository.delete(id);
        });
    }
    updateInventoryTransferRequest(id, inventoryTransferRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updatedRequest = yield this.inventoryTransferRequestRepository.update(id, inventoryTransferRequest);
            if (inventoryTransferRequest.isCompleted) {
                if (inventoryTransferRequest.type === "Buy") {
                    const stockEntry = new stock_entry_entity_1.StockEntry();
                    stockEntry.item_id = inventoryTransferRequest.item_id;
                    stockEntry.inventory_id = inventoryTransferRequest.inventory_id;
                    stockEntry.territory_id = inventoryTransferRequest.territory_id;
                    stockEntry.organization_id = inventoryTransferRequest.organization_id;
                    stockEntry.warehouse_id = inventoryTransferRequest.warehouse_id;
                    stockEntry.qty = inventoryTransferRequest.quantity;
                    stockEntry.entry_type = "IN";
                    stockEntry.entry_date = new Date();
                }
                else if (inventoryTransferRequest.type === "Return") {
                    const stockEntry = new stock_entry_entity_1.StockEntry();
                    stockEntry.item_id = inventoryTransferRequest.item_id;
                    stockEntry.warehouse_id = inventoryTransferRequest.warehouse_id;
                    stockEntry.qty = inventoryTransferRequest.qty;
                    stockEntry.entry_type = "OUT";
                    stockEntry.entry_date = new Date();
                }
            }
            return updatedRequest;
        });
    }
    completeInventoryTransferRequest(id, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const inventoryTransferRequest = yield this.inventoryTransferRequestRepository.findOne(id);
            if (!inventoryTransferRequest) {
                throw new common_1.NotFoundException(`Inventory Transfer Request with id ${id} not found`);
            }
            inventoryTransferRequest.isCompleted = true;
            inventoryTransferRequest.updatedBy = String(user.id);
            const foundInventory = yield this.inventoryRepository.findOne(inventoryTransferRequest.inventory_id);
            if (!foundInventory) {
                throw new common_1.NotFoundException(`Inventory with id ${inventoryTransferRequest.inventory_id} not found`);
            }
            if (inventoryTransferRequest.type === "Buy") {
                foundInventory.current_qty = Number(foundInventory.current_qty) + Number(inventoryTransferRequest.quantity);
            }
            else if (inventoryTransferRequest.type === "Return") {
                foundInventory.current_qty = Number(foundInventory.current_qty) - Number(inventoryTransferRequest.quantity);
            }
            foundInventory.updatedBy = inventoryTransferRequest.updatedBy;
            yield this.inventoryRepository.save(foundInventory);
            return yield this.inventoryTransferRequestRepository.save(inventoryTransferRequest);
        });
    }
    uploadDailyInventory(file, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workbook = yield xlsx.readFile(file.path);
            const sheet_name_list = workbook.SheetNames;
            const sheetName = sheet_name_list[0];
            const data = yield xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true }, { header: 1 });
            data;
            let stockEntries = [];
            data.forEach((element) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let stockEntry = new stock_entry_entity_1.StockEntry();
                stockEntry.organization_id = user.organization_id;
                stockEntry.entry_date = yield utils_1.ExcelDateToJSDate(element["Latest Upload Date"]);
                console.log(stockEntry.entry_date);
                const hub = yield typeorm_2.getRepository(territory_entity_1.Territory).findOne({ where: { code: element['Hub Code'] } });
                if (!hub) {
                    throw new common_1.NotFoundException(`Hub with code ${element['Hub Name']} not found`);
                }
                const warehouses = yield typeorm_2.getRepository(warehouse_entity_1.Warehouse).find({ where: { code: element['Hub Code'] } });
                const warehouse = warehouses[0];
                if (!warehouse) {
                    throw new common_1.NotFoundException(`Warehouse with code ${hub.name} not found`);
                }
                stockEntry.warehouse_id = String(warehouse.id);
                const bag_id = "6267970ab05883604010289e";
                const seal_id = "625d46484d1db7278d8ba88e";
                const item = yield typeorm_2.getRepository(item_entity_1.Item).findOne(bag_id);
                if (!item) {
                    throw new common_1.NotFoundException(`Item with code ${bag_id} not found`);
                }
                stockEntry.item_id = String(item.id);
                const bagInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).findOne({ where: { warehouse_id: stockEntry.warehouse_id, item_id: stockEntry.item_id } });
                if (!bagInventory) {
                    throw new common_1.NotFoundException(`Inventory with code ${stockEntry.warehouse_id} not found`);
                }
                const stockEntryInBag = new stock_entry_entity_1.StockEntry();
                stockEntryInBag.organization_id = user.organization_id;
                stockEntryInBag.inventory_id = String(bagInventory.id);
                stockEntryInBag.item_id = bag_id;
                stockEntryInBag.warehouse_id = stockEntry.warehouse_id;
                stockEntryInBag.territory_id.push(String(hub.id));
                stockEntryInBag.qty = Number(element['Bag In Count']);
                stockEntryInBag.entry_type = 'IN';
                stockEntryInBag.entry_date = stockEntry.entry_date;
                stockEntryInBag.createdBy = String(user.id);
                stockEntryInBag.createdAt = new Date();
                stockEntries.push(stockEntryInBag);
                const stockEntryOutBag = new stock_entry_entity_1.StockEntry();
                stockEntryOutBag.organization_id = user.organization_id;
                stockEntryOutBag.inventory_id = String(bagInventory.id);
                stockEntryOutBag.warehouse_id = stockEntry.warehouse_id;
                stockEntryOutBag.item_id = bag_id;
                stockEntryOutBag.territory_id.push(String(hub.id));
                stockEntryOutBag.qty = Number(element['Bag Out Count']);
                stockEntryOutBag.entry_type = 'OUT';
                stockEntryOutBag.entry_date = stockEntry.entry_date;
                stockEntryOutBag.createdBy = String(user.id);
                stockEntryOutBag.createdAt = new Date();
                stockEntries.push(stockEntryOutBag);
                const sealInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).findOne({ where: { warehouse_id: stockEntry.warehouse_id, item_id: seal_id } });
                if (!sealInventory) {
                    throw new common_1.NotFoundException(`Inventory with code ${stockEntry.warehouse_id} not found`);
                }
                const stockEntryOutSeal = new stock_entry_entity_1.StockEntry();
                stockEntryOutSeal.organization_id = user.organization_id;
                stockEntryOutSeal.inventory_id = String(sealInventory.id);
                stockEntryOutSeal.warehouse_id = stockEntry.warehouse_id;
                stockEntryOutSeal.territory_id.push(String(hub.id));
                stockEntryOutSeal.item_id = seal_id;
                stockEntryOutSeal.qty = Number(element['Bag Seal Usage Count']);
                stockEntryOutSeal.entry_type = 'OUT';
                stockEntryOutSeal.entry_date = stockEntry.entry_date;
                stockEntryOutSeal.createdBy = String(user.id);
                stockEntryOutSeal.createdAt = new Date();
                console.log(stockEntryOutSeal);
                stockEntries.push(stockEntryOutSeal);
                const savedBagSEntry = yield this.createStockEntry(stockEntryInBag);
                const savedBagInSEntry = yield this.createStockEntry(stockEntryOutBag);
                const savedSealSEntry = yield this.createStockEntry(stockEntryOutSeal);
                return Promise.all([savedBagSEntry, savedBagInSEntry, savedSealSEntry]).then((values) => {
                    console.log(values);
                }).catch((err) => {
                    console.log(err);
                });
            }));
            return new Promise((resolve, reject) => {
                resolve(stockEntries);
            });
        });
    }
    resetInventory(file, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workbook = yield xlsx.readFile(file.path);
            const sheet_name_list = workbook.SheetNames;
            const sheetName = sheet_name_list[0];
            const data = yield xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true }, { header: 1 });
            console.log(data);
            Promise.all(yield data.map((element) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const hub = yield typeorm_2.getRepository(territory_entity_1.Territory).findOne({ where: { $or: [{ code: element['Hub Code'] }, { name: element['Hub Name'] }, { name: element['Hub Code'] }] } });
                if (!hub) {
                    throw new common_1.NotFoundException(`Hub with code ${element['Hub Name']} not found`);
                }
                const warehouse = yield typeorm_2.getRepository(warehouse_entity_1.Warehouse).findOne({ where: { $or: [{ code: element['Hub Code'] }, { name: element['Hub Name'] }, { name: element['Hub Code'] }] } }).catch(e => {
                    throw new common_1.NotFoundException(`Warehouse with code ${hub.name} not found`);
                });
                if (!warehouse) {
                    throw new common_1.NotFoundException(`Warehouse with code ${hub.id} not found`);
                }
                const bag_id = "6267970ab05883604010289e";
                const seal_id = "625d46484d1db7278d8ba88e";
                const item = yield typeorm_2.getRepository(item_entity_1.Item).findOne(bag_id).catch(e => {
                    throw new common_1.NotFoundException(`Item with code ${bag_id} not found`);
                });
                if (!item) {
                    throw new common_1.NotFoundException(`Item with code ${bag_id} not found`);
                }
                const bagInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).findOne({ warehouse_id: String(warehouse.id), item_id: bag_id });
                if (!bagInventory) {
                    throw new common_1.NotFoundException(`Inventory for code ${warehouse.code} not found`);
                }
                bagInventory.current_qty = Number(element['Bag Inventory Count']);
                bagInventory.updatedBy = String(user.id);
                bagInventory.updatedAt = new Date();
                bagInventory.last_uploaded_date = yield utils_1.ExcelDateToJSDate(element['Latest Upload Date']);
                const savedBagInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).save(bagInventory);
                console.log(savedBagInventory);
                const sealInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).findOne({ warehouse_id: String(warehouse.id), item_id: seal_id });
                if (!sealInventory) {
                    throw new common_1.NotFoundException(`Inventory not found`);
                }
                sealInventory.current_qty = Number(element['Bag Seal Inventory Count']);
                sealInventory.updatedBy = String(user.id);
                sealInventory.updatedAt = new Date();
                sealInventory.last_uploaded_date = yield utils_1.ExcelDateToJSDate(element['Latest Upload Date']);
                const savedSealInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).save(sealInventory);
                console.log(savedBagInventory);
                console.log(savedSealInventory);
                Promise.all([savedBagInventory, savedSealInventory]);
            })));
            return "Inventory Updated";
        });
    }
    getDashDataUSM(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = [];
            const dataFilter = unimove_filter_1.UnimoveFilter(user);
            console.log(dataFilter);
            console.log(user);
            const inventories = yield typeorm_2.getRepository(inventory_entity_1.Inventory).find({ where: dataFilter });
            console.log(inventories);
            function getDashData(user) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield Promise.all(inventories.map((element) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const item = yield typeorm_2.getRepository(item_entity_1.Item).findOne(element.item_id);
                        if (!item) {
                            throw new common_1.NotFoundException(`Item with code ${element.item_id} not found`);
                        }
                        const stockEntries = yield typeorm_2.getRepository(stock_entry_entity_1.StockEntry).find({ where: { inventory_id: element.id, entry_date: { $gte: new Date(new Date().setDate(new Date().getDate() - 15)) } } });
                        const inventoryRequests = yield typeorm_2.getRepository(requests_entity_1.InventoryTransferRequest).find({ where: { inventory_id: element.id, isCompleted: true, updatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 15)) } } });
                        let dataObj = {
                            hub_id: element.territory_id[0],
                            type: item.name,
                            current_inventory: element.current_qty,
                            buffer_stock: 0,
                            latest_stock_in_quantity: 0,
                            day_since_stock_in_done: 0,
                            latest_stock_out_quantity: 0,
                            day_since_stock_out_done: 0,
                            today_consumption: 0,
                            weekly_avg_consumption: 0
                        };
                        let stockIn = 0;
                        let stockOut = 0;
                        let bought = 0;
                        let returned = 0;
                        if (stockEntries.length > 0) {
                            stockEntries.forEach(stockEntry => {
                                if (stockEntry.entry_type == 'IN') {
                                    stockIn += stockEntry.qty;
                                }
                                else {
                                    stockOut += stockEntry.qty;
                                }
                            });
                        }
                        if (inventoryRequests.length > 0) {
                            inventoryRequests.forEach(inventoryRequest => {
                                if (inventoryRequest.type == 'BUY') {
                                    bought += inventoryRequest.qty;
                                }
                                if (inventoryRequest.type == 'RETURN') {
                                    returned += inventoryRequest.qty;
                                }
                            });
                        }
                        let past_qty = element.current_qty - stockIn + stockOut;
                        let avgConsumed = stockOut / 15;
                        let buffer_stock = past_qty + (stockIn - stockOut + bought - returned) / 15;
                        dataObj.buffer_stock = buffer_stock;
                        const latestStockOutEntry = yield typeorm_2.getRepository(stock_entry_entity_1.StockEntry).findOne({ entry_type: 'OUT' }, { order: { entry_date: "DESC" } });
                        const latestStockINEntry = yield typeorm_2.getRepository(stock_entry_entity_1.StockEntry).findOne({ entry_type: 'IN' }, { order: { entry_date: "DESC" } });
                        if (latestStockOutEntry) {
                            dataObj.latest_stock_out_quantity = latestStockOutEntry.qty;
                            dataObj.day_since_stock_out_done = Math.floor((new Date().getDate() - new Date(latestStockOutEntry.entry_date).getDate()));
                            console.log('entrydate', latestStockOutEntry);
                        }
                        if (latestStockINEntry) {
                            dataObj.latest_stock_in_quantity = latestStockINEntry.qty;
                            dataObj.day_since_stock_in_done = Math.floor((new Date().getTime() - new Date(latestStockINEntry.entry_date).getTime()) / (1000 * 60 * 60 * 24));
                        }
                        const todayStockOutEntry = yield typeorm_2.getRepository(stock_entry_entity_1.StockEntry).findOne({ entry_type: 'OUT', entry_date: new Date(new Date().setHours(0, 0, 0, 0)) });
                        let weeklyAvgConsumed = 0;
                        stockEntries.forEach(stockEntry => {
                            if (stockEntry.entry_type == 'OUT' && new Date(stockEntry.entry_date).getTime() >= new Date(new Date().setDate(new Date().getDate() - 7)).getTime()) {
                                weeklyAvgConsumed += stockEntry.qty;
                            }
                        });
                        dataObj.weekly_avg_consumption = weeklyAvgConsumed / 7;
                        if (todayStockOutEntry) {
                            dataObj.today_consumption = todayStockOutEntry.qty;
                        }
                        console.log(dataObj);
                        return data.push(dataObj);
                    })));
                    return data;
                });
            }
            return yield getDashData(user);
        });
    }
};
InventoryService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(inventory_entity_1.Inventory)),
    tslib_1.__param(1, typeorm_1.InjectRepository(stock_entry_entity_1.StockEntry)),
    tslib_1.__param(2, typeorm_1.InjectRepository(lot_entity_1.Lot)),
    tslib_1.__param(3, typeorm_1.InjectRepository(bin_entity_1.Bin)),
    tslib_1.__param(4, typeorm_1.InjectRepository(warehouse_entity_1.Warehouse)),
    tslib_1.__param(5, typeorm_1.InjectRepository(requests_entity_1.InventoryTransferRequest)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], InventoryService);
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map