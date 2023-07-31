import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
import { UserRole } from './prodoRoles.constants';
export declare class EmailId {
    email?: string | "";
    is_selected?: boolean | false;
}
export declare enum ZohoEmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DELETED = "deleted"
}
export declare enum UserType {
    "ZOHO" = "zoho",
    "PRODO" = "prodo"
}
export declare class zohoEmployee extends BaseAppEntity {
    id: ObjectID | undefined;
    lastLoginAt?: Date;
    zohoUserId?: string | "";
    roles: UserRole[];
    contactNumber?: string | "";
    password?: string | "";
    name?: string | "";
    otp: string | undefined;
    emailIds?: EmailId[] | [];
    status: ZohoEmployeeStatus | undefined;
    teams?: string[];
    designation?: string | "";
    type: UserType | undefined;
    profile?: string | "https://prodo-files-upload.s3.ap-south-1.amazonaws.com/files/profile-pic.jpeg";
    dateOfBerth?: string | "";
    isEmployee?: boolean | false;
    email?: string | "";
    associatedClients?: [] | [];
}
