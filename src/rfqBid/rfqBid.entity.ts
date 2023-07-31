import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';



@Entity('rfqBid')
export class rfqBid extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
  
    @ApiModelProperty()
    @Column()
    manufactureEmail: string | undefined;

    @ApiModelProperty()
    @Column()
    lineItems: [] = [];

    @ApiModelProperty()
    @Column()
    manufacturePhone: string | undefined; 

    @ApiModelProperty()
    @Column()
    manufactureGstNo: string | undefined;
    
    @ApiModelProperty()
    @Column()
    rfqBidComment: string | undefined;

    @ApiModelProperty()
    @Column()
    rfqBidNo: number | undefined;

    @ApiModelProperty()
    @Column()
    rfqId: string | undefined;


}
