import { ObjectID } from "typeorm";
export declare class Employee {
    id: ObjectID;
    name: string;
    age: number;
    salary: number;
    department: string;
    designation: string;
    joiningDate: string;
    email: string;
    mobileNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    profilePicture: string;
    companyId: string;
    userId: string;
}
