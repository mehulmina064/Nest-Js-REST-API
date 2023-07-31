import { ObjectID } from 'typeorm';
import { OrganizationModel } from './../common/org-model.entity';
export declare enum companyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class Company extends OrganizationModel {
    id: ObjectID | undefined;
    gstNo?: string | "";
    companyCountry?: string | 'IN';
    companyName?: string | "";
    description?: string | "";
    status: companyStatus | undefined;
    logo?: string | "";
    companyCin: string | undefined;
    companyCinImage: string | undefined;
    companyContactNumber?: string | "";
    companyState?: string | "";
    entityIds?: string[];
}
