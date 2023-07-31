import { BaseAppEntity } from './../common/base-app.entity';
import { ObjectID } from 'typeorm';
import { DocumentType } from './document.entity';
export declare class DocumentStatus extends BaseAppEntity {
    id: ObjectID;
    status: string;
    description: string;
    code: string;
    type: string;
    index: number;
    is_active: boolean;
    is_default: boolean;
    is_system: boolean;
    location: string;
    timestamp: Date;
    actionAvailable: {
        from: [];
        to: [];
    };
}
export declare class StatusTemplate extends BaseAppEntity {
    id: ObjectID;
    statuses: DocumentStatus[];
    type: DocumentType;
}
