import { ObjectID } from 'typeorm';
import { OrganizationModel } from './../common/org-model.entity';
export declare enum entityStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class Entitie extends OrganizationModel {
    id: ObjectID | undefined;
    zipCode?: string | "";
    entityName?: string | "";
    description?: string | "";
    status: entityStatus | undefined;
    billingAddress?: string | "";
    shippingAddress?: string | "";
    entityContactNumber?: string | "";
    entityCountry?: string | "IN";
    entityState?: string | "";
    entityCity?: string | "";
    companyId?: string | "";
    branches?: [] | [];
}
