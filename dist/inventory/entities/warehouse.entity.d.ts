import { OrganizationModel } from "../../common/org-model.entity";
import { ObjectID } from "typeorm";
export declare class Warehouse extends OrganizationModel {
    id: ObjectID;
    name: string;
    code: string;
    address_id: string;
    hub_id: string;
    warehouse_type: string;
    warehouse_status: string;
    warehouse_location: string;
    warehouse_capacity: number;
    warehouse_measurements: {};
}
