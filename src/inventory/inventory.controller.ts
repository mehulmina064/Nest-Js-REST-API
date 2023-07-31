import { Roles } from './../authentication/roles.decorator';
import { RolesGuard } from './../authentication/roles.guard';
import { JwtAuthGuard } from './../authentication/jwt-auth.guard';
import { UserRole } from './../users/roles.constants';
import { Auth } from '../authentication/auth.decorator';
import { Territory } from './../territory/territory.entity';
import { User } from './../users/user.entity';
import { getRepository, getTreeRepository } from 'typeorm';
import { Lot } from './entities/lot.entity';
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Warehouse } from './entities/warehouse.entity';
import { InventoryTransferRequest } from './entities/requests.entity';
import { StockEntry } from './entities/stock-entry.entity';
import { Inventory } from './entities/inventory.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../files/file.utils';
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Crud for Inventory Entity

  @Get()
  findAllInventory(@Request() req): Promise<any> {
    // if user role includes admin, return all inventory
    // console.log(req.user.roles);
    return this.inventoryService.findAllInventory(req.user);
    
  }

  @Get('inventoryById/:id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.inventoryService.findOneInventory(id);
  }

  @Get('inventoryByCode/:code')
  findByCode(@Param('code') code: string): Promise<any> {
    return this.inventoryService.findInventoryByCode(code);
  }

  @Get('inventoryByItemCode/:itemCode')
  findByItemCode(@Param('itemCode') itemCode: string): Promise<any> {
    return this.inventoryService.findInventoryByItemCode(itemCode);
  }

  @Get('inventoryByItemId/:itemId')
  findByItemId(@Param('itemId') itemId: string): Promise<any> {
    return this.inventoryService.findInventoryByItemId(itemId);
  }

  @Get('inventoryByItemAndWarehouse/:itemId/:warehouseId')
  findByItemAndWarehouse(
    @Param('itemId') itemId: string,
    @Param('warehouseId') warehouseId: string,
  ): Promise<any> {
    return this.inventoryService.findInventoryByItemAndWarehouse(itemId, warehouseId);
  }

  @Get('inventoryByWarehouse/:warehouseId')
  findInventoryByWarehouse(@Param('warehouseId') warehouseId: string): Promise<any> {
    return this.inventoryService.findInventoryByWarehouse(warehouseId);
  }

  @Post('createInventory')
  async createInventory(@Body() inventory:Inventory): Promise<any> {
    return this.inventoryService.saveInventory(inventory);
  }

  @Patch('updateInventory/:id')
  async updateInventory(
    @Param('id') id: string,
    @Body() inventory:Inventory,
  ): Promise<any> {
    return this.inventoryService.updateInventory(id, inventory);
  }

  // Crud for StockEntry Entity
  @Get('stockEntries')
  findAllStockEntries(@Request() req): Promise<any> {
    return this.inventoryService.findAllStockEntries(req.user);
  }

  @Get('stockEntryById/:id')
  findOneStockEntry(@Param('id') id: string): Promise<any> {
    return this.inventoryService.findOneStockEntry(id);
  }

  @Get('stockEntryByInventory/:inventoryId')
  findStockEntryByInventory(@Param('inventoryId') inventoryId: string): Promise<any> {
    return this.inventoryService.findStockEntryByInventory(inventoryId);
  }

  @Get('stockEntryByWarehouse/:warehouseId')
  findStockEntryByWarehouse(@Param('warehouseId') warehouseId: string): Promise<any> {
    return this.inventoryService.findStockEntryByWarehouse(warehouseId);
  }

  @Get('stockEntryByWarehouseAndItem/:warehouseId/:itemId')
  findStockEntryByWarehouseAndItem(
    @Param('warehouseId') warehouseId: string,
    @Param('itemId') itemId: string,
  ): Promise<any> {
    return this.inventoryService.findStockEntryByWarehouseAndItem(warehouseId, itemId);
  }

  @Post('createStockEntry')
  async createStockEntry(@Body() stockEntry : StockEntry): Promise<any> {
    const savedStockEntry = await this.inventoryService.createStockEntry(stockEntry);    

    return savedStockEntry;
  }

  @Patch('updateStockEntry/:id')
  async updateStockEntry(
    @Param('id') id: string,
    @Body() stockEntry : StockEntry,
  ): Promise<any> {
    return this.inventoryService.updateStockEntry(id, stockEntry);
  }

  // Crud for Lot Entity

  @Get('lots')
  findAllLots(): Promise<any> {
    return this.inventoryService.findAllLots();
  }

  @Get('lotById/:id')
  findOneLot(@Param('id') id: string): Promise<any> {
    return this.inventoryService.findOneLot(id);
  }

  @Post('createLot')
  async createLot(@Body() createLotDto: Lot): Promise<any> {
    return this.inventoryService.saveLot(createLotDto);
  }

  @Patch('updateLot/:id')
  async updateLot(
    @Param('id') id: string,
    @Body() updateLotDto: Lot,
  ): Promise<any> {
    return this.inventoryService.updateLot(id, updateLotDto);
  }

  // Crud for InventoryTrasnferRequest

  @Get('inventoryTransferRequests')
  findAllInventoryTransferRequests(@Request() req): Promise<any> {
    return this.inventoryService.findAllInventoryTransferRequests(req.user);
  }

  @Get('inventoryTransferRequestById/:id')
  findOneInventoryTransferRequest(@Param('id') id: string): Promise<any> {
    return this.inventoryService.findOneInventoryTransferRequest(id);
  }

  @Get('inventoryTransferRequestByInventory/:inventoryId')
  findInventoryTransferRequestByInventory(@Param('inventoryId') inventoryId: string): Promise<any> {
    return this.inventoryService.findInventoryTransferRequestByInventory(inventoryId);
  }

  @Get('inventoryTransferRequestByWarehouse/:warehouseId')
  findByInventoryTransferRequestByWarehouse(@Param('warehouseId') warehouseId: string): Promise<any> {
    return this.inventoryService.findInventoryTransferRequestByWarehouse(warehouseId);
  }

  @Get('inventoryTransferRequestByWarehouseAndItem/:warehouseId/:itemId')
  findInventoryTransferRequestByWarehouse(
    @Param('warehouseId') warehouseId: string,
    @Param('itemId') itemId: string,
  ): Promise<any> {
    return this.inventoryService.findInventoryTransferRequestByWarehouseAndItem(warehouseId, itemId);
  }


  @Post('createInventoryTransferRequest')
  async createInventoryTransferRequest(
    @Body() inventoryTranserRequest: InventoryTransferRequest, @Request() req
  ): Promise<any> {
    inventoryTranserRequest.createdBy = req.user.id;
    return this.inventoryService.createInventoryTransferRequest(
      inventoryTranserRequest,
    );
  }
  
  //deleteInventoryTransferRequest
  @Delete('deleteInventoryTransferRequest/:id')
  async deleteInventoryTransferRequest(@Param('id') id: string): Promise<any> {
    return this.inventoryService.deleteInventoryTransferRequest(id);
  }

  @Patch('updateInventoryTransferRequest/:id')
  async updateInventoryTransferRequest(
    @Param('id') id: string,
    @Body() inventoryTranserRequest: InventoryTransferRequest,
  ): Promise<any> {
    return this.inventoryService.updateInventoryTransferRequest(
      id,
      inventoryTranserRequest,
    );
  }
  @Patch('completeInventoryTransferRequest/:id')
  async completeInventoryTransferRequest(
    @Param('id') id: string, @Request() req): Promise<any> {
    return this.inventoryService.completeInventoryTransferRequest(
      id, req.user
    );
  }

  



  // Warehouse Controller
