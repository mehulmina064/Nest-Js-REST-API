import { process } from './process.entity';
import { CreateProcessDto, UpdateProcessDto, CreateFieldDto } from './process.dto';
import { processService } from './process.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { testProcessService } from '../processTest/testProcess.service';
import { TestService } from '../processTest/test.service';
export declare class processController {
    private readonly processService;
    private readonly zohoEmployeeService;
    private readonly TestService;
    private readonly testProcessService;
    constructor(processService: processService, zohoEmployeeService: zohoEmployeeService, TestService: TestService, testProcessService: testProcessService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: process[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(role: CreateProcessDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateProcessDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: process;
    }>;
    softDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: process;
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
