import { companyService } from "./company.service";
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Organization } from "../organization/organization.entity";
export declare class companyController {
    private readonly companyService;
    private readonly userRepository;
    private readonly organizationRepository;
    constructor(companyService: companyService, userRepository: Repository<User>, organizationRepository: Repository<Organization>);
    save(req: any, companyData: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            company: import("./company.entity").Company;
            organization: Organization;
            user: User;
        };
    }>;
    findAll(req: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./company.entity").Company[];
    }>;
    filter(query: any): Promise<import("./company.entity").Company[]>;
    findOne(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, company: any): Promise<import("typeorm").UpdateResult>;
}
