import { ObjectID } from "typeorm";
export declare class ErrorLog {
    id: ObjectID;
    userId: string;
    errorMessage: string;
    errorStack: string;
    errorDate: Date;
}
