import { ApiModelProperty } from "@nestjs/swagger";
import { OrganizationModel } from "../../common/org-model.entity";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity("Inventory")
export class Inventory extends OrganizationModel {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
    // Required Fields for Item Inventory
    @ApiModelProperty()
    @Column()
    item_id: string;

    @ApiModelProperty()
    @Column()
    warehouse_id: string;

    @ApiModelProperty()
    @Column()
    item_uom: string;

    @ApiModelProperty()
    @Column()
    current_qty: number;

    @ApiModelProperty()
    @Column()
    recomended_qty: number;

    @ApiModelProperty()
    @Column()
    item_status: string;

    @ApiModelProperty()
    @Column()
    last_uploaded_date: Date;

}

