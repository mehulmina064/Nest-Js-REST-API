import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class zohoSalesOrderByUser extends BaseAppEntity {
    id: ObjectID;
    email: string;
    orderIds: string[];
}
