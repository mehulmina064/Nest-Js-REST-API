import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('salesOrderReview')
export class  salesOrderReview extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
  
    @ApiModelProperty()
    @Column()
    userId: string;

    @ApiModelProperty()
    @Column()
    zohoId: string;

    @ApiModelProperty()
    @Column()
    prodoId: string;
    
    @ApiModelProperty()
    @Column()
    packageId: string;


    @ApiModelProperty()
    @Column()
    rating: number;

    @ApiModelProperty()
    @Column()
    comment: string;

}
