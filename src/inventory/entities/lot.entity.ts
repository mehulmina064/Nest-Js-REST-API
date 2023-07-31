import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../../common/org-model.entity';
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity("lot")
export class Lot extends OrganizationModel {
    // required fields for StockLot
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    lot_no: string;

    @ApiModelProperty()
    @Column()
    product_id: string;

    @ApiModelProperty()
    @Column()
    product_name: string;

    @ApiModelProperty()
    @Column()
    product_code: string;

    @ApiModelProperty()
    @Column()
    product_uom: string;

    @ApiModelProperty()
    @Column()
    inventories : string[];

}