import { ErrorLog } from "./error-log.entity";
import { ErrorLogService } from "./error-log.service";
export declare class ErrorLogController {
    private readonly errorLogService;
    constructor(errorLogService: ErrorLogService);
    findAll(): Promise<ErrorLog[]>;
    findOne(id: string): Promise<ErrorLog>;
    create(errorLog: ErrorLog): Promise<ErrorLog>;
    remove(id: string): Promise<void>;
    update(id: string, errorLog: ErrorLog): Promise<ErrorLog>;
}
