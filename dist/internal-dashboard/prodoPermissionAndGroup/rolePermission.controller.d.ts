import { CreateRolePermissionDto, UpdateRolePermissionDto } from './rolePermission.dto';
import { prodoRolesService } from '../prodoRoles/prodoRoles.service';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
import { prodoPermissionService } from './prodoPermission.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class userRolesController {
    private readonly prodoRolesService;
    private readonly rolesPermissionGroupService;
    private readonly prodoPermissionService;
    private readonly zohoEmployeeService;
    constructor(prodoRolesService: prodoRolesService, rolesPermissionGroupService: rolesPermissionGroupService, prodoPermissionService: prodoPermissionService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./prodoRolesAndPermissionGroups.entity").RolesAndPermission[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(roleId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./prodoRolesAndPermissionGroups.entity").RolesAndPermission[];
    }>;
    userRoleDetails(roleId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateRolePermissionDto, req: any): Promise<CreateRolePermissionDto & import("./prodoRolesAndPermissionGroups.entity").RolesAndPermission>;
    update(id: string, role: UpdateRolePermissionDto, req: any): Promise<import("./prodoRolesAndPermissionGroups.entity").RolesAndPermission>;
    softDelete(id: string, req: any): Promise<string>;
}
