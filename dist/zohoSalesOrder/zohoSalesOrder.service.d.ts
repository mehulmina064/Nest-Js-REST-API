import { Repository } from 'typeorm';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
import { UserService } from './../users/user.service';
import { zohoToken } from './../sms/token.entity';
import { ProductService } from './../product/product.service';
import { entitiesService } from './../entities/entities.service';
import { OrganizationService } from "./../organization/organization.service";
import { companyService } from "./../company/company.service";
import { invoicePodService } from './../invoice-pod/invoicePod.service';
export declare class zohoSalesOrderService {
    private readonly zohoSalesOrderRepository;
    private readonly zohoTokenRepository;
    private readonly userService;
    private readonly productService;
    private readonly entitiesService;
    private readonly organizationService;
    private readonly companyService;
    private readonly invoicePodService;
    constructor(zohoSalesOrderRepository: Repository<zohoSalesOrder>, zohoTokenRepository: Repository<zohoToken>, userService: UserService, productService: ProductService, entitiesService: entitiesService, organizationService: OrganizationService, companyService: companyService, invoicePodService: invoicePodService);
    findAll(query?: any): Promise<{
        data: zohoSalesOrder[];
        count: number;
    }>;
    findOne(id: string): Promise<zohoSalesOrder>;
    ByReferenceNumber(rf: string): Promise<zohoSalesOrder>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    InventorySalesOrderByID(id: any): Promise<any>;
    updateLineItemCal(element: any, packages: any): Promise<any>;
    calShipment(lineItems: any, packages: any): Promise<any>;
    updateLineItemPrice(item1: any, date: any): Promise<any>;
    setItemPrice(lineItems: any, date: any): Promise<any>;
    itemDetails(lineItem: any, data: any): Promise<string>;
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
    mapData(salesOrder: any, customer: any): Promise<{
        salesOrder: {};
        organization: {};
        company: {};
        entity: {};
        status: boolean;
    }>;
    saveZohoSalesOrder(salesOrder: zohoSalesOrder): Promise<zohoSalesOrder>;
    saveFromZohoId(id: any, page?: number): Promise<{
        error: string;
        mapData: {
            salesOrder: {};
            organization: {};
            company: {};
            entity: {};
            status: boolean;
        };
        salesOrderId?: undefined;
        organizationId?: undefined;
        companyId?: undefined;
        entityid?: undefined;
        users?: undefined;
    } | {
        salesOrderId: any;
        organizationId: any;
        companyId: any;
        entityid: any;
        users: {
            [x: number]: any;
        }[];
        "error"?: undefined;
        mapData?: undefined;
    }>;
    getAttachment(orderId: any): Promise<undefined>;
    OrderSummary(id: any): Promise<undefined>;
    salesOrderPackages(id: any): Promise<undefined>;
    salesOrderBill(id: any): Promise<undefined>;
    salesOrderInvoice(id: any): Promise<undefined>;
    calDashboardData(data: any, salesOrders: any): Promise<any>;
    dataUpdate(data: any, orders: any): Promise<{}>;
    allOrderInvoices(salesOrderRefNumber: string): Promise<any>;
    allPurchaseOrders(salesOrderRefNumber: string): Promise<any>;
    invoiceAllDetails(id: any, po: boolean): Promise<any>;
    allShipments(salesOrder: any): Promise<void>;
    notYetShipped(r: any): Promise<{
        data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        count: 10;
    }>;
}
