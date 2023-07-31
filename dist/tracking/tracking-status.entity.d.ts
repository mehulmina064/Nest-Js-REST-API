import { ObjectID } from 'typeorm';
export declare class TrackingStatusEntity {
    id: ObjectID;
    status: string;
    location: string;
    datetime: Date;
    createdBy: string;
    createdOn: Date;
}
