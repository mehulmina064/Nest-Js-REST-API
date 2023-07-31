import { ObjectID, Repository } from 'typeorm';
import { Employee } from './employee.entity';
export declare class EmployeeService {
    private readonly employeeRepository;
    constructor(employeeRepository: Repository<Employee>);
    findAll(): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    filter(filter: any): Promise<Employee[]>;
    update(id: string, employee: any): Promise<import("typeorm").UpdateResult>;
    remove(id: ObjectID | undefined): Promise<void>;
    save(employee: Employee): Promise<Employee>;
    bulkUploadFromExcel(file: any): Promise<void>;
}
