import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum Status {
    NotStarted = "NotStarted",
    InProgress = "InProgress",
    OnHold = "OnHold",
    OverDue = "OverDue",
    Complete = "Complete",
    NeedsReview = "NeedsReview"
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
export declare class BatchItem extends BaseAppEntity {
    id: ObjectID | undefined;
    name?: string | "";
    itemId?: string | "";
    batchId?: string | "";
    purchaseOrderId?: string | "";
    sku?: string | "";
    assignedTo?: string | "";
    completionDate?: string | "";
    quantity?: Number | 0;
    dueDate?: string | undefined;
    status: Status | undefined;
    fields?: Fields[] | [];
    description?: string | "";
}
export declare class BatchItemProcess extends BaseAppEntity {
    id: ObjectID | undefined;
    batchItemId?: string | "";
    processId?: string | "";
    assignedTo?: string | "";
    dueDate?: string | "";
    status: Status | undefined;
    completionDate?: string | "";
    documents?: string[] | [];
    description?: string | "";
    details: {};
}
