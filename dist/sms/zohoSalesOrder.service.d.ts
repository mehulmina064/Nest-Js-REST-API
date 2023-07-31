import { Repository } from 'typeorm';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
export declare class zohoSalesOrderService {
    private readonly zohoSalesOrderRepository;
    constructor(zohoSalesOrderRepository: Repository<zohoSalesOrder>);
    zohoBookTokenFarji(): Promise<any>;
    findall(): Promise<zohoSalesOrder[]>;
    newZohoBookTokenFarji(): Promise<string>;
    InventorySalesOrderByID(id: any): Promise<any>;
    setItemPrice(lineItems: any, date: any): Promise<any>;
    itemDetails(lineItem: any, data: any): Promise<string>;
    calShipment(lineItems: any, packages: any): Promise<any>;
    itemStatus(lineItems: any, salesOrder: any): Promise<any>;
    calculateStatus(lineItem: any): Promise<"Delivered" | "Quality Check" | "In Transit[Fully Shipped]" | " In Transit[Fully packed]" | "In Transit[Partially Shipped]" | "In Transit[Partially Packed]">;
    packageDetails(id: any): Promise<any>;
}
