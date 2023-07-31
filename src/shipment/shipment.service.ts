//service for shipment module
import { Injectable, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository, Repository, UpdateResult } from 'typeorm';
import { Shipment } from './shipment.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()   
export class ShipmentService {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: MongoRepository<Shipment>,
        ) {}
    
    async findAll(): Promise<Shipment[]> {
        const shipments = await this.shipmentRepository.find();
        // tslint:disable-next-line:prefer-for-of
        return shipments;
    }
    async findOne(id: string): Promise<Shipment> {
        const shipment = await this.shipmentRepository.findOne(id);
        return shipment;

    }
    async create(shipment: Shipment): Promise<Shipment> {
        const newShipment = await this.shipmentRepository.save(shipment);
        return newShipment;
    }       
    async update(id: string, shipment: Shipment): Promise<UpdateResult> {
        const updatedShipment = await this.shipmentRepository.update(id, shipment);
        return updatedShipment
        }       
    async delete(id: string): Promise<DeleteResult> {
        const deletedShipment = await this.shipmentRepository.delete(id);
        return deletedShipment
    }               
}