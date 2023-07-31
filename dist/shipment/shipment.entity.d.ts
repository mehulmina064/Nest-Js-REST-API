import { ObjectID } from 'typeorm';
import { ShipmentBoxDto } from '../shipmentBox/shipmentBox.dto';
export declare class Shipment {
    id: ObjectID;
    name: string;
    description: string;
    price: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    image: string;
    quantity: number;
    category: string;
    subcategory: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    shipmentBox: ShipmentBoxDto[];
    orderId: string;
}
