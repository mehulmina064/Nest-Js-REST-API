import { Long } from "long";
import { ObjectID } from "typeorm";
export declare class Ticket {
    id: ObjectID;
    subject: string;
    departmentid: Long;
    companyName: string;
    email: string;
    phone: string;
    status: string;
}
