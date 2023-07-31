import { BaseAppEntity } from '../common/common.entity';
import { ObjectID } from 'typeorm';
export declare class SupplyChainFeedItem extends BaseAppEntity {
    id: ObjectID | undefined;
    index: number | undefined;
    documentId: string;
    action: string;
    actionDate: Date;
    actor: string;
}
