import { ObjectID } from 'typeorm';
import { OrganizationModel } from './../common/org-model.entity';
import { UserRole } from './roles.constants';
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare enum UserType {
    PRODO = "PRODO",
    ZOHO = "ZOHO"
}
export declare class User extends OrganizationModel {
    id: ObjectID | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    profilePicture: string | undefined;
    roles: UserRole[];
    designation: string | undefined;
    companyName: string | undefined;
    email: string | undefined;
    password: string | any;
    contactNumber: string | undefined;
    otp: string | undefined;
    gstin?: string;
    businessEntityName?: string;
    businessContactNumber?: string;
    businessRegisteredAddress?: string;
    businessCity?: string;
    businessState?: string;
    businessPinCode?: string;
    isActive?: boolean;
    isVerified?: boolean;
    status: UserStatus | undefined;
    userType: UserType | undefined;
    accountId: ObjectID | undefined;
    permissions?: [];
    teams?: string[];
    orgRole?: string;
    orgIds?: string[];
    orgIdRoles?: [];
    companyId?: string | "";
    companyIds?: string[];
    companyRole?: string;
    companyIdRoles?: [];
    entityId?: string | "";
    entityRole?: string;
    entityIds?: string[];
    entityIdRoles?: [];
    lastLoginAt?: Date;
}
