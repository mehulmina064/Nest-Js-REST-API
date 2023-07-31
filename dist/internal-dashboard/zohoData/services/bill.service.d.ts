import { Repository } from 'typeorm';
import { zohoBill } from '../../../zohoBill/zohoBill.entity';
import { zohoToken } from '../../../sms/token.entity';
export declare class internalBillService {
    private readonly zohoBillRepository;
    private readonly zohoTokenRepository;
    constructor(zohoBillRepository: Repository<zohoBill>, zohoTokenRepository: Repository<zohoToken>);
    findAll(query?: any): Promise<{
        data: zohoBill[];
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
    saveZohoPurchaseBill(zohoBill: zohoBill): Promise<zohoBill>;
    saveFromZohoId(id: any): Promise<zohoBill>;
    getAttachment(orderId: any): Promise<undefined>;
    Summary(id: any): Promise<undefined>;
}
