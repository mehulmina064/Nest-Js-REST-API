import { OrganizationModel } from '../../common/org-model.entity';
import { ObjectID } from "typeorm";
export declare class InventoryTransferRequest extends OrganizationModel {
    id: ObjectID;
    code: string;
    type: string;
    item_id: string;
    inventory_id: string;
    warehouse_id: string;
    warehouse_id_to: string;
    status: string;
    uom: string;
    quantity: number;
    isApproved: boolean;
    isCompleted: boolean;
    qty: number;
}
