import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('ZohoBill')
export class zohoBill extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    organization_id?: string | "";  //map by customer id org

    @ApiModelProperty()
    @Column()
    description?: string | "";
  
    @Unique(['bill_id'])
    @ApiModelProperty()
    @Column()
    bill_id?: string | "";

    @ApiModelProperty()
    @Column()
    branch_id?: string | "";

    @ApiModelProperty()
    @Column()
    branch_name?: string | "";

    @ApiModelProperty()
    @Column()
    purchaseorder_ids? : [] | [];

    @ApiModelProperty()
    @Column()
    vendor_id?: string | "";

    @ApiModelProperty()
    @Column()
    vendor_name?: string | "";

    @ApiModelProperty()
    @Column()
    source_of_supply?: string | "";  

    @ApiModelProperty()
    @Column()
    destination_of_supply?: string | "";

    @ApiModelProperty()
    @Column()
    gst_no?: string | "";

    @ApiModelProperty()
    @Column()
    reference_invoice_type?: string | "";

    @ApiModelProperty()
    @Column()
    contact_category?: any | {};

    @ApiModelProperty()
    @Column()
    gst_treatment?: string | "";

    @ApiModelProperty()
    @Column()
    tax_treatment?: string | "";

    @ApiModelProperty()
    @Column()
    gst_return_details?: any | {};

    @ApiModelProperty()
    @Column()
    invoice_conversion_type?: string | "";

    @ApiModelProperty()
    @Column()
    unused_credits_payable_amount?: Number | 0;

    @ApiModelProperty()
    @Column()
    status?: string | "";

    @ApiModelProperty()
    @Column()
    color_code? : string | "";

    @ApiModelProperty()
    @Column()
    current_sub_status_id? : string | "";

    @ApiModelProperty()
    @Column()
    current_sub_status?: string | "";

    @ApiModelProperty()
    @Column()
    sub_statuses? : [] | [];

    @ApiModelProperty()
    @Column()
    bill_number?: string | "";

    @ApiModelProperty()
    @Column()
    date?: string | "";

    @ApiModelProperty()
    @Column()
    is_pre_gst?: boolean | false;

    @ApiModelProperty()
    @Column()
    due_date?: string | "";

    @ApiModelProperty()
    @Column()
    discount_setting?: string | "";

    @ApiModelProperty()
    @Column()
    is_tds_amount_in_percent?: boolean | false;

    @ApiModelProperty()
    @Column()
    tds_percent?: string | "";

    @ApiModelProperty()
    @Column()
    tds_amount?: Number | 0;

    @ApiModelProperty()
    @Column()
    tax_account_id?: string | "";

    @ApiModelProperty()
    @Column()
    payment_terms?: Number| 0;

    @ApiModelProperty()
    @Column()
    payment_terms_label?: string | "";

    @ApiModelProperty()
    @Column()
    payment_expected_date?: string | "";

    @ApiModelProperty()
    @Column()
    reference_number?: string | "";

    @ApiModelProperty()
    @Column()
    recurring_bill_id?: string | "";

    @ApiModelProperty()
    @Column()
    due_by_days?: Number | 0;

    @ApiModelProperty()
    @Column()
    due_in_days?: string | "";

    @ApiModelProperty()
    @Column()
    currency_id?: string | "";

    @ApiModelProperty()
    @Column()
    currency_code?: string | "";

    @ApiModelProperty()
    @Column()
    currency_symbol?: string | "";

    @ApiModelProperty()
    @Column()
    currency_name_formatted?: string | "";

    @ApiModelProperty()
    @Column()
    documents?: [] | [];

    @ApiModelProperty()
    @Column()
    price_precision?: Number | 0;

    @ApiModelProperty()
    @Column()
    exchange_rate?: Number | 0;

    @ApiModelProperty()
    @Column()
    custom_fields?: [] | [];

    @ApiModelProperty()
    @Column()
    custom_field_hash?: any | {};

    @ApiModelProperty()
    @Column()
    client_viewed_time?: string |"";

    @ApiModelProperty()
    @Column()
    is_tds_applied?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_item_level_tax_calc?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_inclusive_tax?: boolean | false;

    @ApiModelProperty()
    @Column()
    tax_rounding?: string | "";
    
    @ApiModelProperty()
    @Column()
    filed_in_vat_return_id?: string |"";

    @ApiModelProperty()
    @Column()
    filed_in_vat_return_name?: string |"";

    @ApiModelProperty()
    @Column()
    filed_in_vat_return_type?: string |"";

    @ApiModelProperty()
    @Column()
    is_reverse_charge_applied?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_uber_bill?: boolean | false;

    @ApiModelProperty()
    @Column()
    is_tally_bill?: boolean | false;

    @ApiModelProperty()
    @Column()
    track_discount_in_account?: boolean | false;

    @ApiModelProperty()
    @Column()
    line_items?: [] |[];

    @ApiModelProperty()
    @Column()
    submitted_date?: string |""; 

    @ApiModelProperty()
    @Column()
    submitted_by?: string |""; 

    @ApiModelProperty()
    @Column()
    approver_id?: string |""; 

    @ApiModelProperty()
    @Column()
    submitter_id?: string |""; 

    @ApiModelProperty()
    @Column()
    adjustment?: Number|0;

    @ApiModelProperty()
    @Column()
    adjustment_description?: string|"";

    @ApiModelProperty()
    @Column()
    discount_amount?: Number | 0;

    @ApiModelProperty()
    @Column()
    discount?: Number | 0;

    @ApiModelProperty()
    @Column()
    discount_applied_on_amount?: Number | 0;

    @ApiModelProperty()
    @Column()
    is_discount_before_tax?: boolean | false;

    @ApiModelProperty()
    @Column()
    discount_account_id?: string | "";

    @ApiModelProperty()
    @Column()
    discount_account_name? : string | "";


    @ApiModelProperty()
    @Column()
    discount_type?: string | "";

    @ApiModelProperty()
    @Column()
    sub_total?: Number | 0;

    @ApiModelProperty()
    @Column()
    sub_total_inclusive_of_tax?: Number |0; 

    @ApiModelProperty()
    @Column()
    tax_total?: Number |0; 

    @ApiModelProperty()
    @Column()
    total?: Number |0; 

    @ApiModelProperty()
    @Column()
    payment_made?: Number |0; 

    @ApiModelProperty()
    @Column()
    vendor_credits_applied?: Number |0; 

    @ApiModelProperty()
    @Column()
    is_line_item_invoiced?: boolean | false;

    @ApiModelProperty()
    @Column()
    purchaseorders?: [] | [];

    @ApiModelProperty()
    @Column()
    taxes?: [] | [];

    @ApiModelProperty()
    @Column()
    tax_override?: string | "";

    @ApiModelProperty()
    @Column()
    balance?: Number |0; 

    @ApiModelProperty()
    @Column()
    billing_address?: any |{}; 

    @ApiModelProperty()
    @Column()
    payments?: [] | [];

    @ApiModelProperty()
    @Column()
    vendor_credits?: [] | [];

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
    last_modified_by_id?: string |""; 

    @ApiModelProperty()
    @Column()
    reference_id?: string |""; 

    @ApiModelProperty()
    @Column()
    notes?: string |""; 

    @ApiModelProperty()
    @Column()
    terms?: string |""; 

    @ApiModelProperty()
    @Column()
    attachment_name?: string |""; 

    @ApiModelProperty()
    @Column()
    open_purchaseorders_count?: Number |0; 

    @ApiModelProperty()
    @Column()
    template_id?: string |""; 

    @ApiModelProperty()
    @Column()
    template_name?: string |""; 

    @ApiModelProperty()
    @Column()
    template_type?: string |""; 

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
    is_approval_required?: boolean |false; 

    @ApiModelProperty()
    @Column()
    allocated_landed_costs?: [] |[]; 

    @ApiModelProperty()
    @Column()
    unallocated_landed_costs?: [] |[]; 

    @ApiModelProperty()
    @Column()
    entity_type?: string |""; 

    @ApiModelProperty()
    @Column()
    credit_notes?: [] |[]; 

    @ApiModelProperty()
    @Column()
    reference_bill_id?: string |""; 

    @ApiModelProperty()
    @Column()
    can_send_in_mail?: boolean |false; 

    @ApiModelProperty()
    @Column()
    approvers_list?: [] |[]; 

    @ApiModelProperty()
    @Column()
    is_advanced_tracking_missing?: boolean |false; 


}
