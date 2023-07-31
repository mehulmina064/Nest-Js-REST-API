import { DocumentStatus } from './../document/document-status.entity';
import { Payments } from './payments.entity';
import { ObjectID } from "typeorm";
export declare class PaymentTerms {
    id: ObjectID;
    paymentTerm: string;
    paymentTermDescription: string;
    paymentTermCode: string;
    paymentTermType: string;
    document_id: string;
    due_date: Date;
    payments_emis: Payments[];
    purchase_order: string;
    supplychain_id: string;
    statusHistory: DocumentStatus[];
}
