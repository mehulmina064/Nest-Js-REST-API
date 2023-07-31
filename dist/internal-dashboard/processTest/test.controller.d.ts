import { Test } from './test.entity';
import { CreateFieldDto, UpdateFieldDto, CreateProcessTestDto, UpdateProcessTestDto, CreateTestValueDto, UpdateTestValueDto } from './test.dto';
import { TestService } from './test.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class TestController {
    private readonly processTestService;
    private readonly zohoEmployeeService;
    constructor(processTestService: TestService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: Test[];
    }>;
    findOne(id: string): Promise<any>;
    save(role: CreateProcessTestDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, role: UpdateProcessTestDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    softDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: Test;
    }>;
    hardDelete(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: string;
    }>;
    addFields(id: string, req: any, body: CreateFieldDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editFields(id: string, req: any, body: UpdateFieldDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addTestValues(id: string, req: any, body: CreateTestValueDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editTestValues(id: string, req: any, body: UpdateTestValueDto[]): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
