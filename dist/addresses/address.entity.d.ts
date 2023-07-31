import { ObjectID } from 'typeorm';
import { OrganizationModel } from '../common/org-model.entity';
export declare class Address extends OrganizationModel {
    id: ObjectID;
    userId: string;
    addressType: string;
    name: string;
    contactNumber: string;
    companyName: string;
    gstin: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    companyIds?: string[];
    entityIds?: string[];
}
