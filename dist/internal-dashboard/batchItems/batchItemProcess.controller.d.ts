import { CreateBatchItemProcessDto, UpdateBatchItemProcessDto } from './batchItem.dto';
import { batchItemProcessService } from './batchItemProcess.service';
import { processService } from '../process/process.service';
import { batchItemService } from '../batchItems/batchItem.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class batchItemProcessController {
    private readonly processService;
    private readonly batchItemProcessService;
    private readonly batchItemService;
    private readonly zohoEmployeeService;
    constructor(processService: processService, batchItemProcessService: batchItemProcessService, batchItemService: batchItemService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./batchItem.entity").BatchItemProcess[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(batchItemId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./batchItem.entity").BatchItemProcess[];
    }>;
    save(role: CreateBatchItemProcessDto, req: any): Promise<CreateBatchItemProcessDto & import("./batchItem.entity").BatchItemProcess>;
    update(id: string, role: UpdateBatchItemProcessDto, req: any): Promise<any>;
    softDelete(id: string, req: any): Promise<string>;
}
