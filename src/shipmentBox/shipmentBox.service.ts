// nestJS mongo Typeorm service for shipmentBox with all CRUD operations using DTOs


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ShipmentBoxCreateDto, ShipmentBoxDto, ShipmentBoxUpdateDto } from './shipmentBox.dto';
import { ShipmentBox } from './shipmentBox.entity';

@Injectable()
export class ShipmentBoxService {
    constructor(   @InjectRepository(ShipmentBox)   private shipmentBoxRepository: Repository<ShipmentBox>){}
    async findAll(): Promise<ShipmentBox[]> {
        return await this.shipmentBoxRepository.find();
    }
    async findOne(id: string): Promise<ShipmentBox> {
        return await this.shipmentBoxRepository.findOne(id);
    }
    async create(shipmentBox: ShipmentBoxCreateDto): Promise<ShipmentBox> {
        return await this.shipmentBoxRepository.save(shipmentBox);
    }
    async update(id: string, shipmentBox: ShipmentBoxUpdateDto){
        shipmentBox.id = id;
        return await this.shipmentBoxRepository.save(shipmentBox);
    }
    async delete(id: string){
        const shipmentBox = await this.shipmentBoxRepository.findOne(id);
        const deletedShipmentBox = await this.shipmentBoxRepository.remove(shipmentBox);
        return deletedShipmentBox;
    }

}
