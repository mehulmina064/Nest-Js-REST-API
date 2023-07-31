import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ShipmentBoxDto } from '../shipmentBox/shipmentBox.dto';
//shipment entity with all necessary fields with Api properties
@Entity('shipments')
export class Shipment {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    name: string;

    @ApiModelProperty()
    @Column()
    description: string;

    @ApiModelProperty()
    @Column()
    price: number;

    @ApiModelProperty()
    @Column()
    weight: number;

    @ApiModelProperty()
    @Column()
    length: number;

    @ApiModelProperty()
    @Column()
    width: number;

    @ApiModelProperty()
    @Column()
    height: number;

    @ApiModelProperty()
    @Column()
    image: string;

    @ApiModelProperty()
    @Column()
    quantity: number;

    @ApiModelProperty()
    @Column()
    category: string;

    @ApiModelProperty()
    @Column()
    subcategory: string;

    @ApiModelProperty()
    @Column()
    isActive: boolean;

    @ApiModelProperty()
    @Column()
    isDeleted: boolean;

    @ApiModelProperty()
    @Column()
    createdAt: Date;

 // embeded mongo typeorm field
    @ApiModelProperty()
    @Column()
    shipmentBox: ShipmentBoxDto[];

    @ApiModelProperty()
    @Column()
    orderId: string;


    
}
    //end of shipment entity