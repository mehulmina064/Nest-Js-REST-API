import { prodoRoles } from './prodoRoles.entity';
import { CreateRoleDto, UpdateRoleDto } from './prodoRoles.dto';
import { prodoRolesService } from './prodoRoles.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { prodoPermissionService } from '../prodoPermissionAndGroup/prodoPermission.service';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
export declare class prodoRolesController {
    private readonly prodoRolesService;
    private readonly zohoEmployeeService;
    private readonly prodoPermissionService;
    private readonly rolesPermissionGroupService;
    constructor(prodoRolesService: prodoRolesService, zohoEmployeeService: zohoEmployeeService, prodoPermissionService: prodoPermissionService, rolesPermissionGroupService: rolesPermissionGroupService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: prodoRoles[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateRoleDto, req: any): Promise<CreateRoleDto & prodoRoles>;
    update(id: string, role: UpdateRoleDto, req: any): Promise<prodoRoles>;
    softDelete(id: string, req: any): Promise<prodoRoles>;
    hardDelete(id: string, req: any): Promise<string>;
}
