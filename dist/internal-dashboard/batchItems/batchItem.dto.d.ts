import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
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
export declare class CreateFieldDto extends BaseCreateDto {
    name: string;
    apiName: string;
    dataType: DataType;
    value: any;
}
export declare class UpdateFieldDto extends BaseCreateDto {
    name: string;
    apiName: string;
    dataType: DataType;
    value: any;
}
export declare class CreateBatchItemDto extends BaseCreateDto {
    name: string | "";
    itemId?: string | "";
    batchId?: string | "";
    purchaseOrderId?: string | "";
    sku?: string | "";
    status: Status | undefined;
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    description?: string | "";
    quantity?: Number | "";
    fields?: Fields[] | [];
}
export declare class UpdateBatchItemDto extends BaseUpdateDto {
    itemId?: string | "";
    purchaseOrderId?: string | "";
    batchId?: string | "";
    sku?: string | "";
    name?: string | "";
    status: Status | undefined;
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    quantity?: Number | "";
    description?: string | "";
}
export declare class CreateBatchItemProcessDto extends BaseCreateDto {
    batchItemId: string;
    processId: string;
    status: Status | undefined;
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    documents?: String[] | [];
    description?: string | "";
    details: {};
}
export declare class UpdateBatchItemProcessDto extends BaseCreateDto {
    batchItemId: string;
    processId: string;
    status: Status | undefined;
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    documents?: String[] | [];
    description?: string | "";
    details: {};
}
