import { parentSku } from './parentSku.entity';
import { CreateParentSkuDto, UpdateParentSkuDto, CreateFieldDto } from './parentSku.dto';
import { parentSkuService } from './parentSku.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { processService } from '../process/process.service';
import { PSkuProcessService } from '../process/pSkuProcess.service';
export declare class parentSkuController {
    private readonly parentSkuService;
    private readonly zohoEmployeeService;
    private readonly PSkuProcessService;
    private readonly processService;
    constructor(parentSkuService: parentSkuService, zohoEmployeeService: zohoEmployeeService, PSkuProcessService: PSkuProcessService, processService: processService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: parentSku[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateParentSkuDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateParentSkuDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: parentSku;
    }>;
    softDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: parentSku;
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
