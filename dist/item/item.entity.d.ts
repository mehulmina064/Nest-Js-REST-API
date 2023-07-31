import { ObjectID } from 'typeorm';
import { OrganizationModel } from '../common/org-model.entity';
export declare class Item extends OrganizationModel {
    id: ObjectID;
    sku: string;
    name: string;
    productId: string;
    productVariant: string;
    quantity: number;
    uom: string;
    status: string;
    price: number;
    totalPrice: number;
    currency: string;
}
