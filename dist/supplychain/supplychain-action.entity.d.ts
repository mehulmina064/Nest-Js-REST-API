import { ObjectID } from "typeorm";
export declare class SupplyChainAction {
    id: ObjectID | undefined;
    documentType: string;
    action: string;
}
