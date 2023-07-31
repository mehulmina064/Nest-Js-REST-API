import { OrganizationModel } from '../common/org-model.entity';
import { ObjectID } from "typeorm";
export declare class ClientData extends OrganizationModel {
    id: ObjectID;
    client_name: string;
    particulars: string;
    purchase_order: string;
    po_date: Date;
    category_of_products: string;
    po_month: Date;
    po_amount: number;
    fulfillment_month: Date;
    invoice_amount_ex_gst: number;
    invoice_amount_inc_gst: number;
    cogs: number;
    gross_profit: number;
    status: string;
    attached_files: AttachedFile[];
    amount_received: number;
    due_amount: number;
    due_date_of_receivable_from_client: Date;
    line_items: [];
}
export declare class AttachedFile {
    document_name: string;
    file_name: string;
    file_path: string;
    file_type: string;
}
