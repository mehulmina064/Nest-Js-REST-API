import { User } from './../users/user.entity';
import { DocumentStatus } from './document-status.entity';
import { PaymentTerms } from './../payments/payment-terms.entity';
import { ProductVariant } from './../product/product-variant.entity';
import { OrganizationModel } from "../common/org-model.entity";
import { ObjectID } from "typeorm";
import { Attachment } from "../attachments/attachment.entity";
import { Address } from "../addresses/address.entity";
export declare enum DocumentType {
    RFQ = "RFQ",
    PO = "PO",
    Cart = "Cart",
    Quotation = "Quotation",
    Expense = "Expense",
    Invoice = "Invoice",
    DeliveryNote = "DeliveryNote",
    Receipt = "Receipt",
    Order = "Order",
    DebitNote = "DebitNote",
    DeliveryChalan = "DeliveryChalan",
    Other = "Other"
}
export declare enum DocumentMode {
    Information = "INFORMATION",
    Attachment = "ATTACHMENT",
    Both = "BOTH"
}
export declare enum DocumentAction {
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Submit = "Submit",
    Approve = "Approve",
    Reject = "Reject",
    Cancel = "Cancel",
    Complete = "Complete",
    InProgress = "InProgress",
    OnHold = "OnHold",
    Close = "Close"
}
export declare class TransportDetails {
    challan_number: string;
    challan_date: string;
    transport: string;
    extra_information: string;
}
export declare class DeliveryDetails {
    delivery_slip_number: string;
    delivery_slip_date: string;
    delivery_slip_type: string;
    extra_information: string;
}
export declare class BillingDetails {
    billing_address_from: Address;
    billing_address_to: Address;
}
export declare class Contact {
    name: string;
    phone: string;
    email: string;
}
export declare class Tax {
    id: string;
    name: string;
    rate: string;
    amount: string;
}
export declare class Discount {
    id: string;
    name: string;
    rate: string;
    amount: string;
}
export declare class LineItem {
    catalogue_product_id: string;
    description: string;
    quantity: string;
    hsnCode: string;
    unit_price: string;
    amount: string;
    line_item_id: string;
    tax_name: string;
    tax_rate: string;
    tax_amount: string;
    discount_rate: string;
    discount_amount: string;
    child_line_items: LineItem[];
    taxes: Tax[];
    variant: ProductVariant;
    discounts: Discount[];
    attachments: Attachment[];
}
export declare class Organization {
    id: string;
    name: string;
    address: Address;
    contact: Contact;
}
export declare class Document extends OrganizationModel {
    id: ObjectID;
    number: string;
    date: Date;
    due_date: Date;
    predecessor: Document;
    successors: Document[];
    currency: string;
    category: string;
    tax: string;
    tax_amount: number;
    sub_total: number;
    tax_rate: string;
    tax_rate_amount: number;
    discount_amount: number;
    current_status: DocumentStatus | undefined;
    discount_rate: number;
    total_amount: number;
    total_amount_in_words: string;
    total_amount_in_words_without_tax: string;
    line_items: LineItem[];
    org_from_id: string;
    org_to_id: string;
    shipping_from_address: Address;
    shipping_to_address: Address;
    delivery_slip_id: string;
    transport_chalan: string;
    billing_address_from: Address;
    billing_address_to: Address;
    delivered_by: Organization;
    delivered_to: Organization;
    notes: string;
    terms: string;
    footer: string;
    template: string;
    template_type: string;
    template_name: string;
    template_id: string;
    template_version: string;
    type: DocumentType;
    attachments: Attachment[];
    documentMode: DocumentMode;
    objectAttachment: Attachment;
    related_documents: ObjectID[];
    actionAvailable: {
        from: DocumentAction[];
        to: DocumentAction[];
    };
    paymentTerms: PaymentTerms;
    statusTracking: DocumentStatus[];
    fulfillmentMonth: Date;
    shippingCharges: number;
    rootDocumentId: string;
    getActionAvailable(user: User): DocumentAction[];
    getStatusTracking(user: User): DocumentStatus[];
    getStatusTrackingByStatus(status: DocumentStatus): DocumentStatus[];
    saveDocumentStatus(status: DocumentStatus): void;
    getRelatedDocuments(): Document[];
    getCreatedBy(): Promise<any>;
    getUpdatedBy(): Promise<any>;
    getOrganizationFrom(): Promise<any>;
    getOrganizationTo(): Promise<any>;
    getDeliveredBy(): Promise<any>;
    getDeliveredTo(): Promise<any>;
    getObjectAttachment(): Promise<any>;
    getAttachments(): Promise<Attachment[]>;
    getPaymentTerms(): Promise<any>;
    getFulfillmentMonth(): Promise<Date | null>;
}
