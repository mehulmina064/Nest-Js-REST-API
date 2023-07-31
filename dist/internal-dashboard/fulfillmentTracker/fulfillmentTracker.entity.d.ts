import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum Status {
    NotStarted = "NotStarted",
    InProgress = "InProgress",
    OnHold = "OnHold",
    OverDue = "OverDue",
    Complete = "Complete",
    NeedsReview = "NeedsReview",
    Pending = "Pending"
}
export declare enum DataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    ANY = "ANY",
    FILE = "FILE"
}
export declare class Fields {
    name?: string | "";
    apiName?: string | "";
    dataType: DataType | undefined;
    value?: any | any;
    isEnabled?: boolean | false;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class FulfillmentTracker extends BaseAppEntity {
    id: ObjectID | undefined;
    name?: string | "";
    customerName?: string | "";
    companyName?: string | "";
    salesOrderId?: string | "";
    salesOrderNumber?: string | "";
    businessLead?: string | "";
    fulfillmentLead?: string | "";
    productionDate?: string | "";
    fulfillmentDate?: string | "";
    clientPurchaseOrderDate?: string | "";
    completionDate?: string | "";
    status: Status | undefined;
    fields?: Fields[] | [];
    description?: string | "";
}
