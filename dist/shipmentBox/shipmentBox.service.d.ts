import { Repository } from 'typeorm';
import { ShipmentBoxCreateDto, ShipmentBoxUpdateDto } from './shipmentBox.dto';
import { ShipmentBox } from './shipmentBox.entity';
export declare class ShipmentBoxService {
    private shipmentBoxRepository;
    constructor(shipmentBoxRepository: Repository<ShipmentBox>);
    findAll(): Promise<ShipmentBox[]>;
    findOne(id: string): Promise<ShipmentBox>;
    create(shipmentBox: ShipmentBoxCreateDto): Promise<ShipmentBox>;
    update(id: string, shipmentBox: ShipmentBoxUpdateDto): Promise<ShipmentBoxUpdateDto & ShipmentBox>;
    delete(id: string): Promise<ShipmentBox[]>;
}
