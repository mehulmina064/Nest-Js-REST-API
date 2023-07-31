import { CreatePTypeDto, UpdatePTypeDto, CreateFieldDto } from './pType.dto';
import { productPType } from './pType.entity';
import { pTypeService } from './pType.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class pTypeController {
    private readonly pTypeService;
    private readonly zohoEmployeeService;
    constructor(pTypeService: pTypeService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: productPType[];
    }>;
    findOne(id: string): Promise<any>;
    save(role: CreatePTypeDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdatePTypeDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: productPType;
    }>;
    softDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: productPType;
    }>;
    hardDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: string;
    }>;
    addPermissions(id: string, req: any, body: CreateFieldDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editPermissions(id: string, req: any, body: CreateFieldDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
