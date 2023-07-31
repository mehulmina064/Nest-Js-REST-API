import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';
import { ModuleNames } from './moduleNames.constant';
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray, IsLowercase, IsEnum } from 'class-validator';

export enum permissionGroupStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }

export class MorePermission{
    @ApiModelProperty()
    @Column()
    permission?: string | "";

    @ApiModelProperty()
    @Column()
    permissionFormatted?: string | "";

    @ApiModelProperty()
    @Column()
    is_enabled?: boolean | false;
}
export class Permission  {
    
    @ApiModelProperty()
    @Column()
    moduleName?: ModuleNames | undefined;

    @ApiModelProperty()
    @Column()
    fullAccess?: boolean | false;

    @ApiModelProperty()
    @Column()
    canShare?: boolean | false;

    @ApiModelProperty()
    @Column()
    canExport?: boolean | false;

    @ApiModelProperty()
    @Column()
    canCreate?: boolean | false;

    @ApiModelProperty()
    @Column()
    canDelete?: boolean | false;

    @ApiModelProperty()
    @Column()
    canView?: boolean | true;

    @ApiModelProperty()
    @Column()
    canEdit?: boolean | false;

    @ApiModelProperty()
    createdAt?: Date;

    @ApiModelProperty()
    updatedAt?: Date;

    @ApiModelProperty()
    @Column()
    morePermissions?: MorePermission[] | [];

}

export class CreateModulePermissionDto extends BaseCreateDto {
    @IsNotEmpty()
    moduleName: ModuleNames;
    @IsBoolean()
    fullAccess: boolean;
    @IsBoolean()
    canShare: boolean;
    @IsBoolean()
    canExport: boolean;
    @IsBoolean()
    canCreate: boolean;
    @IsBoolean()
    canDelete: boolean;
    @IsBoolean()
    canView: boolean;
    @IsBoolean()
    canEdit: boolean;
    @IsBoolean()
    canView: boolean;
    @IsArray()
    morePermissions?: MorePermission[] | [];
  }

  export class UpdateModulePermissionDto extends BaseCreateDto {
    @IsNotEmpty()
    moduleName: ModuleNames;
    @IsBoolean()
    fullAccess: boolean;
    @IsBoolean()
    canShare: boolean;
    @IsBoolean()
    canExport: boolean;
    @IsBoolean()
    canCreate: boolean;
    @IsBoolean()
    canDelete: boolean;
    @IsBoolean()
    canView: boolean;
    @IsBoolean()
    canEdit: boolean;
    @IsBoolean()
    canView: boolean;
    @IsArray()
    morePermissions?: MorePermission[] | [];
  }

  export class CreateRolePermissionDto extends BaseCreateDto {
    @IsNotEmpty()
    roleId: string;
    @IsNotEmpty()
    permissionGroupId: string;
  }

  export class UpdateRolePermissionDto extends BaseCreateDto {
    @IsNotEmpty()
    roleId: string;
    @IsNotEmpty()
    permissionGroupId: string;
  }



export class CreatePermissionDto extends BaseCreateDto {
  @IsNotEmpty()
  @IsLowercase()
  permissionGroupName: string;
  @IsNotEmpty()
  permissionGroupDisplayName?: string | "";

  @IsEnum(permissionGroupStatus)
  @IsNotEmpty()
  status: permissionGroupStatus | permissionGroupStatus.ACTIVE;
  @IsBoolean()
  isDefault?: boolean;
  permissionGroupDescription?: string | "";
  @IsEmpty()
  permissions?: Permission[] | [];
}

export class UpdatePermissionDto extends BaseUpdateDto {
    @IsEmpty()
    permissionGroupName: string;
    permissionGroupDisplayName?: string | "";
    status: permissionGroupStatus | permissionGroupStatus.ACTIVE;
    @IsBoolean()
    isDefault?: boolean;
    @IsEmpty()
    permissions?: Permission[] | [];
    permissionGroupDescription?: string | "";
  }


