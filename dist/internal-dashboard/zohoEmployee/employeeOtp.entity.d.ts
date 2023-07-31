import { ObjectID } from 'typeorm';
export declare class employeeOtp {
    id: ObjectID | undefined;
    contactNumber: string | undefined;
    email: string | undefined;
    userId: string | undefined;
    otp: string | undefined;
}
