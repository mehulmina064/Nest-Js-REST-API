import { CreateBatchDto, UpdateBatchDto, CreateFieldDto } from './batch.dto';
import { batch } from './batch.entity';
import { batchService } from './batch.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { batchItemService } from '../batchItems/batchItem.service';
import { internalSalesOrderService } from '../zohoData/services/salesOrder.service';
export declare class batchController {
    private readonly batchService;
    private readonly zohoEmployeeService;
    private readonly batchItemService;
    private readonly internalSalesOrderService;
    constructor(batchService: batchService, zohoEmployeeService: zohoEmployeeService, batchItemService: batchItemService, internalSalesOrderService: internalSalesOrderService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: batch[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateBatchDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateBatchDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: batch;
    }>;
    softDelete(id: string, req: any): Promise<{
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
