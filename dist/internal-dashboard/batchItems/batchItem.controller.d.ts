import { BatchItem } from './batchItem.entity';
import { CreateBatchItemDto, UpdateBatchItemDto, CreateFieldDto } from './batchItem.dto';
import { batchItemService } from './batchItem.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { batchItemProcessService } from './batchItemProcess.service';
import { processService } from '../process/process.service';
import { batchService } from '../batches/batch.service';
import { internalPurchaseOrderService } from '../zohoData/services/purchaseOrder.service';
import { ProductPSkuService } from '../zohoData/services/productPSku.service';
export declare class batchItemController {
    private readonly batchItemService;
    private readonly zohoEmployeeService;
    private readonly ProductPSkuService;
    private readonly processService;
    private readonly batchItemProcessService;
    private readonly batchService;
    private readonly internalPurchaseOrderService;
    constructor(batchItemService: batchItemService, zohoEmployeeService: zohoEmployeeService, ProductPSkuService: ProductPSkuService, processService: processService, batchItemProcessService: batchItemProcessService, batchService: batchService, internalPurchaseOrderService: internalPurchaseOrderService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: BatchItem[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateBatchItemDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateBatchItemDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
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
