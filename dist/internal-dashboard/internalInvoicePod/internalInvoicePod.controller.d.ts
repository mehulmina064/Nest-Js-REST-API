import { Repository } from 'typeorm';
import { zohoToken } from '../../sms/token.entity';
import { invoicePodService } from './internalInvoicePod.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class invoicePodController {
    private readonly zohoTokenRepository;
    private readonly invoicePodService;
    private readonly zohoEmployeeService;
    constructor(zohoTokenRepository: Repository<zohoToken>, invoicePodService: invoicePodService, zohoEmployeeService: zohoEmployeeService);
    find(): Promise<import("./internalInvoicePod.entity").invoicePod[]>;
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isEmployee?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("../zohoEmployee/zohoEmployee.entity").zohoEmployee[];
    }>;
    findOne(id: string): Promise<any>;
    savePod(id: string, body: any): Promise<any>;
    renewPodLink(id: string): Promise<{
        message: string;
        status: number;
    }>;
    zohoBookTokenFarji(): Promise<any>;
    newZohoBookTokenFarji(): Promise<string>;
}
