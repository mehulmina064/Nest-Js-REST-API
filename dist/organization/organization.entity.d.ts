import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/common.entity';
export declare enum OrganizationType {
    LOGISTICS = "LOGISTICS",
    PRODO = "PRODO",
    SUPPLIER = "SUPPLIER",
    CLIENT = "CLIENT",
    VENDOR = "VENDOR",
    MANUFACTURER = "MANUFACTURER"
}
export declare enum OrganizationDomain {
    PRODO = "PRODO",
    MANUFACTURER = "MANUFACTURER",
    DISTRIBUTOR = "DISTRIBUTOR",
    SUPPLIER = "SUPPLIER",
    PROCUREMENT = "PROCUREMENT",
    INVENTORY = "INVENTORY",
    PURCHASING = "PURCHASING",
    SALES = "SALES",
    ACCOUNTING = "ACCOUNTING",
    HR = "HR",
    ADMIN = "ADMIN",
    FINANCE = "FINANCE",
    CATALOGUE = "CATALOGUE",
    ECOMMERCE = "ECOMMERCE",
    MARKETING = "MARKETING",
    CRM = "CRM",
    LOGISTICS = "LOGISTICS",
    OTHER = "OTHER"
}
export declare enum OrganizationStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class Organization extends BaseAppEntity {
    id: ObjectID;
    name?: string | "";
    email: string | undefined;
    status: OrganizationStatus | undefined;
    description?: string | "";
    billingAddressId: string | undefined;
    shippingAddressId: string | undefined;
    logo?: string | "";
    type: OrganizationType | undefined;
    business_entity_name: string | undefined;
    business_contact_number: string | undefined;
    business_registered_address: string | undefined;
    business_city: string | undefined;
    business_country: string | undefined;
    business_state: string | undefined;
    business_zip: string | undefined;
    business_phone: string | undefined;
    business_fax: string | undefined;
    business_website: string | undefined;
    business_email: string | undefined;
    business_pan: string | undefined;
    gst_treatment: string | undefined;
    created_time: string | undefined;
    created_date: string | undefined;
    last_modified_time: string | undefined;
    payment_terms: string | undefined;
    credit_limit: string | undefined;
    created_by_name: string | undefined;
    business_gstin: string | undefined;
    business_cin: string | undefined;
    business_cin_image: string | undefined;
    domains: OrganizationDomain[];
    parent_id: string | undefined;
    account_id?: string | undefined;
    companyIds?: string[];
    entityIds?: string[];
    customerId?: string | "";
    country?: string | 'IN';
}
