import { Repository } from 'typeorm';
import { zohoSalesOrder } from '../../../zohoSalesOrder/zohoSalesOrder.entity';
import { zohoToken } from '../../../sms/token.entity';
export declare class internalSalesOrderService {
    private readonly zohoSalesOrderRepository;
    private readonly zohoTokenRepository;
    constructor(zohoSalesOrderRepository: Repository<zohoSalesOrder>, zohoTokenRepository: Repository<zohoToken>);
    findAll(query?: any): Promise<{
        data: zohoSalesOrder[];
        count: number;
    }>;
    findOne(id: string): Promise<zohoSalesOrder>;
    ByReferenceNumber(rf: string): Promise<zohoSalesOrder>;
    check(id: string): Promise<boolean | zohoSalesOrder | null>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    packageDetails(id: any): Promise<any>;
    itemStatus(lineItems: any, salesOrder: any): Promise<any>;
    calculateStatus(lineItem: any): Promise<"Delivered" | "Quality Check" | "In Transit[Fully Shipped]" | " In Transit[Fully packed]" | "In Transit[Partially Shipped]" | "In Transit[Partially Packed]">;
    salesOrderFormatData(salesOrder: any): Promise<zohoSalesOrder>;
    customerDetails(id: any): Promise<any>;
    basicOrderDetails(id: any, page?: any): Promise<any>;
    zohoAllSo(page?: number): Promise<{
        count: any;
        data: any;
    }>;
    saveZohoSalesOrder(salesOrder: zohoSalesOrder): Promise<zohoSalesOrder>;
    getAttachment(orderId: any): Promise<undefined>;
    OrderSummary(id: any): Promise<undefined>;
    salesOrderPackages(id: any): Promise<undefined>;
    salesOrderBill(id: any): Promise<undefined>;
    salesOrderInvoice(id: any): Promise<undefined>;
    allOrderInvoices(salesOrderRefNumber: string): Promise<any>;
    allPurchaseOrders(salesOrderRefNumber: string): Promise<any>;
}
