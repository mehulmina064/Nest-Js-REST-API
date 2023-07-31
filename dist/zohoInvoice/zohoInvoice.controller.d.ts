/// <reference types="node" />
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { zohoInvoiceService } from './zohoInvoice.service';
export declare class zohoInvoiceController {
    private readonly userRepository;
    private readonly zohoInvoiceService;
    constructor(userRepository: Repository<User>, zohoInvoiceService: zohoInvoiceService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./zohoInvoice.entity").zohoInvoice[];
    }>;
    updateOne(id: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./zohoInvoice.entity").zohoInvoice;
    }>;
    updateAll(start: any): Promise<({
        invoice_id: any;
        response: import("./zohoInvoice.entity").zohoInvoice;
        statusCode: number;
        message: string;
        number: any;
        "error"?: undefined;
    } | {
        invoice_id: any;
        error: string;
        statusCode: number;
        message: string;
        number: any;
        response?: undefined;
    })[]>;
    zohoAll(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOne(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachment(invoiceId: any, res: any): Promise<Buffer>;
    Summary(invoiceId: any, res: any): Promise<Buffer>;
}
