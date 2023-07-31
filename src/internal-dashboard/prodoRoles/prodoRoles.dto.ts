import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';


import { IsBoolean, IsNotEmpty,IsEmpty, IsLowercase, IsEnum } from 'class-validator';

export enum roleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}
export class CreateRoleDto extends BaseCreateDto {
  @IsNotEmpty()
  @IsLowercase()
  roleName: string;
  @IsNotEmpty()
  roleDisplayName?: string | "";

  @IsEnum(roleStatus)
  @IsNotEmpty()
  status: roleStatus |roleStatus.ACTIVE;
  @IsBoolean()
  isDefault?: boolean;
  roleDescription?: string | "";
}

export class UpdateRoleDto extends BaseUpdateDto {
    @IsEmpty()
    roleName: string;
    roleDisplayName?: string | "";
    status: roleStatus |roleStatus.ACTIVE;
    @IsBoolean()
    isDefault?: boolean;
    roleDescription?: string | "";
  }
  

  export class CreateUserRoleDto extends BaseCreateDto {
    @IsNotEmpty()
    roleId: string;
    @IsNotEmpty()
    userId: string;
  }

  export class UpdateUserRoleDto extends BaseUpdateDto {
    @IsNotEmpty()
    roleId: string;
    @IsNotEmpty()
    userId: string;
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

  


