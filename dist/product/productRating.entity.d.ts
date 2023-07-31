import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class ProductRating extends BaseAppEntity {
    id: ObjectID;
    zohoId: string;
    prodoId: string;
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
}
