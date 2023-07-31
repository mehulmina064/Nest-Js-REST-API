import { InventoryTransferRequest } from './entities/requests.entity';
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Lot } from './entities/lot.entity';
import { Bin } from './entities/bin.entity';
import { StockEntry } from './entities/stock-entry.entity';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  controllers: [InventoryController],
  imports: [TypeOrmModule.forFeature([Inventory,Lot,Bin,StockEntry,Warehouse,InventoryTransferRequest ])],
  providers: [InventoryService],
  exports: [InventoryService, TypeOrmModule.forFeature([Inventory,Lot,Bin,StockEntry,Warehouse,InventoryTransferRequest])]
})
export class InventoryModule {}
