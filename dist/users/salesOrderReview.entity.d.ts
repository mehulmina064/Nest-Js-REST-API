import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class salesOrderReview extends BaseAppEntity {
    id: ObjectID;
    userId: string;
    zohoId: string;
    prodoId: string;
    packageId: string;
    rating: number;
    comment: string;
}
