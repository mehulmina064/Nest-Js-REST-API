import { ObjectID } from 'typeorm';
import { OrganizationModel } from '../common/org-model.entity';
export declare class Territory extends OrganizationModel {
    id: ObjectID;
    name: string;
    code: string;
    type: string;
    parent: string;
    level: number;
    group_name: string;
    address_id: string;
}
