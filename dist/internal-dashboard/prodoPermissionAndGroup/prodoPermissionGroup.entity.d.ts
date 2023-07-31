import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
import { ModuleNames } from './moduleNames.constant';
export declare enum permissionGroupStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class MorePermission {
    permission?: string | "";
    permissionFormatted?: string | "";
    is_enabled?: boolean | false;
}
export declare class Permission {
    moduleName?: ModuleNames | undefined;
    fullAccess?: boolean | false;
    canShare?: boolean | false;
    canExport?: boolean | false;
    canCreate?: boolean | false;
    canDelete?: boolean | false;
    canView?: boolean | true;
    canEdit?: boolean | false;
    createdAt?: Date;
    updatedAt?: Date;
    morePermissions?: MorePermission[] | [];
}
export declare class prodoPermissionGroup extends BaseAppEntity {
    id: ObjectID | undefined;
    permissionGroupName?: string | "";
    permissionGroupDisplayName?: string | "";
    accessType?: string | "ALL";
    status: permissionGroupStatus | undefined;
    isDefault?: boolean | false;
    permissionGroupDescription?: string | "";
    permissions?: Permission[] | [];
}
