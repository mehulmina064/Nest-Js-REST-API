import { OrganizationModel } from '../../common/org-model.entity';
import { ObjectID } from "typeorm";
export declare class Lot extends OrganizationModel {
    id: ObjectID;
    lot_no: string;
    product_id: string;
    product_name: string;
    product_code: string;
    product_uom: string;
    inventories: string[];
}
