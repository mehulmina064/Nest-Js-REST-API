import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class zohoSalesOrder extends BaseAppEntity {
    id: ObjectID;
    zohoId: string;
    orderDetails: {};
}
