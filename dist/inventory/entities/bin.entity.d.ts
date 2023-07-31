import { ObjectID } from "typeorm";
export declare class Bin {
    id: ObjectID;
    bin_no: string;
    bin_type: string;
    bin_description: string;
    bin_status: string;
    bin_location: string;
    bin_capacity: number;
    bin_measurements: {};
}