@UseGuards(JwtAuthGuard)
  @Get('warehouses')
  findAllWarehouses(@Request() req): Promise<any> {
    console.log(req.user);
    return this.inventoryService.findAllWarehouses(req.user);
  }

  @Get('warehouseById/:id')
  findOneWarehouse(@Param('id') id: string): Promise<any> {
    return this.inventoryService.findOneWarehouse(id);
  }

  @Post('createWarehouse')
  async createWarehouse(@Body() warehouse:Warehouse): Promise<any> {
    return this.inventoryService.createWarehouse(warehouse);
  }
  
  @Patch('updateWarehouse/:id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() warehouse:Warehouse,
  ): Promise<any> {
    return this.inventoryService.updateWarehouse(id, warehouse);
  }

  @Delete('deleteWarehouse/:id')
  async deleteWarehouse(@Param('id') id: string): Promise<any> {
    return this.inventoryService.deleteWarehouse(id);
  }

  // Unimove Endpoints
  @Post('upload-daily-inventory/')
  @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './files',
            filename: editFileName,
          }),
        }),
      )
    async uploadDailyInventory(@UploadedFile() file,@Request() req){
      const result = await this.inventoryService.uploadDailyInventory(file,req.user);
      return result;
    }
    @Post('reset-daily-inventory/')
    @UseInterceptors(
          FileInterceptor('file', {
            storage: diskStorage({
              destination: './files',
              filename: editFileName,
            }),
          }),
        )
    async resetInventory(@UploadedFile() file,@Request() req){
      const result = await this.inventoryService.resetInventory(file,req.user);
      return result;
    }
    @Get('dash-data-usm/')
    async getDashDataUSM(@Request() req){
      const result = await this.inventoryService.getDashDataUSM(req.user);
      return result;
    }
    @Get('dash-data-admin/')
    async getDashDataWarehouse(@Request() req){
      const result = await this.inventoryService.getDashDataAdmin(req.user);
      return result;
    }
    @Get('clean-data')
    async cleanData(){
      // const hubs = await getRepository(Territory).find({where:{ createdAt : { $gte : new Date('2022-04-29T06:10:36.570+00:00') } }});
      // const warehouses = await getRepository(Warehouse).find({where:{ createdAt : { $gte : new Date('2022-04-29T06:10:36.570+00:00') } }});
      // const inventories = await getRepository(Inventory).find( { 
      //   where: 
      //   { createdAt : 
      //     { $gte : new Date('2022-04-29T06:10:36.570+00:00') } 
      //   }
      // }
      // );
      // await getRepository(Territory).remove(hubs);
      // await getRepository(Warehouse).remove(warehouses);
      // await getRepository(Inventory).remove(inventories);
      const stockEntry = await getRepository(StockEntry).find();
      await getRepository(StockEntry).remove(stockEntry);
      return {
        status : 'success',
        message : 'Data cleaned'
      }
    }


    

  
}
