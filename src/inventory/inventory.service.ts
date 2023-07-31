import { CurrentUser } from './../users/user.decorator';
import { UserRole } from './../users/roles.constants';
import { Item } from './../item/item.entity';
import { InventoryTransferRequest } from './entities/requests.entity';
let xlsx = require('xlsx');
import { Territory } from './../territory/territory.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, getTreeRepository, MongoRepository } from 'typeorm';
import { Bin } from './entities/bin.entity';
import { Inventory } from './entities/inventory.entity';
import { Lot } from './entities/lot.entity';
import { StockEntry } from './entities/stock-entry.entity';
import { Warehouse } from './entities/warehouse.entity';
import { User } from '../users/user.entity';
import { UnimoveFilter } from './unimove.filter';
import { ExcelDateToJSDate } from '../common/utils';
import { type } from 'os';

@Injectable()
export class InventoryService {
   constructor(
      @InjectRepository(Inventory)
      private readonly inventoryRepository: MongoRepository<Inventory>,
      @InjectRepository(StockEntry)
      private readonly stockEntryRepository: MongoRepository<StockEntry>,
      @InjectRepository(Lot)
      private readonly lotRepository: MongoRepository<Lot>,
      @InjectRepository(Bin)
      private readonly treeRepository: MongoRepository<Bin>,
      @InjectRepository(Warehouse)
      private readonly warehouseRepository: MongoRepository<Warehouse>,
      @InjectRepository(InventoryTransferRequest)
      private readonly inventoryTransferRequestRepository: MongoRepository<InventoryTransferRequest>
   ) {}

   // Crud for Inventory Entity
    async findAllInventory(user): Promise<Inventory[]> {
        if (user.role === UserRole.PRODO) {
            return await this.inventoryRepository.find();
        }
        const filter = UnimoveFilter(user);
        return await this.inventoryRepository.find({ where: filter });
    }
    async findOneInventory(id: string): Promise<Inventory> {
        return await this.inventoryRepository.findOne(id);
    }
    async findInventoryByCode(code: string): Promise<Inventory> {
        return await this.inventoryRepository.findOne({ code: code });
    }
    async findInventoryByItemCode(itemCode: string): Promise<Inventory> {
        return await this.inventoryRepository.findOne({ itemCode: itemCode });
    }
    async findInventoryByItemId(itemId: string): Promise<Inventory> {
        return await this.inventoryRepository.findOne({ itemId: itemId });
    }
    async findInventoryByItemAndWarehouse(itemId: string, warehouseId: string): Promise<Inventory> {
        return await this.inventoryRepository.findOne({ itemId: itemId, warehouseId: warehouseId });
    }
    async findInventoryByWarehouse(warehouseId: string): Promise<Inventory[]> {
        return await this.inventoryRepository.find({ warehouseId: warehouseId });
    }
    async saveInventory(inventory: Inventory): Promise<Inventory> {
        return await this.inventoryRepository.save(inventory);
    }
    async deleteInventory(id: string): Promise<void> {
        await this.inventoryRepository.delete(id);
    }
    async updateInventory(id: string, inventory: any): Promise<Inventory> {
        return await this.inventoryRepository.update(id, inventory);
    }

