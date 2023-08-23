import { BaseAppEntity } from './../common/common.entity';
import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {OrganizationModel} from './../common/org-model.entity';
import { UserRole } from './roles.constants';
import { AccessControl } from 'role-acl';
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}
export enum UserType {
  BEASTAB = 'BEASTAB',
  ZOHO = 'ZOHO'
}

@Entity('users')
export class User extends OrganizationModel {
 
  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @ApiModelProperty()
  @Column()
  firstName: string | undefined;

  @ApiModelProperty()
  @Column()
  lastName: string | undefined;

  @ApiModelProperty()
  @Column()
  profilePicture: string | undefined;

  // User Role

  @ApiModelProperty()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: [UserRole.USER, UserRole.CLIENT],
  })
  roles!: UserRole[];

  @ApiModelProperty()
  @Column()
  designation: string | undefined;

  @ApiModelProperty()
  @Column()
  companyName: string | undefined;

  @Unique(['email'])
  @ApiModelProperty()
  @Column()
  email: string | undefined;

  @ApiModelProperty()
  @Column()
  password: string | any;

  @ApiModelProperty()
  @Column()
  contactNumber: string | undefined;

  @ApiModelProperty()
  @Column()
  otp: string | undefined;

  @ApiModelPropertyOptional()
  @Column()
  gstin?: string;

  @ApiModelPropertyOptional()
  @Column()
  businessEntityName?: string;

  @ApiModelPropertyOptional()
  @Column()
  businessContactNumber?: string;

  @ApiModelPropertyOptional()
  @Column()
  businessRegisteredAddress?: string;

  @ApiModelPropertyOptional()
  @Column()
  businessCity?: string;

  @ApiModelPropertyOptional()
  @Column()
  businessState?: string;

  @ApiModelPropertyOptional()
  @Column()
  businessPinCode?: string;

  @ApiModelPropertyOptional()
  @Column()
  isActive?: boolean;

  @ApiModelPropertyOptional()
  @Column()
  isVerified?: boolean;

  @ApiModelProperty()
  @Column({
      type: 'enum',
      enum: UserStatus,
      default: UserStatus.ACTIVE,
  })
  status: UserStatus | undefined;

  @ApiModelProperty()
  @Column({
      type: 'enum',
      enum: UserType,
      default: UserType.BEASTAB,
  })
  userType: UserType | undefined;

  @ApiModelPropertyOptional()
  @Column()
  accountId: ObjectID | undefined;

  @ApiModelProperty()
  @Column()
  permissions?: [] = [];

  @ApiModelPropertyOptional()
  @Column()
  teams?: string[] = [];

  @ApiModelPropertyOptional()
  @Column()
  orgRole?: string = "";

  @ApiModelProperty()
  @Column()
  orgIds?: string[] =[];

  @ApiModelPropertyOptional()
  @Column()
  orgIdRoles?: [] = [];

  @ApiModelProperty()
  @Column()
  companyId?: string | "";

  @ApiModelProperty()
  @Column()
  companyIds?: string[] =[];

  @ApiModelPropertyOptional()
  @Column()
  companyRole?: string = "";

  @ApiModelProperty()
  @Column()
  companyIdRoles?:  [] = [];

  @ApiModelProperty()
  @Column()
  entityId?: string |""; 

  @ApiModelPropertyOptional()
  @Column()
  entityRole?: string = "";

  @ApiModelProperty()
  @Column()
  entityIds?: string[] =[];

  @ApiModelProperty()
  @Column()
  entityIdRoles?: [] = [];

  @ApiModelProperty()
  @Column()
  lastLoginAt?: Date;

}
