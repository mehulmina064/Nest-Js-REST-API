import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ErrorLog } from "./error-log.entity";
import { ErrorLogService } from "./error-log.service";

@Controller('error-log')
export class ErrorLogController {
    constructor(
        private readonly errorLogService: ErrorLogService,
    ) {}

    @Get()
    async findAll(): Promise<ErrorLog[]> {
        return await this.errorLogService.findAll();
    }

    @Get('/:id')
    async findOne(id: string): Promise<ErrorLog> {
        return await this.errorLogService.findOne(id);
    }

    @Post()
    async create(errorLog: ErrorLog): Promise<ErrorLog> {
        return await this.errorLogService.create(errorLog);
    }

    @Delete('/:id')
    async remove(id: string): Promise<void> {
        await this.errorLogService.remove(id);
    }

    @Put('/:id')
    async update(id: string, errorLog: ErrorLog): Promise<ErrorLog> {
        return await this.errorLogService.update(id, errorLog);
    }


}
