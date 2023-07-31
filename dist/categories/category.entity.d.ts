import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class Category extends BaseAppEntity {
    id: ObjectID;
    parentCategoryId: string;
    categoryName: string;
    categoryImages: string[];
    categoryBanners: [];
    description: string;
    status: Status | undefined;
}
