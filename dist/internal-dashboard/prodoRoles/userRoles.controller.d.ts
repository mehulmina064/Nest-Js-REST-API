import { CreateUserRoleDto, UpdateUserRoleDto } from './prodoRoles.dto';
import { prodoRolesService } from './prodoRoles.service';
import { userRolesService } from './userRoles.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class userRolesController {
    private readonly prodoRolesService;
    private readonly zohoEmployeeService;
    private readonly userRolesService;
    constructor(prodoRolesService: prodoRolesService, zohoEmployeeService: zohoEmployeeService, userRolesService: userRolesService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./EmployeeAndRoles.entity").UserAndRoles[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(userId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./EmployeeAndRoles.entity").UserAndRoles[];
    }>;
    save(role: CreateUserRoleDto, req: any): Promise<CreateUserRoleDto & import("./EmployeeAndRoles.entity").UserAndRoles>;
    update(id: string, role: UpdateUserRoleDto, req: any): Promise<import("./EmployeeAndRoles.entity").UserAndRoles>;
    softDelete(id: string, req: any): Promise<string>;
}
