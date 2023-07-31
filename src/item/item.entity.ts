// nestjs typeorm mongoose box items entity with neccesary fields for database related operations


import { Entity, ObjectIdColumn, Column, ManyToOne, JoinColumn, ObjectID } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';

@Entity()
export class Item extends OrganizationModel{

    //  All required fields for supply chain inventory item
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    sku: string;

    @ApiModelProperty()
    @Column()
    name: string;

    @ApiModelProperty()
    @Column()
    productId: string;

    @ApiModelProperty()
    @Column()
    productVariant: string;

    @ApiModelProperty()
    @Column()
    quantity: number;

    @ApiModelProperty()
    @Column()
    uom: string;

    @ApiModelProperty()
    @Column()
    status: string;

    @ApiModelProperty()
    @Column()
    price: number;

    @ApiModelProperty()
    @Column()
    totalPrice: number;

    @ApiModelProperty()
    @Column()
    currency: string; 

}

