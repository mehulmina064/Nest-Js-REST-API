import { OrganizationModel } from '../common/org-model.entity';
//Client Name	Particulars	Purchase Order	PO Date	Category of Products	PO Month	PO Amount	Fulfillment Month	Invoice Amount (ex GST)	COGS	Gross Profit	Status

import { ApiModelProperty } from "@nestjs/swagger";
import { Column, Entity, ObjectIdColumn , ObjectID} from "typeorm";
@Entity("ClientData")
export class ClientData extends OrganizationModel {

    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    client_name!: string;

    @ApiModelProperty()
    @Column()
    particulars!: string;

    @ApiModelProperty()
    @Column()
    purchase_order!: string;

    @ApiModelProperty()
    @Column()
    po_date!: Date;

    @ApiModelProperty()
    @Column()
    category_of_products!: string;

    @ApiModelProperty()
    @Column()
    po_month!: Date;

    @ApiModelProperty()
    @Column()
    po_amount!: number;

    @ApiModelProperty()
    @Column()
    fulfillment_month!: Date;

    @ApiModelProperty()
    @Column()
    invoice_amount_ex_gst: number;

    @ApiModelProperty()
    @Column()
    invoice_amount_inc_gst: number;

    @ApiModelProperty()
    @Column()
    cogs!: number;

    @ApiModelProperty()
    @Column()
    gross_profit!: number;

    @ApiModelProperty()
    @Column()
    status!: string;

    @ApiModelProperty()
    @Column()
    attached_files: AttachedFile[];

    @ApiModelProperty()
    @Column()
    amount_received: number;

    @ApiModelProperty()
    @Column()
    due_amount: number;

    @ApiModelProperty()
    @Column()
    due_date_of_receivable_from_client: Date;

    @ApiModelProperty()
    @Column()
    line_items:[];
}

export class AttachedFile {
    document_name!: string;
    file_name!: string;
    file_path!: string;
    file_type!: string;
}