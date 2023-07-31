import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
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
    description?: string | "";
    createdAt?: Date;
    updatedAt?: Date;
    createdBy: string | undefined;
    updatedBy: string | undefined;
}
export declare class Test extends BaseAppEntity {
    id: ObjectID | undefined;
    name?: string | "";
    displayName?: string | "";
    reason?: string | "";
    method?: string | "";
    instrumentUsed?: string[] | [];
    children?: string[] | [];
    numberOfIterations?: Number | 0;
    formulaUsed?: string | "";
    importanceLevel: ImportanceLevel | undefined;
    status: Status | undefined;
    isDefault?: boolean | false;
    fields?: Fields[] | [];
    testValues?: TestValues[] | [];
    description?: string | "";
}
export declare class TestProcess extends BaseAppEntity {
    id: ObjectID | undefined;
    testId?: string | "";
    processId?: string | "";
}
