import { OrganizationModel } from '../common/org-model.entity';
import { ObjectID } from 'typeorm';
import { SupplyChainFeedItem } from './supply-chain-item.entity';
export declare enum SupplyChainType {
    PurchaseOrder = "PurchaseOrder",
    ECOMMERCE = "ECOMMERCE",
    RFQ = "RFQ",
    Other = "Other"
}
export declare class SupplyChain extends OrganizationModel {
    id: ObjectID;
    supplychainType: SupplyChainType;
    supplychainSerialNumber: string;
    supplychainName: string;
    supplychainDescription: string;
    supplychainStatus: string;
    supplychainStartDate: Date;
    supplychainEndDate: Date;
    supplychainItems: SupplyChainFeedItem[];
}
