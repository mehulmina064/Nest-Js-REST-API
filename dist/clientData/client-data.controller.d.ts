import { ClientDataService } from './client-data.service';
import { ClientData } from './client-data.entity';
import { ClientDataDto } from './client-data.dto';
export declare class ClientDataController {
    private readonly clientDataService;
    constructor(clientDataService: ClientDataService);
    findAll(req: any, query: any): Promise<any>;
    getLineItems(req: any): Promise<any[] | null>;
    clearData(): Promise<ClientData[]>;
    getDashboardData(req: any): Promise<{
        orders: {
            total: number;
            completed: number;
            inProgress: number;
            cancelled: number;
        };
        payments: {
            total: number;
            paid: number;
            due: number;
        };
        pieChart: never[];
        barChart: never[];
    }>;
    filter(req: any): Promise<ClientData[]>;
    download(): Promise<void>;
    findOne(id: string): Promise<ClientData>;
    save(clientData: ClientDataDto): any;
    update(id: string, clientData: ClientDataDto): Promise<import("typeorm").UpdateResult>;
    delete(id: string): Promise<any>;
    bulkUploadFromExcel(file: any): Promise<any[]>;
    attachFile(id: string, file: any, req: any): Promise<any>;
    getAttachedFiles(id: string): Promise<any>;
    removeFile(id: string, file_name: string): Promise<any>;
}
