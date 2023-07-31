import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';



export enum roleStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }

// export enum accessType {
//     ALL = 'ALL',
//     USER = 'USER',
//     DELETED = 'DELETED',
//   }

@Entity('ProdoRoles')
export class prodoRoles extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    roleName?: string | "";

    @ApiModelProperty()
    @Column()
    roleDisplayName?: string | "";

    // @ApiModelProperty()
    // @Column({
    //     default:'ALL'
    // })
    // accessType?: string | "ALL";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: roleStatus,
        default: roleStatus.ACTIVE,
    })
    status: roleStatus | undefined;

    @ApiModelProperty()
    @Column()
    isDefault?: boolean | false;
    

    @ApiModelProperty()
    @Column()
    roleDescription?: string | "";

    // @ApiModelProperty()
    // @Column()
    // permissionGroups?: [] | [];//{id: string,name: string}

    //add created by updated by and also edited by

}
