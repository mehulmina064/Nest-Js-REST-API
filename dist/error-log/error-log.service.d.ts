import { Repository } from 'typeorm';
import { ErrorLog } from './error-log.entity';
export declare class ErrorLogService {
    private readonly errorLogRepository;
    constructor(errorLogRepository: Repository<ErrorLog>);
    create(errorLog: ErrorLog): Promise<ErrorLog>;
    findAll(): Promise<ErrorLog[]>;
    findOne(id: string): Promise<ErrorLog>;
    remove(id: string): Promise<void>;
    update(id: string, errorLog: Partial<ErrorLog>): Promise<ErrorLog>;
}
