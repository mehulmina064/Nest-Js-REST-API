import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class logistics extends BaseAppEntity {
    id: ObjectID | undefined;
    name?: string | "";
    displayName?: string | "";
    apiUrl?: string | "";
    trackingUrl?: string | "";
    rating?: Number | 0;
    status: Status | undefined;
    description?: string | "";
}
