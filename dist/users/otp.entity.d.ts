import { ObjectID } from 'typeorm';
export declare class Otp {
    id: ObjectID;
    contactNumber: string;
    email: string;
    userId: string;
    otp: string;
}
