import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentService } from "./shipment.service";

// CRUD Controller for Shipment
@Controller('shipments')
export class ShipmentController {
    constructor(private readonly shipmentService: ShipmentService) {}
    @Get()
    findAll(): Promise<Shipment[]> {
        return this.shipmentService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Shipment> {
        return this.shipmentService.findOne(id);
    }
    @Post()
    create(@Body() shipment: Shipment): Promise<Shipment> {
        return this.shipmentService.create(shipment);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() shipment: Shipment): Promise<UpdateResult> {
        return this.shipmentService.update(id, shipment);
    }
    @Delete(':id')
    delete(@Param('id') id: string): Promise<DeleteResult> {
        return this.shipmentService.delete(id);
    }
}
        