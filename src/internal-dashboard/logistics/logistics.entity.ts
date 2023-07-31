import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';



export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }



@Entity('Logistics')
export class logistics extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    displayName?: string | "";

    @ApiModelProperty()
    @Column()
    apiUrl?: string | "";

    @ApiModelProperty()
    @Column()
    trackingUrl?: string | "";

    @ApiModelProperty()
    @Column()
    rating?: Number | 0;

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status | undefined;



    @ApiModelProperty()
    @Column()
    description?: string | "";

    

    //add created by updated by and also edited by

}
