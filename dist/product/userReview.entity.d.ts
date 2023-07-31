import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class UserReview extends BaseAppEntity {
    id: ObjectID;
    userId: string;
    zohoId: string;
    prodoId: string;
    rating: number;
    comment: string;
}
