import { Organization } from './organization.entity';
import { OrganizationService } from "./organization.service";
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
export declare class OrganizationController {
    private readonly organizationService;
    private readonly userRepository;
    constructor(organizationService: OrganizationService, userRepository: Repository<User>);
    findAllOrganizations(req: any): Promise<{
        statusCode: number;
        message: string;
        data: Organization[];
    }>;
    findOne1(id: string, req: any): Promise<Organization>;
    findOne(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: Organization;
    }>;
    filter(query: any): Promise<Organization[]>;
    save(organization: Organization): Promise<Organization>;
    update(id: string, organization: any): Promise<import("typeorm").UpdateResult>;
}
