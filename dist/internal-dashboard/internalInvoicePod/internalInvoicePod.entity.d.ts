import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum podType {
    Signed = "Signed Invoice",
    Digital = "Digital Signature with Receiver Photo"
}
export declare class invoicePod extends BaseAppEntity {
    id: ObjectID;
    zohoInvoiceId: string | undefined;
    zohoSalesOrderId: string | undefined;
    validity: number | undefined;
    podType: podType | undefined;
    signatureFile: string | undefined;
    podLocation: string | undefined;
    pod1: string | undefined;
    pod2: string | undefined;
    otherAttachmentLinks: string[];
}
