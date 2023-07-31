import { CreatePSkuProcessDto, UpdatePSkuProcessDto } from './process.dto';
import { PSkuProcessService } from './pSkuProcess.service';
import { processService } from './process.service';
import { parentSkuService } from '../parentSku/parentSku.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class PSkuProcessController {
    private readonly processService;
    private readonly PSkuProcessService;
    private readonly parentSkuService;
    private readonly zohoEmployeeService;
    constructor(processService: processService, PSkuProcessService: PSkuProcessService, parentSkuService: parentSkuService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./process.entity").PSkuProcess[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(pSkuId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./process.entity").PSkuProcess[];
    }>;
    save(role: CreatePSkuProcessDto, req: any): Promise<CreatePSkuProcessDto & import("./process.entity").PSkuProcess>;
    update(id: string, role: UpdatePSkuProcessDto, req: any): Promise<import("./process.entity").PSkuProcess>;
    softDelete(id: string, req: any): Promise<string>;
}
