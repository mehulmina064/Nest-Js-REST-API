import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { EmployeeCreateDto, EmployeeUpdateDto } from './employee.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    findAll(req: any): Promise<Employee[]>;
    filter(query: any): Promise<Employee[]>;
    findOne(id: string): Promise<any>;
    save(employeeCreateDto: EmployeeCreateDto): Promise<Employee>;
    update(id: string, employeeUpdateDto: EmployeeUpdateDto): Promise<Employee>;
    delete(id: string): Promise<Employee>;
    bulkUploadFromExcel(file: any): Promise<void>;
}
