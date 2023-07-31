import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('SalesOrder')
export class zohoSalesOrder extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    organization_id?: string | "";

    @ApiModelProperty()
    @Column()
    description?: string | "";
  
    @Unique(['salesorderId'])
    @ApiModelProperty()
    @Column()
    salesorderId?: string | "";

    @ApiModelProperty()
    @Column()
    line_items?: [] | [];

    @ApiModelProperty()
    @Column()
    customerName?: string | "";

    @ApiModelProperty()
    @Column()
    referenceNumber?: string | "";

    @ApiModelProperty()
    @Column()
    customerId?: string | "";

    @ApiModelProperty()
    @Column()
    companyName?: string | "";

    @ApiModelProperty()
    @Column()
    currentSubStatus?: string | "";

    @ApiModelProperty()
    @Column()
    salesorderNumber?: string | "";

    @ApiModelProperty()
    @Column()
    date?: string | "";

    @ApiModelProperty()
    @Column()
    shipmentDate?: string | "";

    @ApiModelProperty()
    @Column()
    shipmentDays?: string | "";

    @ApiModelProperty()
    @Column()
    dueByDays?: string | "";

    @ApiModelProperty()
    @Column()
    dueInDays?: string | "";

    @ApiModelProperty()
    @Column()
    source?: string | "";

    @ApiModelProperty()
    @Column()
    total?: Number | "";

    @ApiModelProperty()
    @Column()
    quantity?: Number | "";

    @ApiModelProperty()
    @Column()
    quantityInvoiced?: Number | "";

    @ApiModelProperty()
    @Column()
    quantityPacked?: Number | "";

    @ApiModelProperty()
    @Column()
    quantityShipped?: Number | "";

    @ApiModelProperty()
    @Column()
    orderStatus?: string | "";

    @ApiModelProperty()
    @Column()
    invoicedStatus?: string | "";

    @ApiModelProperty()
    @Column()
    paidStatus?: string | "";

    @ApiModelProperty()
    @Column()
    shippedStatus?: string | "";

    @ApiModelProperty()
    @Column()
    status?: string | "";
    
    @ApiModelProperty()
    @Column()
    salesChannel?: string | "";

    @ApiModelProperty()
    @Column()
    salespersonName?: string | "";

    @ApiModelProperty()
    @Column()
    branchId?: string | "";

    @ApiModelProperty()
    @Column()
    hasAttachment?: boolean | false;


    @ApiModelProperty()
    @Column()
    clientPoAttachment?: [];

    @ApiModelProperty()
    @Column()
    clientPersonOfContacts?: string[]|[];

    @ApiModelProperty()
    @Column()
    balance?: Number | 0;

    @ApiModelProperty()
    @Column()
    subStatuses? : [] | [];


    @ApiModelProperty()
    @Column()
    companyId?: string | "";

    @ApiModelProperty()
    @Column()
    entityId?: string |""; 


    @ApiModelProperty()
    @Column()
    orderDetails: {} = {};

}
