import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';
import { ModuleNames } from './moduleNames.constant';



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


@Entity('ProdoPermissionGroup')
export class prodoPermissionGroup extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    permissionGroupName?: string | "";

    @ApiModelProperty()
    @Column()
    permissionGroupDisplayName?: string | "";

    @ApiModelProperty()
    @Column({
        default:'ALL'
    })
    accessType?: string | "ALL";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: permissionGroupStatus,
        default: permissionGroupStatus.ACTIVE,
    })
    status: permissionGroupStatus | undefined;

    @ApiModelProperty()
    @Column()
    isDefault?: boolean | false;
    
    @ApiModelProperty()
    @Column()
    permissionGroupDescription?: string | "";


    @ApiModelProperty()
    @Column()
    permissions?: Permission[] | [];

    //add created by updated by and also edited by


}
