import { ObjectID } from 'typeorm';
export declare class ContactForm {
    id: ObjectID;
    type: string;
    name: string;
    mobileNumber: string;
    email: string;
    linkedin: string;
    file: string;
}
