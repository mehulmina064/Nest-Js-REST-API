import { CreateBatchItemConnectionDto, UpdateBatchItemConnectionDto } from './batch.dto';
import { batchItemConnectionService } from './batchItemConnection.service';
import { batchService } from './batch.service';
import { batchItemService } from '../batchItems/batchItem.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class batchItemConnectionController {
    private readonly batchService;
    private readonly batchItemConnectionService;
    private readonly batchItemService;
    private readonly zohoEmployeeService;
    constructor(batchService: batchService, batchItemConnectionService: batchItemConnectionService, batchItemService: batchItemService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./batch.entity").BatchItemConnection[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(batchId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./batch.entity").BatchItemConnection[];
    }>;
    save(role: CreateBatchItemConnectionDto, req: any): Promise<CreateBatchItemConnectionDto & import("./batch.entity").BatchItemConnection>;
    update(id: string, role: UpdateBatchItemConnectionDto, req: any): Promise<import("./batch.entity").BatchItemConnection>;
    softDelete(id: string, req: any): Promise<string>;
}
