import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';



export enum teamStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }

// export enum accessType {
//     ALL = 'ALL',
//     USER = 'USER',
//     DELETED = 'DELETED',
//   }

@Entity('InternalTeam')
export class internalTeam extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    teamName?: string | "";

    @ApiModelProperty()
    @Column()
    teamDisplayName?: string | "";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: teamStatus,
        default: teamStatus.ACTIVE,
    })
    status: teamStatus | undefined;

    @ApiModelProperty()
    @Column()
    isDefault?: boolean | false;
    

    @ApiModelProperty()
    @Column()
    teamDescription?: string | "";


}
