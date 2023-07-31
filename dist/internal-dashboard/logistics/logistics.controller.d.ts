import { CreateLogisticDto, UpdateLogisticDto } from './logistics.dto';
import { logistics } from './logistics.entity';
import { logisticsService } from './logistics.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class logisticsController {
    private readonly logisticService;
    private readonly zohoEmployeeService;
    constructor(logisticService: logisticsService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: logistics[];
    }>;
    findOne(id: string): Promise<any>;
    save(role: CreateLogisticDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateLogisticDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: logistics;
    }>;
    softDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: logistics;
    }>;
    hardDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: string;
    }>;
}
