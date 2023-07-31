export declare class ClientDataDto {
    id: number;
    client_name: string;
    particulars: string;
    purchase_order: string;
    po_date: string;
    category_of_products: string;
    po_month: string;
    po_amount: string;
    fulfillment_month: string;
    invoice_amount_ex_gst: string;
    logo: string;
    cogs: string;
    gross_profit: string;
    status: string;
    attached_files: [];
}
export declare class LineItem {
    item: string;
    comments: string;
    hsn: string;
    gst: string;
    quantity: string;
    rate: string;
    rate_inc_tax: string;
    measuring_unit: string;
    amount: string;
    tracking: string;
    image: string;
}
