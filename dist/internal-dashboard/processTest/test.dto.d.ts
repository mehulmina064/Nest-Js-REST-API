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
export declare class TestValues {
    name?: string | "";
    unit?: string | "";
    PositiveApprovalTolerance?: string | "";
    NegativeApprovalTolerance?: string | "";
    PositiveTolerableTolerance?: string | "";
    NegativeTolerableTolerance?: string | "";
    chronological_order?: string | "";
    createdAt?: Date;
    updatedAt?: Date;
    createdBy: string | undefined;
    updatedBy: string | undefined;
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
export declare class CreateTestValueDto extends BaseCreateDto {
    name: string;
    unit: string;
    PositiveApprovalTolerance: string;
    NegativeApprovalTolerance: string;
    PositiveTolerableTolerance: string;
    NegativeTolerableTolerance: string;
    chronological_order: string;
    createdBy: string;
    updatedBy: string;
    description: string;
}
export declare class UpdateTestValueDto extends BaseCreateDto {
    name: string;
    unit: string;
    PositiveApprovalTolerance: string;
    NegativeApprovalTolerance: string;
    PositiveTolerableTolerance: string;
    NegativeTolerableTolerance: string;
    chronological_order: string;
    createdBy: string;
    updatedBy: string;
    description: string;
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
    testValues?: TestValues[] | [];
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
    testValues?: TestValues[] | [];
    numberOfIterations?: Number;
    isDefault?: boolean;
}
export declare class CreateTestProcessDto extends BaseCreateDto {
    testId: string;
    processId: string;
}
export declare class UpdateTestProcessDto extends BaseCreateDto {
    testId: string;
    processId: string;
}
