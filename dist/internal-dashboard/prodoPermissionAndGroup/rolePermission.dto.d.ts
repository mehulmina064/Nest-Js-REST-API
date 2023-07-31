import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
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
export declare class CreateModulePermissionDto extends BaseCreateDto {
    moduleName: ModuleNames;
    fullAccess: boolean;
    canShare: boolean;
    canExport: boolean;
    canCreate: boolean;
    canDelete: boolean;
    canView: boolean;
    canEdit: boolean;
    canView: boolean;
    morePermissions?: MorePermission[] | [];
}
export declare class UpdateModulePermissionDto extends BaseCreateDto {
    moduleName: ModuleNames;
    fullAccess: boolean;
    canShare: boolean;
    canExport: boolean;
    canCreate: boolean;
    canDelete: boolean;
    canView: boolean;
    canEdit: boolean;
    canView: boolean;
    morePermissions?: MorePermission[] | [];
}
export declare class CreateRolePermissionDto extends BaseCreateDto {
    roleId: string;
    permissionGroupId: string;
}
export declare class UpdateRolePermissionDto extends BaseCreateDto {
    roleId: string;
    permissionGroupId: string;
}
export declare class CreatePermissionDto extends BaseCreateDto {
    permissionGroupName: string;
    permissionGroupDisplayName?: string | "";
    status: permissionGroupStatus | permissionGroupStatus.ACTIVE;
    isDefault?: boolean;
    permissionGroupDescription?: string | "";
    permissions?: Permission[] | [];
}
export declare class UpdatePermissionDto extends BaseUpdateDto {
    permissionGroupName: string;
    permissionGroupDisplayName?: string | "";
    status: permissionGroupStatus | permissionGroupStatus.ACTIVE;
    isDefault?: boolean;
    permissions?: Permission[] | [];
    permissionGroupDescription?: string | "";
}