    // Crud for StockEntry Entity
    async findAllStockEntries(user): Promise<StockEntry[]> {
        if (user.role === UserRole.PRODO) {
            return await this.stockEntryRepository.find();
        }
        const filter = UnimoveFilter(user);
        return await this.stockEntryRepository.find({ where: filter });
    }
    async findOneStockEntry(id: string): Promise<StockEntry> {
        return await this.stockEntryRepository.findOne(id);
    }
    async findStockEntryByWarehouse(warehouseId: string): Promise<StockEntry[]> {
        return await this.stockEntryRepository.find({ warehouseId: warehouseId });
    }
    async findStockEntryByInventory(inventoryId: string): Promise<StockEntry[]> {
        return await this.stockEntryRepository.find({ inventory_id: inventoryId });
    }
    async findStockEntryByWarehouseAndItem(warehouseId: string, itemId: string): Promise<StockEntry[]> {
        return await this.stockEntryRepository.find({ warehouse_id: warehouseId, item_id: itemId });
    }   
    async createStockEntry(stockEntry: StockEntry) {
        const inventory = await this.inventoryRepository.findOne(stockEntry.inventory_id);
        const foundStockEntry = await this.stockEntryRepository.findOne({
            inventory_id: stockEntry.inventory_id,
            item_id: stockEntry.item_id,
            entry_date: stockEntry.entry_date,
            entry_type: stockEntry.entry_type,
        });
        

        if (foundStockEntry) {
            foundStockEntry.qty = stockEntry.qty;
            console.log('StockEntry', stockEntry);
        console.log('foundStockEntry', foundStockEntry);
        

            return await this.stockEntryRepository.update(foundStockEntry.id, foundStockEntry).then(async () => {
                if (foundStockEntry.entry_type === 'IN' && inventory) {
                    inventory.current_qty = Number(inventory.current_qty) + Number(stockEntry.qty)-Number(foundStockEntry.qty);
                    return await this.inventoryRepository.save(inventory).then(async () => {
                        return await this.stockEntryRepository.save(foundStockEntry);
                    })
                }   
                if (foundStockEntry.entry_type === 'OUT' && inventory) {
                    inventory.current_qty = Number(inventory.current_qty) - Number(stockEntry.qty)+Number(foundStockEntry.qty);
                    return await this.inventoryRepository.save(inventory).then(async () => {
                        return await this.stockEntryRepository.save(foundStockEntry);
                    }
                    )

                }
                return await this.stockEntryRepository.save( foundStockEntry);
            }
            );

        } else {
           return await this.stockEntryRepository.save(stockEntry).then(async () => {
                if (stockEntry.entry_type === 'IN' && inventory) {
                    inventory.current_qty = Number(inventory.current_qty) + Number(stockEntry.qty);
                    inventory.last_uploaded_date = stockEntry.entry_date;
                    console.log('inventory', inventory);
                    return await this.inventoryRepository.save( inventory).then(() => {
                        console.log('stockEntry updated with inventory', stockEntry);
                        return stockEntry;
                    }
                    );
                }
                if (stockEntry.entry_type === 'OUT' && inventory) {
                    inventory.current_qty = Number(inventory.current_qty || 0) - Number(stockEntry.qty);
                    inventory.last_uploaded_date = stockEntry.entry_date;
                    console.log('inventory', inventory);
                    return await this.inventoryRepository.save(inventory).then(() => {
                        console.log('stockEntry updated out  with inventory', stockEntry);
                        if (stockEntry.item_id === '625d46484d1db7278d8ba88e') {
                            console.log('stockEntry updated seal out  with inventory', stockEntry);
                            console.log('inventory seal out', inventory);
                        }

                        return stockEntry;
                    });
                }
                return stockEntry;

            }
            );


        }
    }
    async deleteStockEntry(id: string): Promise<void> {
        await this.stockEntryRepository.delete(id);
    }
    async updateStockEntry(id: string, stockEntry: any): Promise<StockEntry> {
        return await this.stockEntryRepository.update(id, stockEntry);
    }

    // Crud for Lot Entity
    async findAllLots(): Promise<Lot[]> {
        return await this.lotRepository.find();
    }
    async findOneLot(id: string): Promise<Lot> {
        return await this.lotRepository.findOne(id);
    }
    async findLotsByInventoryAndLot(inventoryId: string, lotId: string): Promise<Lot> {
        return await this.lotRepository.findOne({ inventoryId: inventoryId, lotId: lotId });
    }
    async saveLot(lot: Lot): Promise<Lot> {
        return await this.lotRepository.save(lot);
    }
    async deleteLot(id: string): Promise<void> {
        await this.lotRepository.delete(id);
    }
    async updateLot(id: string, lot: any): Promise<Lot> {
        return await this.lotRepository.update(id, lot);
    }

    // Crud for Bin Entity
    async findAllBins(): Promise<Bin[]> {
        return await this.treeRepository.find();
    }
    async findOneBin(id: string): Promise<Bin> {
        return await this.treeRepository.findOne(id);
    }
    async findBinsByWarehouseAndBin(warehouseId: string, binId: string): Promise<Bin> {
        return await this.treeRepository.findOne({ warehouse_id: warehouseId, bin_id: binId });
    }
    async saveBin(bin: Bin): Promise<Bin> {
        return await this.treeRepository.save(bin);
    }
    async deleteBin(id: string): Promise<void> {
        await this.treeRepository.delete(id);
    }
    async updateBin(id: string, bin: any): Promise<Bin> {
        return await this.treeRepository.update(id, bin);
    }

