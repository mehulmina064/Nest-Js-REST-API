import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';


@Entity('ZohoInvoice')
export class zohoInvoice extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    organization_id?: string | "";  //map by customer id org

    @ApiModelProperty()
    @Column()
    description?: string | "";
  
    @Unique(['invoice_id'])
    @ApiModelProperty()
    @Column()
    invoice_id?: string | "";

    @ApiModelProperty()
    @Column()
    invoice_number?: string | "";

    @ApiModelProperty()
    @Column()
    date?: string | "";

    @ApiModelProperty()
    @Column()
    due_date?: string | "";

    @ApiModelProperty()
    @Column()
    offline_created_date_with_time?: string | "";

    @ApiModelProperty()
    @Column()
    customer_id?: string | "";  //map to organization_id to

    @ApiModelProperty()
    @Column()
    customer_name?: string | "";

    @ApiModelProperty()
    @Column()
    customer_custom_fields? : [] | [];

    @ApiModelProperty()
    @Column()
    cf_catalog_id?: string | "";

    @ApiModelProperty()
    @Column()
    cf_catalog_id_unformatted?: string | "";

    @ApiModelProperty()
    @Column()
    customer_custom_field_hash?: any | {};

    @ApiModelProperty()
    @Column()
    email?: string | "";

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
    status?: string | "";

    @ApiModelProperty()
    @Column()
    custom_fields? : [] | [];

    @ApiModelProperty()
    @Column()
    custom_field_hash? : [] | [];

    @ApiModelProperty()
    @Column()
    recurring_invoice_id?: string | "";

    @ApiModelProperty()
    @Column()
    place_of_supply?: string | "";

    @ApiModelProperty()
    @Column()
    payment_terms?: string | "";

    @ApiModelProperty()
    @Column()
    payment_terms_label?: boolean | false;

    @ApiModelProperty()
    @Column()
    payment_reminder_enabled?: boolean | false;

    @ApiModelProperty()
    @Column()
    payment_made?: string | "";

    @ApiModelProperty()
    @Column()
    zcrm_potential_id?: string | "";

    @ApiModelProperty()
    @Column()
    zcrm_potential_name?: string | "";

    @ApiModelProperty()
    @Column()
    reference_number?: string | "";

    @ApiModelProperty()
    @Column()
    lock_details?: any | {};

    @ApiModelProperty()
    @Column()
    line_items? : [] | [];

    @ApiModelProperty()
    @Column()
    exchange_rate?: Number | 0;

    @ApiModelProperty()
    @Column()
    is_autobill_enabled?: boolean | false;

    @ApiModelProperty()
    @Column()
    inprocess_transaction_present?: boolean | false;

    @ApiModelProperty()
    @Column()
    allow_partial_payments?: boolean | false;

    @ApiModelProperty()
    @Column()
    price_precision?: Number | 0;

    @ApiModelProperty()
    @Column()
    discount_total?: Number | 0;

    @ApiModelProperty()
    @Column()
    discount_percent?: Number | 0;
    
    @ApiModelProperty()
    @Column()
    discount?: Number | 0;

    @ApiModelProperty()
    @Column()
    discount_applied_on_amount?: Number |0;

    @ApiModelProperty()
    @Column()
    discount_type?: string | "";

    @ApiModelProperty()
    @Column()
    is_discount_before_tax?: boolean | false;


    @ApiModelProperty()
    @Column()
    adjustment?: Number|0;

    @ApiModelProperty()
    @Column()
    adjustment_description?: string|"";

    @ApiModelProperty()
    @Column()
    shipping_charge_tax_id?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_tax_name? : string | "";


    @ApiModelProperty()
    @Column()
    shipping_charge_tax_type?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_tax_percentage?: string |""; 


    @ApiModelProperty()
    @Column()
    shipping_charge_tax_exemption_id?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_tax_exemption_code?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_sac_code?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_tax?: string |""; 

    @ApiModelProperty()
    @Column()
    bcy_shipping_charge_tax?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_exclusive_of_tax?: Number | 0;

    @ApiModelProperty()
    @Column()
    shipping_charge_inclusive_of_tax?: Number |0; 

    @ApiModelProperty()
    @Column()
    shipping_charge_tax_formatted?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_exclusive_of_tax_formatted?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge_inclusive_of_tax_formatted?: string | "";

    @ApiModelProperty()
    @Column()
    shipping_charge?: number | 0;

    @ApiModelProperty()
    @Column()
    bcy_shipping_charge?: number | 0;

    @ApiModelProperty()
    @Column()
    bcy_adjustment?: number | 0;

    @ApiModelProperty()
    @Column()
    bcy_sub_total?: number | 0;

    @ApiModelProperty()
    @Column()
    bcy_discount_total?: number | 0;

    @ApiModelProperty()
    @Column()
    bcy_tax_total?: number | 0;

    @ApiModelProperty()
    @Column()
    bcy_total?: number | 0;

    @ApiModelProperty()
    @Column()
    is_reverse_charge_applied?: boolean | false;

    @ApiModelProperty()
    @Column()
    total?: number | 0;

    @ApiModelProperty()
    @Column()
    balance?: number | 0;

    @ApiModelProperty()
    @Column()
    write_off_amount?: number | 0;

    @ApiModelProperty()
    @Column()
    roundoff_value?: number | 0;
    

    @ApiModelProperty()
    @Column()
    transaction_rounding_type?: string |""; 

    @ApiModelProperty()
    @Column()
    reference_invoice_type?: string | "";

    @ApiModelProperty()
    @Column()
    is_inclusive_tax?: boolean | false;

    @ApiModelProperty()
    @Column()
    sub_total_inclusive_of_tax?: number | 0;

    @ApiModelProperty()
    @Column()
    tax_specification?: string | "intra";

    @ApiModelProperty()
    @Column()
    gst_no?: string | ""; 

    @ApiModelProperty()
    @Column()
    gst_treatment?: string |""; 

    @ApiModelProperty()
    @Column()
    tax_reg_no?: string |"";

    @ApiModelProperty()
    @Column()
    contact_category?: string | "";

    @ApiModelProperty()
    @Column()
    tax_treatment?: string |"";

    @ApiModelProperty()
    @Column()
    tax_rounding?: string | "";

    @ApiModelProperty()
    @Column()
    taxes?: [] | [];

    @ApiModelProperty()
    @Column()
    filed_in_vat_return_id?: string | "";

    @ApiModelProperty()
    @Column()
    filed_in_vat_return_name?: string |""; 

    @ApiModelProperty()
    @Column()
    filed_in_vat_return_type?: string |""; 

    @ApiModelProperty()
    @Column()
    gst_return_details?: any |{}; 

    @ApiModelProperty()
    @Column()
    reverse_charge_tax_total?: Number | 0;

    @ApiModelProperty()
    @Column()
    can_send_invoice_sms?: boolean | false;

    @ApiModelProperty()
    @Column()
    payment_expected_date?: string |""; 

    @ApiModelProperty()
    @Column()
    payment_discount?: Number | 0;

    @ApiModelProperty()
    @Column()
    stop_reminder_until_payment_expected_date?: boolean | false;

    @ApiModelProperty()
    @Column()
    last_payment_date?: string |""; 

    @ApiModelProperty()
    @Column()
    ach_supported?: boolean | false;

    @ApiModelProperty()
    @Column()
    ach_payment_initiated?: boolean | false;

    @ApiModelProperty()
    @Column()
    payment_options?: any |{}; 

    @ApiModelProperty()
    @Column()
    reader_offline_payment_initiated?: boolean | false;

    @ApiModelProperty()
    @Column()
    contact_persons?: [] | [];

    @ApiModelProperty()
    @Column()
    attachment_name?: string |""; 

    @ApiModelProperty()
    @Column()
    documents?: [] | [];

    @ApiModelProperty()
    @Column()
    computation_type?: string |""; 

    @ApiModelProperty()
    @Column()
    debit_notes?: [] | [];

    @ApiModelProperty()
    @Column()
    deliverychallans?: [] | [];

    @ApiModelProperty()
    @Column()
    ewaybills?: [] | [];

    @ApiModelProperty()
    @Column()
    dispatch_from_address?: any |{}; 

    @ApiModelProperty()
    @Column()
    is_eway_bill_required?: boolean | true;

    @ApiModelProperty()
    @Column()
    can_generate_ewaybill_using_irn?: boolean | true;

    @ApiModelProperty()
    @Column()
    branch_id?: string |""; 

    @ApiModelProperty()
    @Column()
    branch_name?: string |""; 
    
    @ApiModelProperty()
    @Column()
    merchant_id?: string |""; 

    @ApiModelProperty()
    @Column()
    merchant_name?: string |""; 

    @ApiModelProperty()
    @Column()
    merchant_gst_no?: string |""; 

    @ApiModelProperty()
    @Column()
    ecomm_operator_id?: string |""; 

    @ApiModelProperty()
    @Column()
    ecomm_operator_name?: string |""; 

    @ApiModelProperty()
    @Column()
    ecomm_operator_gst_no?: string |""; 

    @ApiModelProperty()
    @Column()
    salesorder_id?: string |""; 

    @ApiModelProperty()
    @Column()
    salesorder_number?: string |""; 

    @ApiModelProperty()
    @Column()
    salesorders?: [] | [];

    @ApiModelProperty()
    @Column()
    shipping_bills?: [] | [];

    @ApiModelProperty()
    @Column()
    contact_persons_details?: any |{}; 

    @ApiModelProperty()
    @Column()
    salesperson_id?: string |""; 

    @ApiModelProperty()
    @Column()
    salesperson_name?: string |""; 

    @ApiModelProperty()
    @Column()
    is_emailed?: boolean | true;

    @ApiModelProperty()
    @Column()
    reminders_sent?: Number | 0;

    @ApiModelProperty()
    @Column()
    last_reminder_sent_date?: string |""; 

    @ApiModelProperty()
    @Column()
    next_reminder_date_formatted?: string |""; 

    @ApiModelProperty()
    @Column()
    is_viewed_by_client?: boolean | true;

    @ApiModelProperty()
    @Column()
    client_viewed_time?: string |""; 

    @ApiModelProperty()
    @Column()
    submitter_id?: string |""; 

    @ApiModelProperty()
    @Column()
    approver_id?: string |""; 

    @ApiModelProperty()
    @Column()
    submitted_date?: string |""; 

    @ApiModelProperty()
    @Column()
    submitted_by?: string |""; 

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
    notes?: string |""; 

    @ApiModelProperty()
    @Column()
    terms?: string |""; 

    @ApiModelProperty()
    @Column()
    billing_address?: any |{}; 

    @ApiModelProperty()
    @Column()
    shipping_address?: any |{}; 

    @ApiModelProperty()
    @Column()
    invoice_url?: string |""; 

    @ApiModelProperty()
    @Column()
    subject_content?: string |""; 

    @ApiModelProperty()
    @Column()
    can_send_in_mail?: boolean | true;


    @ApiModelProperty()
    @Column()
    created_time?: string |""; 


    @ApiModelProperty()
    @Column()
    last_modified_time?: string |""; 


    @ApiModelProperty()
    @Column()
    created_date?: string |""; 


    @ApiModelProperty()
    @Column()
    created_by_id?: string |""; 


    @ApiModelProperty()
    @Column()
    last_modified_by_id?: string |""; 


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
    is_backorder?: string |""; 


    @ApiModelProperty()
    @Column()
    sales_channel?: string |""; 


    @ApiModelProperty()
    @Column()
    is_pre_gst?: string |""; 


    @ApiModelProperty()
    @Column()
    type?: string |""; 


    @ApiModelProperty()
    @Column()
    color_code?: string |""; 

    @ApiModelProperty()
    @Column()
    current_sub_status_id?: string |""; 

    @ApiModelProperty()
    @Column()
    current_sub_status?: string |""; 


    @ApiModelProperty()
    @Column()
    sub_statuses?: [] |[]; 

    @ApiModelProperty()
    @Column()
    reason_for_debit_note?: string |""; 

    @ApiModelProperty()
    @Column()
    estimate_id?: string |""; 

    @ApiModelProperty()
    @Column()
    is_client_review_settings_enabled?: boolean | true;

    @ApiModelProperty()
    @Column()
    is_taxable?: boolean | true;

    @ApiModelProperty()
    @Column()
    unused_retainer_payments?: Number | 0;

    @ApiModelProperty()
    @Column()
    credits_applied?: Number | 0;

    @ApiModelProperty()
    @Column()
    tax_amount_withheld?: Number | 0;

    @ApiModelProperty()
    @Column()
    schedule_time?: string |""; 

    @ApiModelProperty()
    @Column()
    no_of_copies?: Number | 0;

    @ApiModelProperty()
    @Column()
    show_no_of_copies?: boolean | true;

    @ApiModelProperty()
    @Column()
    customer_default_billing_address?: any |{}; 

    @ApiModelProperty()
    @Column()
    reference_invoice?: any |{}; 

    @ApiModelProperty()
    @Column()
    includes_package_tracking_info?: boolean | false;

    @ApiModelProperty()
    @Column()
    approvers_list?: [] |[]; 

    @ApiModelProperty()
    @Column()
    is_advanced_tracking_missing?: boolean | false;


}
