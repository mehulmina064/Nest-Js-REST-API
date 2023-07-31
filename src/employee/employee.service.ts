// Create Employee Service for Employee Entity ./../employee/employee.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import * as XLSX from 'xlsx';


@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    ) { }

    async findAll(): Promise<Employee[]> {
        if (filter) {
            return await this.employeeRepository.find(filter);
        }
        return await this.employeeRepository.find();
    }

    async findOne(id: string): Promise<Employee> {
        return await this.employeeRepository.findOne(id);
    }

    async filter(filter: any) {
        return await this.employeeRepository.find(filter);
    }

    async update(id: string, employee: any) {
        return await this.employeeRepository.update(id, employee);
    }

    async remove(id: ObjectID | undefined) {
        const employee = this.employeeRepository.findOne(id).then(result => {
            this.employeeRepository.delete(result);
        });
    }

    async save(employee: Employee) {
        // check if employee already exists
        const foundEmployee = await this.employeeRepository.findOne({ employee_id: employee.employee_id });
        if (foundEmployee) {
            return this.employeeRepository.save(employee);
        } else {
            return this.employeeRepository.save(employee);
        }
    }

    async bulkUploadFromExcel(file: any) {
        const workbook = XLSX.read(file, { type: 'buffer' });
        const sheet_name_list = workbook.SheetNames;
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        const employee = await this.employeeRepository.find();
        const employeeIds = employee.map(employee => employee.employee_id);
        const dataToBeInserted = data.filter(data => !employeeIds.includes(data.employee_id));
        const dataToBeUpdated = data.filter(data => employeeIds.includes(data.employee_id));
        const dataToBeDeleted = employee.filter(employee => !data.includes(employee.employee_id));
        await this.employeeRepository.save(dataToBeInserted);
        await this.employeeRepository.save(dataToBeUpdated);
        await this.employeeRepository.remove(dataToBeDeleted);
    }
}
