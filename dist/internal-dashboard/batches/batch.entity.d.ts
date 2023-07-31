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
export declare class batch extends BaseAppEntity {
    id: ObjectID | undefined;
    name?: string | "";
    salesOrderId?: string | "";
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    status: Status | undefined;
    fields?: Fields[] | [];
    description?: string | "";
}
export declare class BatchItemConnection extends BaseAppEntity {
    id: ObjectID | undefined;
    batchId?: string | "";
    batchItemId?: string | "";
}
