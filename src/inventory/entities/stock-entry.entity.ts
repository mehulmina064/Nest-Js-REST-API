import { ApiModelProperty } from "@nestjs/swagger";
import { OrganizationModel } from "../../common/org-model.entity";
import { Column, Entity,ObjectID,ObjectIdColumn } from "typeorm";

@Entity('StockEntry')
export class StockEntry extends OrganizationModel {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    // Fields for StockEntry
    @ApiModelProperty()
    @Column()
    inventory_id: string;

    @ApiModelProperty()
    @Column()
    item_id: string;

    @ApiModelProperty()
    @Column()
    warehouse_id: string;

    @ApiModelProperty()
    @Column()
    bin_id: string;

    @ApiModelProperty()
    @Column()
    lot_id: string;

    @ApiModelProperty()
    @Column()
    product_id: string;

    @ApiModelProperty()
    @Column()
    entry_type: string;

    @ApiModelProperty()
    @Column()
    entry_date: Date;

    @ApiModelProperty()
    @Column()
    entry_by: string;

    @ApiModelProperty()
    @Column()
    qty: number;

    @ApiModelProperty()
    @Column()
    uom: string;

    @ApiModelProperty()
    @Column()
    remarks: string;

    

    }
