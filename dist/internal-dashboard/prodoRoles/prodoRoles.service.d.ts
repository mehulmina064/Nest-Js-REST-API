import { Repository } from 'typeorm';
import { prodoRoles } from './prodoRoles.entity';
import { zohoToken } from '../../sms/token.entity';
import { CreateRoleDto } from './prodoRoles.dto';
export declare class prodoRolesService {
    private readonly prodoRolesRepository;
    private readonly zohoTokenRepository;
    constructor(prodoRolesRepository: Repository<prodoRoles>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: CreateRoleDto): Promise<CreateRoleDto & prodoRoles>;
    softRemove(id: string, userId: string): Promise<prodoRoles>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<prodoRoles>): Promise<prodoRoles>;
    findAll(query?: any): Promise<{
        data: prodoRoles[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
