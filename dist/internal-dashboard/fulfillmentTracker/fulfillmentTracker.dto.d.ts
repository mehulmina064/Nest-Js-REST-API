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
export declare class CreateFTDto extends BaseCreateDto {
    name: string;
    companyName?: string | "";
    customerName?: string | "";
    salesOrderId?: string | "";
    salesOrderNumber?: string | "";
    status: Status | undefined;
    businessLead?: string | "";
    fulfillmentLead?: string | "";
    clientPurchaseOrderDate?: string | "";
    productionDate?: string | "";
    fulfillmentDate?: string | "";
    completionDate?: string | "";
    description?: string | "";
    fields?: Fields[] | [];
}
export declare class UpdateFTDto extends BaseUpdateDto {
    salesOrderId: string;
    salesOrderNumber: string;
    name?: string | "";
    companyName?: string | "";
    customerName?: string | "";
    status: Status | undefined;
    businessLead?: string | "";
    fulfillmentLead?: string | "";
    clientPurchaseOrderDate?: string | "";
    productionDate?: string | "";
    fulfillmentDate?: string | "";
    completionDate?: string | "";
    description?: string | "";
}
