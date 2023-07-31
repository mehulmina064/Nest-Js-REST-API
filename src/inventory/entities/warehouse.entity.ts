// Create Nest Js Entity for Warehouse

import { ApiModelProperty } from "@nestjs/swagger";
import { OrganizationModel } from "../../common/org-model.entity";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";


@Entity("warehouses")
export class Warehouse extends OrganizationModel {
    
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
        address_id: string;

        @ApiModelProperty()
        @Column()
        hub_id: string;

        @ApiModelProperty()
        @Column()
        warehouse_type: string;

        @ApiModelProperty()
        @Column()
        warehouse_status: string;

        @ApiModelProperty()
        @Column()
        warehouse_location: string;

        @ApiModelProperty()
        @Column()
        warehouse_capacity: number;

        @ApiModelProperty()
        @Column()
        warehouse_measurements: {}
}