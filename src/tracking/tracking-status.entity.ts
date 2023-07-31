import { OrganizationModel } from './../common/org-model.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('TrackingStatus')
export class TrackingStatusEntity {
    @ApiModelProperty()
    @ObjectIdColumn()
    id:ObjectID;

    @ApiModelProperty()
    @Column()
    status:string;

    @ApiModelProperty()
    @Column()
    location:string;

    @ApiModelProperty()
    @Column()
    datetime:Date;

    @ApiModelProperty()
    @Column()
    createdBy:string;

    @ApiModelProperty()
    @Column()
    createdOn:Date;

}
