import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class dashboardData extends BaseAppEntity {
    id: ObjectID;
    userId: string;
    data: {};
}
