import { StockInventoryStatus } from './../inventory/types';
// Model for managing territories get schema from https://schema.org/


import { Entity, Column, ObjectIdColumn, ManyToOne, JoinColumn, ObjectID } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';


@Entity('territories')
export class Territory extends OrganizationModel{

    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    name: string;

    @ApiModelProperty()
    @Column()
    code: string;

    @ApiModelProperty()
    @Column()
    type:string

    @ApiModelProperty()
    @Column()
    parent: string;

    @ApiModelProperty()
    @Column()
    level: number; 

    @ApiModelProperty()
    @Column()
    group_name: string;

    @ApiModelProperty()
    @Column()
    address_id: string;
}

