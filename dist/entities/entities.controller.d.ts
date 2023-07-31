import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { entitiesService } from './entities.service';
import { Organization } from '../organization/organization.entity';
import { Company } from '../company/company.entity';
export declare class entitiesController {
    private readonly entitiesService;
    private readonly userRepository;
    private readonly organizationRepository;
    private readonly companyRepository;
    constructor(entitiesService: entitiesService, userRepository: Repository<User>, organizationRepository: Repository<Organization>, companyRepository: Repository<Company>);
    findAll(req: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entity.entity").Entitie[];
    }>;
    save(req: any, entityData: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            entity: import("./entity.entity").Entitie;
            company: Company;
            organization: any;
            user: User;
        };
    }>;
    findOne(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, data: any): string;
    remove(id: string): string;
}
