import { ObjectID } from 'typeorm';
export declare class Setting {
    id: ObjectID;
    owner_id: string;
    owner_type: string;
    key: string;
    value: string;
    description: string;
    isActive: boolean;
    isSystem: boolean;
}
