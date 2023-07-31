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
export declare class CreateBatchDto extends BaseCreateDto {
    name: string;
    salesOrderId?: string | "";
    status: Status | undefined;
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    description?: string | "";
    fields?: Fields[] | [];
}
export declare class UpdateBatchDto extends BaseUpdateDto {
    salesOrderId: string;
    name?: string | "";
    status: Status | undefined;
    assignedTo?: string | "";
    dueDate?: string | "";
    completionDate?: string | "";
    description?: string | "";
}
export declare class CreateBatchItemConnectionDto extends BaseCreateDto {
    batchId: string;
    batchItemId: string;
}
export declare class UpdateBatchItemConnectionDto extends BaseCreateDto {
    batchId: string;
    batchItemId: string;
}
