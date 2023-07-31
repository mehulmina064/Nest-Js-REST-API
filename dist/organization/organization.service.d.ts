import { ObjectID, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { companyService } from './../company/company.service';
import { entitiesService } from "./../entities/entities.service";
export declare class OrganizationService {
    private readonly organizationRepository;
    private readonly companyService;
    private readonly entitiesService;
    constructor(organizationRepository: Repository<Organization>, companyService: companyService, entitiesService: entitiesService);
    findAll(): Promise<Organization[]>;
    findOne(id: string): Promise<Organization>;
    filter(filter: any): Promise<Organization[]>;
    update(id: string, organization: any): Promise<import("typeorm").UpdateResult>;
    remove(id: ObjectID | undefined): Promise<void>;
    save(organization: Organization): Promise<Organization>;
    fixOldData(id: string): Promise<any>;
    newOrgSave(organization: any, type: string): Promise<any>;
    findOrganizations(ids: any): Promise<Organization[]>;
    addStatus(): Promise<{
        id: ObjectID;
        update: import("typeorm").UpdateResult;
    }[]>;
    mapOrganization(customer: any): Promise<false | Organization>;
    zohoCustomerOrganization(organization: Organization): Promise<Organization>;
}
