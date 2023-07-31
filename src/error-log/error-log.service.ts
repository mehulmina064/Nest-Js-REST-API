// Nest JS / TypeORM MongoDB Service for Error Logging
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLog } from './error-log.entity';

@Injectable()
export class ErrorLogService {
    constructor(
        @InjectRepository(ErrorLog)
        private readonly errorLogRepository: Repository<ErrorLog>,
    ) {}

    async create(errorLog: ErrorLog): Promise<ErrorLog> {
        return await this.errorLogRepository.save(errorLog);
    }

    async findAll(): Promise<ErrorLog[]> {
        return await this.errorLogRepository.find();
    }

    async findOne(id: string): Promise<ErrorLog> {
        return await this.errorLogRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.errorLogRepository.delete(id);
    }

    async update(id: string, errorLog: Partial<ErrorLog> ): Promise<ErrorLog> {
        return await this.errorLogRepository.update(id, errorLog);
    }   

}
// Language: typescript

