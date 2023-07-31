import { Repository } from 'typeorm';
import { RolesAndPermission } from './prodoRolesAndPermissionGroups.entity';
import { CreateRolePermissionDto } from './rolePermission.dto';
export declare class rolesPermissionGroupService {
    private readonly rolesAndPermissionRepository;
    constructor(rolesAndPermissionRepository: Repository<RolesAndPermission>);
    findOne(id: string): Promise<any>;
    save(role: CreateRolePermissionDto): Promise<CreateRolePermissionDto & RolesAndPermission>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<RolesAndPermission>): Promise<RolesAndPermission>;
    findAll(query?: any): Promise<{
        data: RolesAndPermission[];
        count: number;
    }>;
}
