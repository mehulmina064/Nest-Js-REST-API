import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
export declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
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
export declare class CreatePTypeDto extends BaseCreateDto {
    name: string;
    displayName?: string | "";
    status: Status | Status.ACTIVE;
    description?: string | "";
    fields?: Fields[] | [];
    isDefault?: boolean;
}
export declare class UpdatePTypeDto extends BaseUpdateDto {
    name: string;
    displayName?: string | "";
    status: Status | Status.ACTIVE;
    isDefault?: boolean;
    fields?: Fields[] | [];
    description?: string | "";
}
