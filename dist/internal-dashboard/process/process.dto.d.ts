import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
export declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare enum ImportanceLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
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
export declare class CreateProcessDto extends BaseCreateDto {
    name: string;
    displayName?: string | "";
    status: Status | undefined;
    description?: string | "";
    minTime?: string | "";
    mostFrequentTime?: string | "";
    maxTime?: string | "";
    fields?: Fields[] | [];
    isDefault?: boolean;
}
export declare class UpdateProcessDto extends BaseUpdateDto {
    name: string;
    displayName?: string | "";
    status: Status | Status.ACTIVE;
    minTime?: string | "";
    mostFrequentTime?: string | "";
    maxTime?: string | "";
    isDefault?: boolean;
    fields?: Fields[] | [];
    description?: string | "";
}
export declare class CreateProcessTestDto extends BaseCreateDto {
    name: string;
    displayName?: string | "";
    status: Status | undefined;
    reason?: string | "";
    method?: string | "";
    instrumentUsed?: string[] | "";
    children?: string[] | "";
    maxTime?: string | "";
    formulaUsed?: string | "";
    description?: string | "";
    importanceLevel: ImportanceLevel | undefined;
    fields?: Fields[] | [];
    numberOfIterations?: Number;
    isDefault?: boolean;
}
export declare class UpdateProcessTestDto extends BaseUpdateDto {
    name: string;
    displayName?: string | "";
    status: Status | undefined;
    reason?: string | "";
    method?: string | "";
    instrumentUsed?: string[] | "";
    children?: string[] | "";
    maxTime?: string | "";
    formulaUsed?: string | "";
    description?: string | "";
    importanceLevel: ImportanceLevel | undefined;
    fields?: Fields[] | [];
    numberOfIterations?: Number;
    isDefault?: boolean;
}
export declare class CreatePSkuProcessDto extends BaseCreateDto {
    pSkuId: string;
    processId: string;
}
export declare class UpdatePSkuProcessDto extends BaseCreateDto {
    pSkuId: string;
    processId: string;
}
