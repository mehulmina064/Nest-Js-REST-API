import { MailOptions } from './../mail/mail.service';
import { User } from './../users/user.entity';
import { DocumentStatus } from './document-status.entity';
import { PaymentTerms } from './../payments/payment-terms.entity';
import { ProductVariant } from './../product/product-variant.entity';

import { ApiModelProperty } from "@nestjs/swagger";
import { OrganizationModel } from "../common/org-model.entity";
import { Column, Entity, getMongoRepository, In, ObjectID, ObjectIdColumn, TreeRepository,Tree, TreeParent, TreeChildren } from "typeorm";
import { Attachment } from "../attachments/attachment.entity";
import { Address } from "../addresses/address.entity";
import { sendMailWithTemplate } from '../mail/mail.service';
export enum DocumentType {
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
    Other = "Other",
}

export enum DocumentMode {
    Information = "INFORMATION",
    Attachment = "ATTACHMENT",
    Both = "BOTH",
}

export enum DocumentAction {
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
    Close = "Close",
}

export class TransportDetails
{
    challan_number: string;
    challan_date: string;
    transport: string;
    extra_information: string;
}
export class DeliveryDetails
{
    delivery_slip_number: string;
    delivery_slip_date: string;
    delivery_slip_type: string;
    extra_information: string;
}
export class BillingDetails
{
    billing_address_from: Address;
    billing_address_to: Address;
}



export class Contact
{
    name: string;
    phone: string;
    email: string;
}


export class Tax
{
    id: string;
    name: string;
    rate: string;
    amount: string;
}

export class Discount
{
    id: string;
    name: string;
    rate: string;
    amount: string;
}

export class LineItem
{
    catalogue_product_id: string;
    description: string;
    quantity: string;
    hsnCode : string;
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
    variant:ProductVariant
    discounts: Discount[];
    attachments: Attachment[];
    
}   
export class Organization
    {
        id: string;
        name: string;
        address: Address;
        contact: Contact;
    }


@Entity("document")
export class Document extends OrganizationModel{

    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

   // Business Document Fields

    @ApiModelProperty()
    @Column()
    number: string;

    @ApiModelProperty()
    @Column()
    date: Date;

    @ApiModelProperty()
    @Column()
    due_date: Date;



    @ApiModelProperty()
    @Column()
    predecessor: Document

    @ApiModelProperty()
    @Column()
    successors: Document[] 


    @ApiModelProperty()
    @Column()
    currency: string;

    @ApiModelProperty()
    @Column()
    category: string;


    @ApiModelProperty()
    @Column()
    tax: string;

    @ApiModelProperty()
    @Column()
    tax_amount: number;


    @ApiModelProperty()
    @Column()
    sub_total: number;

    @ApiModelProperty()
    @Column()
    tax_rate: string;

    @ApiModelProperty()
    @Column()
    tax_rate_amount: number;

    @ApiModelProperty()
    @Column()
    discount_amount: number;

    @ApiModelProperty()
    @Column()
    current_status: DocumentStatus | undefined;

    @ApiModelProperty()
    @Column()
    discount_rate: number;

    @ApiModelProperty()
    @Column()
    total_amount: number;

    @ApiModelProperty()
    @Column()
    total_amount_in_words: string;

    @ApiModelProperty()
    @Column()
    total_amount_in_words_without_tax: string;

    @ApiModelProperty()
    @Column()
    line_items: LineItem[];

    @ApiModelProperty()
    @Column()
    org_from_id: string;

    @ApiModelProperty()
    @Column()
    org_to_id: string;

    @ApiModelProperty()
    @Column()
    shipping_from_address: Address;

    @ApiModelProperty()
    @Column()
    shipping_to_address: Address;
    
    @ApiModelProperty()
    @Column()
    delivery_slip_id: string;
    
    @ApiModelProperty()
    @Column()
    transport_chalan: string;

    @ApiModelProperty()
    @Column()
    billing_address_from: Address;

    @ApiModelProperty()
    @Column()
    billing_address_to: Address;

    @ApiModelProperty()
    @Column()
    delivered_by: Organization;

    @ApiModelProperty()
    @Column()
    delivered_to: Organization;

    @ApiModelProperty()
    @Column()
    notes: string;

    @ApiModelProperty()
    @Column()
    terms: string;

