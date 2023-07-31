import { CreateTestProcessDto, UpdateTestProcessDto } from './test.dto';
import { testProcessService } from '../processTest/testProcess.service';
import { processService } from '../process/process.service';
import { TestService } from './test.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class testProcessController {
    private readonly processService;
    private readonly testProcessService;
    private readonly TestService;
    private readonly zohoEmployeeService;
    constructor(processService: processService, testProcessService: testProcessService, TestService: TestService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./test.entity").TestProcess[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(processId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./test.entity").TestProcess[];
    }>;
    save(role: CreateTestProcessDto, req: any): Promise<CreateTestProcessDto & import("./test.entity").TestProcess>;
    update(id: string, role: UpdateTestProcessDto, req: any): Promise<import("./test.entity").TestProcess>;
    softDelete(id: string, req: any): Promise<string>;
}
