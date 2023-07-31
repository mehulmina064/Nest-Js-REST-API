import { OrganizationModel } from "../../common/org-model.entity";
import { ObjectID } from "typeorm";
export declare class StockEntry extends OrganizationModel {
    id: ObjectID;
    inventory_id: string;
    item_id: string;
    warehouse_id: string;
    bin_id: string;
    lot_id: string;
    product_id: string;
    entry_type: string;
    entry_date: Date;
    entry_by: string;
    qty: number;
    uom: string;
    remarks: string;
}
