import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('PurchaseOrder')
export class zohoPurchaseOrder extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    organization_id?: string | "";

    @ApiModelProperty()
    @Column()
    description?: string | "";
  
    @Unique(['purchaseorder_id'])
    @ApiModelProperty()
    @Column()
    purchaseorder_id?: string | "";

    @ApiModelProperty()
    @Column()
    branch_id?: string | "";

    @ApiModelProperty()
    @Column()
    branch_name?: string | "";

    @ApiModelProperty()
    @Column()
    documents? : [] | [];

    @ApiModelProperty()
    @Column()
    tax_treatment?: string | "";

    @ApiModelProperty()
    @Column()
    gst_no?: string | "";

    @ApiModelProperty()
    @Column()
    contact_category?: string | "";

    @ApiModelProperty()
    @Column()
    gst_treatment?: string | "";

    @ApiModelProperty()
    @Column()
    purchaseorder_number?: string | "";

    @ApiModelProperty()
    @Column()
    date?: string | "";

    @ApiModelProperty()
    @Column()
    client_viewed_time?: string | "";

    @ApiModelProperty()
    @Column()
    is_viewed_by_client?: string | "";

    @ApiModelProperty()
    @Column()
    dueInDays?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_pre_gst?: boolean | false;

    @ApiModelProperty()
    @Column()
    expected_delivery_date?: string | "";

    @ApiModelProperty()
    @Column()
    reference_number?: string | "";

    @ApiModelProperty()
    @Column()
    status?: string | "";

    @ApiModelProperty()
    @Column()
    order_status?: string | "";

    @ApiModelProperty()
    @Column()
    received_status?: string | "";

    @ApiModelProperty()
    @Column()
    billed_status?: string | "";

    @ApiModelProperty()
    @Column()
    color_code?: string | "";

    @ApiModelProperty()
    @Column()
    current_sub_status_id?: string | "";

    @ApiModelProperty()
    @Column()
    current_sub_status?: string | "";

    @ApiModelProperty()
    @Column()
    sub_statuses?: [] | [];
    
    @ApiModelProperty()
    @Column()
    source_of_supply?: string | "";

    @ApiModelProperty()
    @Column()
    destination_of_supply?: string | "";

    @ApiModelProperty()
    @Column()
    vendor_id?: string | "";

    @ApiModelProperty()
    @Column()
    vendor_name?: string | "";


    @ApiModelProperty()
    @Column()
    contact_persons?: string[]|[];

    @ApiModelProperty()
    @Column()
    currency_id?: string|"";

    @ApiModelProperty()
    @Column()
    currency_code?: string | "";

    @ApiModelProperty()
    @Column()
    currency_symbol? : string | "";


    @ApiModelProperty()
    @Column()
    exchange_rate?: number | 0;

    @ApiModelProperty()
    @Column()
    delivery_date?: string |""; 


    @ApiModelProperty()
    @Column()
    is_emailed?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_drop_shipment?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_inclusive_tax?: boolean | false;

    @ApiModelProperty()
    @Column()
    tax_rounding?: string |""; 

    @ApiModelProperty()
    @Column()
    is_reverse_charge_applied?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_adv_tracking_in_receive?: boolean | false;

    @ApiModelProperty()
    @Column()
    salesorder_id?: string |""; 

    @ApiModelProperty()
    @Column()
    is_backorder?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_po_marked_as_received?: boolean | false;

    @ApiModelProperty()
    @Column()
    total_quantity?: number | 0;
    
    @ApiModelProperty()
    @Column()
    line_items?: [] | [];

    @ApiModelProperty()
    @Column()
    has_qty_cancelled?: boolean | false;

    @ApiModelProperty()
    @Column()
    adjustment?: number | 0;

    @ApiModelProperty()
    @Column()
    adjustment_description?: string |""; 

    @ApiModelProperty()
    @Column()
    discount_amount?: number | 0;

    @ApiModelProperty()
    @Column()
    discount?: number | 0;

    @ApiModelProperty()
    @Column()
    discount_applied_on_amount?: number | 0;

    @ApiModelProperty()
    @Column()
    is_discount_before_tax?: boolean | false;

    @ApiModelProperty()
    @Column()
    discount_account_id?: string |""; 

    @ApiModelProperty()
    @Column()
    discount_type?: string |""; 

    @ApiModelProperty()
    @Column()
    sub_total?: number | 0;

    @ApiModelProperty()
    @Column()
    sub_total_inclusive_of_tax?: number | 0;

    @ApiModelProperty()
    @Column()
    tax_total?: number | 0;

    @ApiModelProperty()
    @Column()
    total?: number | 0;

    @ApiModelProperty()
    @Column()
    taxes?: [] | [];

    @ApiModelProperty()
    @Column()
    tax_override?: boolean | false;

    @ApiModelProperty()
    @Column()
    price_precision?: number | 0;

    @ApiModelProperty()
    @Column()
    submitted_date?: string |""; 

    @ApiModelProperty()
    @Column()
    submitted_by?: string |""; 

    @ApiModelProperty()
    @Column()
    submitter_id?: string |""; 

    @ApiModelProperty()
    @Column()
    approver_id?: string |""; 

    @ApiModelProperty()
    @Column()
    approvers_list?: [] | [];

    @ApiModelProperty()
    @Column()
    billing_address_id?: string |""; 

    @ApiModelProperty()
    @Column()
    billing_address?: {}|{}; 

    @ApiModelProperty()
    @Column()
    notes?: string |""; 

    @ApiModelProperty()
    @Column()
    terms?: string |""; 

    @ApiModelProperty()
    @Column()
    payment_terms?: number | 0;

    @ApiModelProperty()
    @Column()
    payment_terms_label?: string |""; 

    @ApiModelProperty()
    @Column()
    ship_via?: string |""; 

    @ApiModelProperty()
    @Column()
    ship_via_id?: string |""; 

    @ApiModelProperty()
    @Column()
    attention?: string |""; 

    @ApiModelProperty()
    @Column()
    delivery_org_address_id?: string |""; 

    @ApiModelProperty()
    @Column()
    delivery_customer_id?: string |""; 

    @ApiModelProperty()
    @Column()
    delivery_customer_address_id?: string |""; 

    @ApiModelProperty()
    @Column()
    delivery_customer_name?: string |""; 
    
    @ApiModelProperty()
    @Column()
    delivery_address?: {}|{}; 

    @ApiModelProperty()
    @Column()
    custom_fields?: [] | [];

    @ApiModelProperty()
    @Column()
    custom_field_hash?: {}|{}; 

    @ApiModelProperty()
    @Column()
    attachment_name?: string |""; 

    @ApiModelProperty()
    @Column()
    can_send_in_mail?: boolean | false;

    @ApiModelProperty()
    @Column()
    template_id?: string |""; 

    @ApiModelProperty()
    @Column()
    template_name?: string |""; 

    @ApiModelProperty()
    @Column()
    page_width?: string |""; 

    @ApiModelProperty()
    @Column()
    page_height?: string |""; 

    @ApiModelProperty()
    @Column()
    orientation?: string |""; 

    @ApiModelProperty()
    @Column()
    template_type?: string |""; 

    @ApiModelProperty()
    @Column()
    created_time?: string |""; 

    @ApiModelProperty()
    @Column()
    created_by_id?: string |""; 

    @ApiModelProperty()
    @Column()
    last_modified_time?: string |""; 

    @ApiModelProperty()
    @Column()
    can_mark_as_bill?: boolean | false;

    @ApiModelProperty()
    @Column()
    can_mark_as_unbill?: boolean | false;

    @ApiModelProperty()
    @Column()
    purchasereceives?: [] | [];

    @ApiModelProperty()
    @Column()
    salesorders?: [] | [];

    @ApiModelProperty()
    @Column()
    bills?: [] | [];

}
