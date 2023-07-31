import { Repository } from 'typeorm';
import { zohoInvoice } from '../../../zohoInvoice/zohoInvoice.entity';
import { zohoToken } from '../../../sms/token.entity';
export declare class internalInvoiceService {
    private readonly zohoInvoiceRepository;
    private readonly zohoTokenRepository;
    constructor(zohoInvoiceRepository: Repository<zohoInvoice>, zohoTokenRepository: Repository<zohoToken>);
    findAll(query?: any): Promise<{
        data: zohoInvoice[];
        count: number;
    }>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    InventoryByID(id: any): Promise<any>;
    customerDetails(id: any): Promise<any>;
    zohoAll(page?: number): Promise<{
        count: any;
        data: any;
    }>;
    saveZohoInvoice(invoice: zohoInvoice): Promise<zohoInvoice>;
    saveFromZohoId(id: any): Promise<zohoInvoice>;
    getAttachment(orderId: any): Promise<undefined>;
    Summary(id: any): Promise<undefined>;
}
