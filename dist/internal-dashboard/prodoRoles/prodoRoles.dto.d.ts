import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
export declare enum roleStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class CreateRoleDto extends BaseCreateDto {
    roleName: string;
    roleDisplayName?: string | "";
    status: roleStatus | roleStatus.ACTIVE;
    isDefault?: boolean;
    roleDescription?: string | "";
}
export declare class UpdateRoleDto extends BaseUpdateDto {
    roleName: string;
    roleDisplayName?: string | "";
    status: roleStatus | roleStatus.ACTIVE;
    isDefault?: boolean;
    roleDescription?: string | "";
}
export declare class CreateUserRoleDto extends BaseCreateDto {
    roleId: string;
    userId: string;
}
export declare class UpdateUserRoleDto extends BaseUpdateDto {
    roleId: string;
    userId: string;
}
export declare class CreateRolePermissionDto extends BaseCreateDto {
    roleId: string;
    permissionGroupId: string;
}
export declare class UpdateRolePermissionDto extends BaseCreateDto {
    roleId: string;
    permissionGroupId: string;
}