    @ApiModelProperty()
    @Column()
    footer: string;

    @ApiModelProperty()
    @Column()
    template: string;

    @ApiModelProperty()
    @Column()
    template_type: string;

    @ApiModelProperty()
    @Column()
    template_name: string;

    @ApiModelProperty()
    @Column()
    template_id: string;

    @ApiModelProperty()
    @Column()
    template_version: string;

    @ApiModelProperty()
    @Column({ type: "enum", enum: DocumentType, default: DocumentType.Other })
    type: DocumentType;

    @ApiModelProperty()
    @Column()
    attachments: Attachment[];

    @ApiModelProperty()
    @Column()
    documentMode: DocumentMode;

    @ApiModelProperty()
    @Column()
    objectAttachment: Attachment;

    @ApiModelProperty()
    @Column()
    related_documents: ObjectID[];

    @ApiModelProperty()
    @Column()
    actionAvailable!: { from: DocumentAction[]; to: DocumentAction[]; };

    @ApiModelProperty()
    @Column()
    paymentTerms:PaymentTerms;
    
    @ApiModelProperty()
    @Column()
    statusTracking: DocumentStatus[] = [];

    @ApiModelProperty()
    @Column()
    fulfillmentMonth : Date;

    @ApiModelProperty()
    @Column()
    shippingCharges: number;

    @ApiModelProperty()
    @Column()
    rootDocumentId: string;
    


    @ApiModelProperty()
    getActionAvailable(user: User) {
        if (this.actionAvailable) {
            if (user.organization_id == this.org_from_id) {
                return this.actionAvailable.from;
            }
            else if (user.organization_id == this.org_to_id) {
                return this.actionAvailable.to;
            }
        }
        return [];
    }

    getStatusTracking(user: User) {
        if (this.statusTracking) {
            if (user.organization_id == this.org_from_id) {
                return this.statusTracking;
            }
            else if (user.organization_id == this.org_to_id) {
                return this.statusTracking;
            }
        }
        return [];
    }

    getStatusTrackingByStatus(status: DocumentStatus) {
        if (this.statusTracking) {
            return this.statusTracking.filter(x => x.status == status);
        }
        return [];
    }
    
    saveDocumentStatus(status: DocumentStatus) {
        if (this.statusTracking) {
            this.statusTracking.push(status);
        }
        else {
            this.statusTracking = [status];
        }
    }
    getRelatedDocuments() {
        let docs:Document[] = [];

        if (this.related_documents) {
            this.related_documents.forEach(async x => {
                const doc = await getMongoRepository(Document).findOne(x);
                if (doc) {
                    docs.push(doc);
                }
            });
            return docs;
        }
        return [];
    }

    async getCreatedBy() {
        if (this.createdBy) {
            return await getMongoRepository(User).findOne(this.createdBy);
        }
        return null;
    }

    async getUpdatedBy() {
        if (this.updatedBy) {
            return await getMongoRepository(User).findOne(this.updatedBy);
        }
        return null;
    }

    async getOrganizationFrom() {
        if (this.org_from_id) {
            return await getMongoRepository(Organization).findOne(this.org_from_id);
        }
        return null;
    }

    async getOrganizationTo() {
        if (this.org_to_id) {
            return await getMongoRepository(Organization).findOne(this.org_to_id);
        }
        return null;
    }

    async getDeliveredBy() {
        if (this.delivered_by) {
            return await getMongoRepository(Organization).findOne(this.delivered_by);
        }
        return null;
    }

    async getDeliveredTo() {
        if (this.delivered_to) {
            return await getMongoRepository(Organization).findOne(this.delivered_to);
        }
        return null;
    }

    async getObjectAttachment() {
        if (this.objectAttachment) {
            return await getMongoRepository(Attachment).findOne(this.objectAttachment);
        }
        return null;
    }

    async getAttachments() {
        if (this.attachments) {
            return await getMongoRepository(Attachment).find({
                where: {
                    _id: In(this.attachments)
                }
            });
        }
        return [];
    }
    
    async getPaymentTerms() {
        if (this.paymentTerms) {
            return await getMongoRepository(PaymentTerms).findOne(this.paymentTerms);
        }
        return null;
    }

    async getFulfillmentMonth() {
        if (this.fulfillmentMonth) {
            return this.fulfillmentMonth;
        }
        return null;
    }
   



}

