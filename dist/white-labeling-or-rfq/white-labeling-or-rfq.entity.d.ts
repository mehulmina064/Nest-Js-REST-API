import { ObjectID } from 'typeorm';
import { UserRole } from '../users/user.entity';
declare enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected"
}
export declare class WhiteLabelingOrRfq {
    id: ObjectID;
    userId?: string;
    type: string;
    name: string;
    mobileNumber: string;
    workEmail: string;
    organisation: string;
    gstin?: string;
    city: string;
    pinCode?: string;
    products: [];
    file: string;
    additionalDetails: string;
    rfqStatus: RoleStatus[];
}
export declare class RoleStatus {
    status: Status;
    role: UserRole;
}
export {};
