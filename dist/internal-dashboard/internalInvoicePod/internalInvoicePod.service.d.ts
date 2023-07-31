import { Repository } from 'typeorm';
import { invoicePod } from './internalInvoicePod.entity';
export declare class invoicePodService {
    private readonly invoicePodRepository;
    constructor(invoicePodRepository: Repository<invoicePod>);
    findAll(): Promise<invoicePod[]>;
    findInvoiceDetails(token: any, invoiceId: any): Promise<any>;
    checkInvoicePod(invoiceId: any): Promise<{
        message: string;
        status: number;
    }>;
    saveDigitalPod(pod: any, token: any): Promise<any>;
    saveSignaturePod(pod: any, token: any): Promise<any>;
    savePodToZohoInventory(pod: any, token: any): Promise<any>;
    renewPodLink(zohoInvoiceId: any): Promise<{
        message: string;
        status: number;
    }>;
    getInvoicePods(zohoInvoiceId: any): Promise<invoicePod[]>;
}
