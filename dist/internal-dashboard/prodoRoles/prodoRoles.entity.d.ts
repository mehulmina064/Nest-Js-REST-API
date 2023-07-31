import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum roleStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class prodoRoles extends BaseAppEntity {
    id: ObjectID | undefined;
    roleName?: string | "";
    roleDisplayName?: string | "";
    status: roleStatus | undefined;
    isDefault?: boolean | false;
    roleDescription?: string | "";
}
