import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('ProductRating')
export class ProductRating extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
  
    @ApiModelProperty()
    @Column()
    zohoId: string;
  
    @ApiModelProperty()
    @Column()
    prodoId: string;

    @ApiModelProperty()
    @Column()
    oneStar: number;

    @ApiModelProperty()
    @Column()
    twoStar: number;

    @ApiModelProperty()
    @Column()
    threeStar: number;

    @ApiModelProperty()
    @Column()
    fourStar: number;

    @ApiModelProperty()
    @Column()
    fiveStar: number;

}
