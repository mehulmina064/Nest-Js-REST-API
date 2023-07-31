import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class rfqBid extends BaseAppEntity {
    id: ObjectID;
    manufactureEmail: string | undefined;
    lineItems: [];
    manufacturePhone: string | undefined;
    manufactureGstNo: string | undefined;
    rfqBidComment: string | undefined;
    rfqBidNo: number | undefined;
    rfqId: string | undefined;
}
