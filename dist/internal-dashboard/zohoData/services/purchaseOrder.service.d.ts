import { Repository } from 'typeorm';
import { zohoPurchaseOrder } from '../../../zohoPurchaseOrder/zohoPurchaseOrder.entity';
import { zohoToken } from '../../../sms/token.entity';
export declare class internalPurchaseOrderService {
    private readonly zohoPurchaseOrderRepository;
    private readonly zohoTokenRepository;
    constructor(zohoPurchaseOrderRepository: Repository<zohoPurchaseOrder>, zohoTokenRepository: Repository<zohoToken>);
    findAll(query?: any): Promise<{
        data: zohoPurchaseOrder[];
        count: number;
    }>;
    find(id: string): Promise<boolean | zohoPurchaseOrder | null>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    InventoryPorByID(id: any): Promise<any>;
    customerDetails(id: any): Promise<any>;
    zohoAllPo(page?: number): Promise<{
        count: any;
        data: any;
    }>;
    saveZohoPurchaseOrder(salesOrder: zohoPurchaseOrder): Promise<zohoPurchaseOrder>;
    saveFromZohoId(id: any): Promise<zohoPurchaseOrder>;
    getAttachment(orderId: any): Promise<undefined>;
    OrderSummary(id: any): Promise<undefined>;
}
