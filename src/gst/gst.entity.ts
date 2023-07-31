// Create GST Entity

import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';


@Entity('gst')
export class Gst {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    hsnCode: string;

    @ApiModelProperty()
    @Column()
    hsnCode4Digit: string;

    @ApiModelProperty()
    @Column()
    nameOfCommodity: string;

    @ApiModelProperty()
    @Column()
    gstRate: number;

    @ApiModelProperty()
    @Column()
    schedule: string;

    @ApiModelProperty()
    @Column()
    chapterNo: string;

    @ApiModelProperty()
    @Column()
    gstType: string;

    @ApiModelProperty()
    @Column()
    gstApplicable: string;

    @ApiModelProperty()
    @Column()
    gstApplicableOn: string;

    
}