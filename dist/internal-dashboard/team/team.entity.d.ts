import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum teamStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class internalTeam extends BaseAppEntity {
    id: ObjectID | undefined;
    teamName?: string | "";
    teamDisplayName?: string | "";
    status: teamStatus | undefined;
    isDefault?: boolean | false;
    teamDescription?: string | "";
}
