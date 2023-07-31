import { ObjectID } from 'typeorm';
import { OrganizationModel } from '../common/org-model.entity';
export declare class EmailTemplate extends OrganizationModel {
    id: ObjectID;
    name: string;
    subject: string;
    body: string;
    isActive: boolean;
    isDefault: boolean;
    isSystem: boolean;
    actionAvailable: {
        from: [];
        to: [];
    };
    isHtml: boolean;
}
