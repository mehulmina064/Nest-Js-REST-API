import { OrganizationModel } from "../../common/org-model.entity";
import { ObjectID } from "typeorm";
export declare class Inventory extends OrganizationModel {
    id: ObjectID;
    item_id: string;
    warehouse_id: string;
    item_uom: string;
    current_qty: number;
    recomended_qty: number;
    item_status: string;
    last_uploaded_date: Date;
}
