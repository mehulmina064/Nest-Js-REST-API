import { DeleteResult, MongoRepository, UpdateResult } from 'typeorm';
import { Shipment } from './shipment.entity';
export declare class ShipmentService {
    private readonly shipmentRepository;
    constructor(shipmentRepository: MongoRepository<Shipment>);
    findAll(): Promise<Shipment[]>;
    findOne(id: string): Promise<Shipment>;
    create(shipment: Shipment): Promise<Shipment>;
    update(id: string, shipment: Shipment): Promise<UpdateResult>;
    delete(id: string): Promise<DeleteResult>;
}