    // Crud for Warehouse Entity
    async findAllWarehouses(user): Promise<Warehouse[]> {
        if (user.role === UserRole.PRODO) {
            return await this.warehouseRepository.find();
        }
        const filter = UnimoveFilter(user);
        return await this.warehouseRepository.find({ where: filter });

    }
    async findOneWarehouse(id: string): Promise<Warehouse> {
        return await this.warehouseRepository.findOne(id);
    }
    async findWarehousesByCode(code: string): Promise<Warehouse> {
        return await this.warehouseRepository.findOne({ code: code });
    }
    async createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
        return await this.warehouseRepository.save(warehouse);
    }
    async deleteWarehouse(id: string): Promise<void> {
        await this.warehouseRepository.delete(id);
    }
    async updateWarehouse(id: string, warehouse: any): Promise<Warehouse> {
        return await this.warehouseRepository.update(id, warehouse);
    }

    // Other Methods
    async getAllWarehousesForTerritory(territoryId: string): Promise<Warehouse[]> {
        const territory = await getTreeRepository(Territory).findOne(territoryId);
        if (!territory) {
            throw new NotFoundException(`Territory with id ${territoryId} not found`);
        }
        const territories = await getTreeRepository(Territory).findDescendants(territory);
        const warehouses = await getRepository(Warehouse).find(
        {where :{
            territoryId: { $in: territories.map(t => t.id) }
        }});
        return warehouses;
      }
    async getInventoryForWarehouses(warehouseIds: string[]): Promise<Inventory[]> {
        const inventories = await getRepository(Inventory).find(
        {where :{
            warehouseId: { $in: warehouseIds }
        }});
        return inventories;
    }

    // Crud for INventory Transfer Request Entity
    async findAllInventoryTransferRequests(user): Promise<InventoryTransferRequest[]> {
        
        return await this.inventoryTransferRequestRepository.find();
    }
    async findOneInventoryTransferRequest(id: string): Promise<InventoryTransferRequest> {
        return await this.inventoryTransferRequestRepository.findOne(id);
    }
    async findInventoryTransferRequestByInventory(inventoryId: string): Promise<InventoryTransferRequest[]> {
        return await this.inventoryTransferRequestRepository.find({ inventoryId: inventoryId });
    }
    

    async findInventoryTransferRequestByWarehouseAndItem(warehouseId: string, itemId: string): Promise<InventoryTransferRequest> {
        return await this.inventoryTransferRequestRepository.findOne({ warehouse_id: warehouseId, item_id: itemId });
    }
    async findInventoryTransferRequestByWarehouse(warehouseId: string): Promise<InventoryTransferRequest[]> {
        return await this.inventoryTransferRequestRepository.find({ warehouse_id: warehouseId });
    }


    async createInventoryTransferRequest(inventoryTransferRequest: InventoryTransferRequest): Promise<InventoryTransferRequest> {
        // BUY/PCGGNRDX/2223/B00001
        console.log('inventoryTransferRequest', inventoryTransferRequest);
        const sn1 = inventoryTransferRequest.type === 'Buy' ? 'BUY' : 'RET';
        const sn2 = await getRepository(Territory).findOne(inventoryTransferRequest.territory_id[0]).then(t => t.code);
        const sn3 = new Date().getFullYear().toString().substr(2, 2) + (new Date().getFullYear() + 1).toString().substr(2, 2);
        console.log('sn3', sn3);
        const sn4 = await getRepository(Item).findOne(inventoryTransferRequest.item_id).then(
            i => String(i.name).toUpperCase()[0]
        );
        const sn5 = await this.inventoryTransferRequestRepository.count(
            {
                inventory_id: inventoryTransferRequest.inventory_id,
                type: inventoryTransferRequest.type
            }
        ).then(
            
            c => String(c + 1).padStart(5, '0')
        );
        inventoryTransferRequest.code = `${sn1}/${sn2}/${sn3}/${sn4}${sn5}`;
        return await this.inventoryTransferRequestRepository.save(inventoryTransferRequest);
    }
    async deleteInventoryTransferRequest(id: string): Promise<void> {
        await this.inventoryTransferRequestRepository.delete(id);
    }
    async updateInventoryTransferRequest(id: string, inventoryTransferRequest: InventoryTransferRequest): Promise<InventoryTransferRequest> {
        const updatedRequest = await this.inventoryTransferRequestRepository.update(id, inventoryTransferRequest);
        if (inventoryTransferRequest.isCompleted) {
            if (inventoryTransferRequest.type === "Buy") {
                const stockEntry = new StockEntry( )
                stockEntry.item_id = inventoryTransferRequest.item_id;
                stockEntry.inventory_id = inventoryTransferRequest.inventory_id;
                stockEntry.territory_id = inventoryTransferRequest.territory_id;
                stockEntry.organization_id = inventoryTransferRequest.organization_id;
                stockEntry.warehouse_id = inventoryTransferRequest.warehouse_id;
                stockEntry.qty = inventoryTransferRequest.quantity
                stockEntry.entry_type = "IN";
                stockEntry.entry_date = new Date();
                
            } else if (inventoryTransferRequest.type === "Return") {
                const stockEntry = new StockEntry( )
                stockEntry.item_id = inventoryTransferRequest.item_id;
                stockEntry.warehouse_id = inventoryTransferRequest.warehouse_id;
                stockEntry.qty = inventoryTransferRequest.qty;
                stockEntry.entry_type = "OUT";
                stockEntry.entry_date = new Date();
            }
        }
        return updatedRequest;
    }
    async completeInventoryTransferRequest(id: string, user:User) {
        const inventoryTransferRequest = await this.inventoryTransferRequestRepository.findOne(id);
        if (!inventoryTransferRequest) {
            throw new NotFoundException(`Inventory Transfer Request with id ${id} not found`);
        }
        inventoryTransferRequest.isCompleted = true;
        inventoryTransferRequest.updatedBy = String(user.id)
        const foundInventory = await this.inventoryRepository.findOne(inventoryTransferRequest.inventory_id);
        if (!foundInventory) {
            throw new NotFoundException(`Inventory with id ${inventoryTransferRequest.inventory_id} not found`);
        }
        if (inventoryTransferRequest.type === "Buy") {
            foundInventory.current_qty = Number(foundInventory.current_qty)+ Number(inventoryTransferRequest.quantity);
        } else if (inventoryTransferRequest.type === "Return") {
            foundInventory.current_qty = Number(foundInventory.current_qty)- Number(inventoryTransferRequest.quantity);
        }
        foundInventory.updatedBy = inventoryTransferRequest.updatedBy;
        await this.inventoryRepository.save(foundInventory);


        return await this.inventoryTransferRequestRepository.save(inventoryTransferRequest);
    }
    // Unimove Daily Inventory Upload
    async uploadDailyInventory(file: any, user:User) {
        const workbook = await xlsx.readFile(file.path);
  const sheet_name_list = workbook.SheetNames;
  //console.log(sheet_name_list);
  const sheetName = sheet_name_list[0];
  const data = await xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{raw:true}, { header: 1 });
