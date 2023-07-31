import { ObjectID } from 'typeorm';
import { BaseAppEntity } from './../common/base-app.entity';
export declare class zohoToken extends BaseAppEntity {
    id: ObjectID;
    token: string;
}
