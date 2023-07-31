// Create Controller for Employee Service


import { Controller, Get, Post, Body, Param, Delete, Patch, Query,Request, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger, UploadedFile } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { EmployeeCreateDto, EmployeeUpdateDto } from './employee.dto';
import { filterAllData, filterSingleObject } from '../common/utils';
import { JwtAuthGuard } from './../authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeeController {
    
        constructor(private readonly employeeService: EmployeeService) { }
    
        @Get()
        async findAll(@Request() req): Promise<Employee[]> {
            return await filterAllData(this.employeeService, req.user);
        }

        @Get('filter/')
        async filter(@Query() query) {
            return await this.employeeService.filter(query);
        }

        @Get('employeebyid/:id')
        async findOne(@Param('id') id: string) {
            return await filterSingleObject(this.employeeService, id);
        }

        @Post()
        @UsePipes(ValidationPipe)
        save(@Body() employeeCreateDto: EmployeeCreateDto): Promise<Employee> {
            return this.employeeService.save(employeeCreateDto);
        }

        @Patch(':id')
        @UsePipes(ValidationPipe)
        update(@Param('id') id: string, @Body() employeeUpdateDto: EmployeeUpdateDto): Promise<Employee> {
            return this.employeeService.update(id, employeeUpdateDto);
        }

        @Delete(':id')
        delete(@Param('id') id: string): Promise<Employee> {
            return this.employeeService.delete(id);
        }

        //Bulk Upload Employee Data from Excel File
        @Post('bulk-upload')
        async bulkUploadFromExcel(@UploadedFile() file) {
            return await this.employeeService.bulkUploadFromExcel(file);
        }
    }



