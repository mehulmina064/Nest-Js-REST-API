import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TrackingStatusEntity } from './tracking-status.entity';

@Entity('Tracking')
export class Tracking {
    //all required fields for shipment tracking
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    trackingNumber: string | undefined;

    @ApiModelProperty()
    @Column()
    trackingStatus: TrackingStatusEntity[] | undefined;

    @ApiModelProperty()
    @Column()
    shipment_id: string | undefined;

}
