// Create Module File

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentBox } from './shipmentBox.entity';
import { ShipmentBoxService } from './shipmentBox.service';
import { ShipmentBoxController } from './shipmentBox.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ShipmentBox])],
    providers: [ShipmentBoxService],
    controllers: [ShipmentBoxController],
    exports: [ShipmentBoxService]
})
export class ShipmentBoxModule {}