//   "Sl. No.": 34,
//         "Hub Name": "PC_BAMNOLI",
//         "Bag In Count": 9,
//         "Bag Out Count": 44,
//         "Bag Seal Usage Count": 44,
//         "Latest Upload Date": 44666
data
let stockEntries: StockEntry[] = [];
data.forEach(async element => {
    let stockEntry = new StockEntry();
    stockEntry.organization_id = user.organization_id;
    // convert excel date format to js date
    stockEntry.entry_date = await ExcelDateToJSDate(element["Latest Upload Date"]);
    console.log(stockEntry.entry_date);

    
    const hub = await getRepository(Territory).findOne({where:{ code: element['Hub Code'] }});
    if (!hub) {
        throw new NotFoundException(`Hub with code ${element['Hub Name']} not found`);
    }
    const warehouses = await getRepository(Warehouse).find({where:{ code: element['Hub Code'] }});
    const warehouse = warehouses[0]
    if (!warehouse) {
        throw new NotFoundException(`Warehouse with code ${hub.name} not found`);
    }
    stockEntry.warehouse_id = String(warehouse.id);
    const bag_id = "6267970ab05883604010289e"
    const seal_id = "625d46484d1db7278d8ba88e"
    const item = await getRepository(Item).findOne(bag_id);
    if (!item) {
        throw new NotFoundException(`Item with code ${bag_id} not found`);
    }
    stockEntry.item_id = String(item.id);
    const bagInventory = await getRepository(Inventory).findOne({where: { warehouse_id: stockEntry.warehouse_id, item_id: stockEntry.item_id }});
    if (!bagInventory) {
        throw new NotFoundException(`Inventory with code ${stockEntry.warehouse_id} not found`);
    }

    const stockEntryInBag = new StockEntry();
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
    // console.log(stockEntryInBag);
    stockEntries.push(stockEntryInBag);
    const stockEntryOutBag = new StockEntry();
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
    // //console.log(stockEntryOutBag);
    stockEntries.push(stockEntryOutBag);
    const sealInventory = await getRepository(Inventory).findOne({where: { warehouse_id: stockEntry.warehouse_id, item_id: seal_id }});
    if (!sealInventory) {
        throw new NotFoundException(`Inventory with code ${stockEntry.warehouse_id} not found`);
    }
    const stockEntryOutSeal = new StockEntry();
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
    const savedBagSEntry = await this.createStockEntry(stockEntryInBag);
    const savedBagInSEntry = await this.createStockEntry(stockEntryOutBag);
    const savedSealSEntry = await this.createStockEntry(stockEntryOutSeal);
    // //console.log(savedBagSEntry);
    
    // //console.log(savedBagInSEntry);
    // //console.log(savedSealSEntry);
    // //console.log(stockEntries);
    // //console.log(stockEntry);
    return Promise.all([savedBagSEntry, savedBagInSEntry, savedSealSEntry]).then((values) => {
         console.log(values);
    }
    ).catch((err) => {
         console.log(err);
    }
    );

}
);
// console.log(stockEntries);
return new Promise((resolve, reject) => {
    resolve(stockEntries);
}
);
}


    async resetInventory(file:any,user:User){
        //Sl. No.	Hub Name	Bag Inventory Count	Seal Inventory Count	Latest Upload Date
        const workbook = await xlsx.readFile(file.path);
        const sheet_name_list = workbook.SheetNames;
        //console.log(sheet_name_list);
        const sheetName = sheet_name_list[0];
        const data = await xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{raw:true}, { header: 1 });
        console.log(data);
        // Language: typescript
        Promise.all(await data.map(async element => {
            const hub = await getRepository(Territory).findOne(
                {where: { $or: [{ code: element['Hub Code'] }, { name: element['Hub Name'] }, { name : element['Hub Code'] }] }});

            if (!hub) {
                throw new NotFoundException(`Hub with code ${element['Hub Name']} not found`);
            }
            const warehouse = await getRepository(Warehouse).findOne({where : { $or: [{ code: element['Hub Code'] }, { name: element['Hub Name'] }, { name : element['Hub Code'] }] } }).catch(e => {
                throw new NotFoundException(`Warehouse with code ${hub.name} not found`);
            }
            );
            if (!warehouse) {
                throw new NotFoundException(`Warehouse with code ${hub.id} not found`);
            }
            const bag_id = "6267970ab05883604010289e"
            const seal_id = "625d46484d1db7278d8ba88e"
            const item = await getRepository(Item).findOne(bag_id).catch(e => {
                throw new NotFoundException(`Item with code ${bag_id} not found`);
            });
            if (!item) {
                throw new NotFoundException(`Item with code ${bag_id} not found`);
            }
            const bagInventory = await getRepository(Inventory).findOne({ warehouse_id: String(warehouse.id), item_id: bag_id });
            if (!bagInventory) {
                throw new NotFoundException(`Inventory for code ${warehouse.code} not found`);
            }
            bagInventory.current_qty = Number(element['Bag Inventory Count']);
            bagInventory.updatedBy = String(user.id);
            bagInventory.updatedAt = new Date();
            bagInventory.last_uploaded_date = await ExcelDateToJSDate(element['Latest Upload Date']);
            const savedBagInventory = await getRepository(Inventory).save(bagInventory);
            console.log(savedBagInventory); 
            const sealInventory = await getRepository(Inventory).findOne({ warehouse_id: String(warehouse.id), item_id: seal_id });
            if (!sealInventory) {
                throw new NotFoundException(`Inventory not found`);
            }
            sealInventory.current_qty = Number(element['Bag Seal Inventory Count']);
            sealInventory.updatedBy = String(user.id);
            sealInventory.updatedAt = new Date();
            sealInventory.last_uploaded_date = await ExcelDateToJSDate(element['Latest Upload Date']);
            const savedSealInventory = await getRepository(Inventory).save(sealInventory);
            console.log(savedBagInventory);
            console.log(savedSealInventory);
            Promise.all([savedBagInventory, savedSealInventory]);
        


    }));
    return "Inventory Updated"
}
async getDashDataUSM(user:User){
    const data: { hub_id: string; type: string; current_inventory: number; buffer_stock: number; latest_stock_in_quantity: number; day_since_stock_in_done: number; latest_stock_out_quantity: number; day_since_stock_out_done: number; today_consumption: number; weekly_avg_consumption: number; }[]= []
    const dataFilter =  UnimoveFilter(user)
    console.log(dataFilter);
    console.log(user);
    const inventories = await getRepository(Inventory).find({where:dataFilter});
    console.log(inventories);
    async function getDashData(user:User)  {await Promise.all(inventories.map(async (element) => {
        const item = await getRepository(Item).findOne(element.item_id);
        if (!item) {
            throw new NotFoundException(`Item with code ${element.item_id} not found`);
        }
        // get all the stock entries for the item in the territory
        const stockEntries = await getRepository(StockEntry).find({where:{inventory_id:element.id, entry_date: { $gte: new Date(new Date().setDate(new Date().getDate() - 15)) }}});
        const inventoryRequests = await getRepository(InventoryTransferRequest).find({where:{inventory_id:element.id,isCompleted:true, updatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 15)) }}});
    // Type	Current Inventory	Buffer Stock	Latest stock in quantity	Day since stock in done	Latest stock out quantity	Day since stock out done	Today's consumption	Weekly Avg Consumption
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
        }
        let stockIn = 0;
        let stockOut = 0;
        let bought = 0;
        let returned = 0;
        if (stockEntries.length > 0) {
            stockEntries.forEach(stockEntry => {
                if (stockEntry.entry_type == 'IN') {
                    stockIn += stockEntry.qty;
                } else {
                    stockOut += stockEntry.qty;
                }
            });
        }
        if(inventoryRequests.length > 0){
        inventoryRequests.forEach(inventoryRequest => {
            if (inventoryRequest.type == 'BUY') {
                bought += inventoryRequest.qty;
            }
            if (inventoryRequest.type == 'RETURN') {
                returned += inventoryRequest.qty;
            }
        });}
        let past_qty = element.current_qty-stockIn+stockOut;
        let avgConsumed = stockOut/15;
        let buffer_stock = past_qty + (stockIn-stockOut+bought-returned)/15
        dataObj.buffer_stock = buffer_stock;
        // get latest stock entry for the item in the territory
        const latestStockOutEntry = await getRepository(StockEntry).findOne({ entry_type:'OUT' }, {order: {entry_date: "DESC"}})
        const latestStockINEntry = await getRepository(StockEntry).findOne({ entry_type:'IN' }, {order: {entry_date: "DESC"}});   
        if (latestStockOutEntry) {
            dataObj.latest_stock_out_quantity = latestStockOutEntry.qty;
            dataObj.day_since_stock_out_done = Math.floor((new Date().getDate() - new Date(latestStockOutEntry.entry_date).getDate()));
            console.log('entrydate',latestStockOutEntry);
        }
        if (latestStockINEntry) {
            dataObj.latest_stock_in_quantity = latestStockINEntry.qty;
            dataObj.day_since_stock_in_done = Math.floor((new Date().getTime() - new Date(latestStockINEntry.entry_date).getTime())/(1000*60*60*24));
        }
        // find entry for today
        const todayStockOutEntry = await getRepository(StockEntry).findOne({ entry_type:'OUT', entry_date: new Date(new Date().setHours(0,0,0,0)) });
        let weeklyAvgConsumed = 0;
        stockEntries.forEach(stockEntry => {
            if (stockEntry.entry_type == 'OUT' && new Date(stockEntry.entry_date).getTime() >= new Date(new Date().setDate(new Date().getDate() - 7)).getTime()) {
             
                    weeklyAvgConsumed += stockEntry.qty;
            }
        });     
        dataObj.weekly_avg_consumption = weeklyAvgConsumed/7;
        if (todayStockOutEntry) {
            dataObj.today_consumption = todayStockOutEntry.qty;
        }
        console.log(dataObj);
        return data.push(dataObj);
    }))
    return data;
}
return await getDashData(user);
}
}





