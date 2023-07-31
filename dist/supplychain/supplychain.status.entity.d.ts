import { BaseAppEntity } from "../common/common.entity";
import { ObjectID } from "typeorm";
export declare class SupplyChainStatus extends BaseAppEntity {
    id: ObjectID | undefined;
    documentType: string;
    action: string;
    actor: string;
    statusforrequestee: string;
    statusforrequestor: string;
    statusforapprover: string;
}
