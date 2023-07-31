import { CreatePermissionDto, UpdatePermissionDto, CreateModulePermissionDto } from './rolePermission.dto';
import { prodoPermissionGroup } from './prodoPermissionGroup.entity';
import { prodoPermissionService } from './prodoPermission.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class prodoPermissionController {
    private readonly prodoPermissionService;
    private readonly zohoEmployeeService;
    constructor(prodoPermissionService: prodoPermissionService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: prodoPermissionGroup[];
    }>;
    findOne(id: string): Promise<any>;
    save(role: CreatePermissionDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdatePermissionDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: prodoPermissionGroup;
    }>;
    softDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: prodoPermissionGroup;
    }>;
    hardDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: string;
    }>;
    addPermissions(id: string, req: any, body: CreateModulePermissionDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editPermissions(id: string, req: any, body: CreateModulePermissionDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
