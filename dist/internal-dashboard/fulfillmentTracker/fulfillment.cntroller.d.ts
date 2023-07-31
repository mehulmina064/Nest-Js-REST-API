import { FulfillmentTracker } from './fulfillmentTracker.entity';
import { CreateFTDto, UpdateFTDto, CreateFieldDto } from './fulfillmentTracker.dto';
import { fulfillmentTrackerService } from './fulfillmentTracker.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { internalSalesOrderService } from '../zohoData/services/salesOrder.service';
import { batchService } from '../batches/batch.service';
export declare class fulfillmentTrackerController {
    private readonly fulfillmentTrackerService;
    private readonly zohoEmployeeService;
    private readonly batchService;
    private readonly internalSalesOrderService;
    constructor(fulfillmentTrackerService: fulfillmentTrackerService, zohoEmployeeService: zohoEmployeeService, batchService: batchService, internalSalesOrderService: internalSalesOrderService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: FulfillmentTracker[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateFTDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateFTDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: FulfillmentTracker;
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
