import { ObjectID } from 'typeorm';
import { TrackingStatusEntity } from './tracking-status.entity';
export declare class Tracking {
    id: ObjectID | undefined;
    trackingNumber: string | undefined;
    trackingStatus: TrackingStatusEntity[] | undefined;
    shipment_id: string | undefined;
}
