import { ObjectID } from 'typeorm';
export declare class Wishlist {
    id: ObjectID;
    userId: string;
    productIds: string;
}
