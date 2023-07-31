import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('dashboardData')
export class  dashboardData extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
  
    @ApiModelProperty()
    @Column()
    userId: string;
  
    @ApiModelProperty()
    @Column()
    data : {} = {
        orders : {
            total : 0,
            completed : 0,
            inProgress : 0,
            submitted:0,
            cancelled : 0
        },
        rfq : {
            approved : 0,
            rejected : 0,
            inProgress : 0,
            total_submitted:0,
        },
        payments : {
            total : 0,
            paid : 0,
            due : 0,

        },
        pieChart : [],
        barChart : []
    }

}
