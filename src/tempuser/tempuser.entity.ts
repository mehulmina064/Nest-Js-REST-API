import { UserRole } from '../users/roles.constants';

import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {UserType,UserStatus} from '../users/user.entity'
@Entity('UserInvitationRepository')
export class Tempuser {


    @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    name : string | undefined;

    @ApiModelProperty()
    @Column()
    territory_id : string | undefined;

    @ApiModelProperty()
    @Column()
  permissions?: [] = [];
    

    @ApiModelProperty()
    @Column()
    teams?: [] = [];

    @ApiModelProperty()
    @Column()
    orgRole : string | undefined;

    @ApiModelProperty()
    @Column()
    orgIds?: [] = [];

    @ApiModelProperty()
    @Column()
    orgIdRoles ?: [] = [];

    @ApiModelProperty()
    @Column()
    companyIds ?: [] = [];


    @ApiModelProperty()
    @Column()
    companyRole : string | undefined;

    @ApiModelProperty()
    @Column()
    companyIdRoles ?: [] = [];

    @ApiModelProperty()
    @Column()
    entityId : string | undefined;

    @ApiModelProperty()
    @Column()
    companyId : string | undefined;

    @ApiModelProperty()
    @Column()
    accountId: string | undefined;

    @ApiModelProperty()
    @Column()
    isVerified : string | undefined;

    @ApiModelProperty()
    @Column()
    contactNumber : string | undefined;

    @ApiModelProperty()
    @Column()
    password : string | undefined;

    @ApiModelProperty()
    @Column()
    email : string | undefined;

    @ApiModelProperty()
    @Column()
    lastName : string | undefined;

    @ApiModelProperty()
    @Column()
    firstName : string | undefined;

    @ApiModelProperty()
    @Column()
    updatedAt : string | undefined;

    @ApiModelProperty()
    @Column()
    createdAt : string | undefined;

    @ApiModelProperty()
    @Column()
    entityIdRoles?: [] = [];

    @ApiModelProperty()
    @Column()
    entityIds?: [] = [];

    @ApiModelProperty()
    @Column()
    entityRole : string | undefined;

    @ApiModelProperty()
    @Column()
    orgId : string | undefined;

    @ApiModelProperty()
    @Column({
      type: 'enum',
      enum: UserRole,
      default: [UserRole.USER, UserRole.CLIENT],
    })
    roles!: UserRole[];

    @ApiModelProperty()
  @Column({
      type: 'enum',
      enum: UserType,
      default: UserType.PRODO,
  })
  userType: UserType | undefined;

  @ApiModelProperty()
  @Column({
      type: 'enum',
      enum: UserStatus,
      default: UserStatus.INACTIVE,
  })
  status: UserStatus | undefined;

  @ApiModelProperty()
  @Column()
  userId : string | undefined;

  @ApiModelProperty()
  @Column()
  sentByid : string | undefined;

  @ApiModelProperty()
  @Column()
  inviteType : string | undefined;

}
