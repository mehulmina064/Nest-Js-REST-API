// shipment box entity with all necessary fields with swagger annotations which are used for swagger documentation with items


import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';


@Entity('shipment_box')
export class ShipmentBox {

    @ApiModelProperty({ description: 'Primary key of shipment box' })
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty({ description: 'Box id' })
    @Column({ name: 'box_id' })
    boxId: number;

    @ApiModelProperty({ description: 'Box name' })
    @Column({ name: 'box_name' })
    boxName: string;

    @ApiModelProperty({ description: 'Box weight' })
    @Column({ name: 'box_weight' })
    boxWeight: number;

    @ApiModelProperty({ description: 'Box volume' })
    @Column({ name: 'box_volume' })
    boxVolume: number;

    @ApiModelProperty({ description: 'Box length' })
    @Column({ name: 'box_length' })
    boxLength: number;

    @ApiModelProperty({ description: 'Box width' })
    @Column({ name: 'box_width' })
    boxWidth: number;

    @ApiModelProperty({ description: 'Box height' })
    @Column({ name: 'box_height' })
    boxHeight: number;

    @ApiModelProperty({ description: 'Box weight unit' })
    @Column({ name: 'box_weight_unit' })
    boxWeightUnit: string;

    @ApiModelProperty({ description: 'Box volume unit' })
    @Column({ name: 'box_volume_unit' })
    boxVolumeUnit: string;

    @ApiModelProperty({ description: 'Box length unit' })
    @Column({ name: 'box_length_unit' })
    boxLengthUnit: string;

    @ApiModelProperty({ description: 'Box width unit' })
    @Column({ name: 'box_width_unit' })
    boxWidthUnit: string;

    @ApiModelProperty({ description: 'Box height unit' })
    @Column({ name: 'box_height_unit' })
    boxHeightUnit: string;

    @ApiModelProperty({ description: 'Box description' })
    @Column({ name: 'box_description' })
    boxDescription: string;

    @ApiModelProperty({ description: 'Box type' })
    @Column({ name: 'box_type' })
    boxType: string;

    @ApiModelProperty({ description: 'Box type description' })
    @Column({ name: 'box_type_description' })
    boxTypeDescription: string;

    @ApiModelProperty({ description: 'Box type code' })
    @Column({ name: 'box_type_code' })
    boxTypeCode: string;

    @ApiModelProperty({ description: 'Box type code description' })
    @Column({ name: 'box_type_code_description' })
    boxTypeCodeDescription: string;

    @ApiModelPropertyOptional({ description: 'Items' })
    @Column({ name: 'items' })
    items: [];


    
}