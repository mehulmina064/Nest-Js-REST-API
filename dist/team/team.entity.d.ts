import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class Team extends BaseAppEntity {
    id: ObjectID;
    name: string;
    mails: string[];
    admins: string[];
    users: string[];
    description: string;
}
