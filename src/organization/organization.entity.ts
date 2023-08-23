// nest typeorm entity for organization for multi account

import { Column, Entity, ObjectId, ObjectIdColumn, Unique } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/common.entity';
export enum OrganizationType {
    // Organization Type
    LOGISTICS = 'LOGISTICS',
    SUPPLIER = 'SUPPLIER',
    CLIENT = 'CLIENT',
    VENDOR = 'VENDOR',
    MANUFACTURER = 'MANUFACTURER'
}

export enum OrganizationDomain {
    // Organization Roles
    MANUFACTURER = 'MANUFACTURER',
    DISTRIBUTOR = 'DISTRIBUTOR',
    SUPPLIER = 'SUPPLIER',
    PROCUREMENT = 'PROCUREMENT',
    INVENTORY = 'INVENTORY',
    PURCHASING = 'PURCHASING',
    SALES = 'SALES',
    ACCOUNTING = 'ACCOUNTING',
    HR = 'HR',
    ADMIN = 'ADMIN',
    FINANCE = 'FINANCE',
    CATALOGUE = 'CATALOGUE',
    ECOMMERCE = 'ECOMMERCE',
    MARKETING = 'MARKETING',
    CRM = 'CRM',
    LOGISTICS = 'LOGISTICS',
    OTHER = 'OTHER',
}
export enum OrganizationStatus {
    // Organization Status
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}
@Entity('organizations')
export class Organization extends BaseAppEntity {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectId;

    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    email: string | undefined;

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: OrganizationStatus,
        default: OrganizationStatus.ACTIVE,
    })
    status: OrganizationStatus | undefined;

    @ApiModelProperty()
    @Column()
    description?: string | "";

    @ApiModelProperty()
    @Column()
    billingAddressId: string | undefined;

    @ApiModelProperty()
    @Column()
    shippingAddressId: string | undefined;

    @ApiModelProperty()
    @Column()
    logo?: string | "";

    @ApiModelProperty()
    @Column(
        { type: 'enum', enum: OrganizationType, default: OrganizationType.CLIENT },
    )
    type: OrganizationType | undefined;


    @ApiModelProperty()
    @Column()
    business_entity_name: string | undefined;

    @ApiModelProperty()
    @Column()
    business_contact_number: string | undefined;

    @ApiModelProperty()
    @Column()
    business_registered_address: string | undefined;

    @ApiModelProperty()
    @Column()
    business_city: string | undefined;

    @ApiModelProperty()
    @Column()
    business_country: string | undefined;

    @ApiModelProperty()
    @Column()
    business_state: string | undefined;

    @ApiModelProperty()
    @Column()
    business_zip: string | undefined;

    @ApiModelProperty()
    @Column()
    business_phone: string | undefined;

    @ApiModelProperty()
    @Column()
    business_fax: string | undefined;

    @ApiModelProperty()
    @Column()
    business_website: string | undefined;

    @ApiModelProperty()
    @Column()
    business_email: string | undefined;

    @ApiModelProperty()
    @Column()
    business_pan: string | undefined;   //pan_no

    @ApiModelProperty()
    @Column()
    gst_treatment: string | undefined;   //gst_treatment

    @ApiModelProperty()
    @Column()
    created_time: string | undefined;   //created_time

    @ApiModelProperty()
    @Column()
    created_date: string | undefined;   //created_date

    @ApiModelProperty()
    @Column()
    last_modified_time: string | undefined;   //last_modified_time

    @ApiModelProperty()
    @Column()
    payment_terms: string | undefined;   //payment_terms

    @ApiModelProperty()
    @Column()
    credit_limit: string | undefined;   //credit_limit

    @ApiModelProperty()
    @Column()
    created_by_name: string | undefined;   //created_by_name

    
    @ApiModelProperty()
    @Column()
    business_gstin: string | undefined;

    @ApiModelProperty()
    @Column()
    business_cin: string | undefined;

    @ApiModelProperty()
    @Column()
    business_cin_image: string | undefined;

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: OrganizationDomain,
        default: OrganizationDomain.PROCUREMENT,
    })
    domains!: OrganizationDomain[];

    @ApiModelProperty()
    @Column()
    parent_id: string | undefined;


    @ApiModelProperty()
    @Column()
    account_id?: string | undefined;

    @ApiModelProperty()
    @Column()
    companyIds?: string [] = [] ;

    @ApiModelProperty()
    @Column()
    entityIds?: string[] =[];

    @Unique(['customerId'])
    @ApiModelProperty()
    @Column()
    customerId?: string | "";

    @ApiModelProperty()
    @Column({ default: 'IN' })
    country?: string | 'IN';

}
