import { DeleteResult, UpdateResult } from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentService } from "./shipment.service";
export declare class ShipmentController {
    private readonly shipmentService;
    constructor(shipmentService: ShipmentService);
    findAll(): Promise<Shipment[]>;
    findOne(id: string): Promise<Shipment>;
    create(shipment: Shipment): Promise<Shipment>;
    update(id: string, shipment: Shipment): Promise<UpdateResult>;
    delete(id: string): Promise<DeleteResult>;
}
