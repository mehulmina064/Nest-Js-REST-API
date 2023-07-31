import { Repository } from 'typeorm';
import { UserAndRoles } from './EmployeeAndRoles.entity';
import { zohoToken } from '../../sms/token.entity';
import { CreateUserRoleDto } from './prodoRoles.dto';
export declare class userRolesService {
    private readonly userRolesRepository;
    private readonly zohoTokenRepository;
    constructor(userRolesRepository: Repository<UserAndRoles>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: CreateUserRoleDto): Promise<CreateUserRoleDto & UserAndRoles>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<UserAndRoles>): Promise<UserAndRoles>;
    findAll(query?: any): Promise<{
        data: UserAndRoles[];
        count: number;
    }>;
}
