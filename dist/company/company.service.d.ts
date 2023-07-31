import { ObjectID, Repository } from 'typeorm';
import { Company } from './company.entity';
import { entitiesService } from "./../entities/entities.service";
export declare class companyService {
    private readonly companyRepository;
    private readonly entitiesService;
    constructor(companyRepository: Repository<Company>, entitiesService: entitiesService);
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<any>;
    filter(filter: any): Promise<Company[]>;
    save(orgId: string, companyData: any): Promise<Company>;
    update(id: string, company: any): Promise<import("typeorm").UpdateResult>;
    remove(id: ObjectID | undefined): Promise<void>;
    create(orgId: string, gstNo: string, zipCode: string): Promise<{
        orgId: string;
        gstNo: string;
        zipCode: string;
        companyId: string;
        entityId: string;
    }>;
    findCompanies(ids: any): Promise<Company[]>;
    addStatus(): Promise<{
        id: ObjectID | undefined;
        update: any;
    }[]>;
    mapCompany(salesOrder: any, customer: any): Promise<false | Company>;
    zohoCustomerCompany(company: Company): Promise<Company>;
}
