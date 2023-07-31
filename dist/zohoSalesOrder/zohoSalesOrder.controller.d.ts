/// <reference types="node" />
import { User } from './../users/user.entity';
import { Repository } from 'typeorm';
import { zohoSalesOrderService } from './zohoSalesOrder.service';
export declare class zohoSalesOrderController {
    private readonly userRepository;
    private readonly zohoSalesOrderService;
    constructor(userRepository: Repository<User>, zohoSalesOrderService: zohoSalesOrderService);
    findAll(req: any, search?: string, status?: string, all?: string, limit?: number, byOrganization?: string, byCompany?: string, byEntity?: string, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./zohoSalesOrder.entity").zohoSalesOrder[];
    }>;
    orderHistory(req: any, search?: string, status?: string, all?: string, limit?: number, byOrganization?: string, byCompany?: string, byEntity?: string, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./zohoSalesOrder.entity").zohoSalesOrder[];
    }>;
    notYetShipped(req: any, search?: string, status?: string, all?: string, limit?: number, byOrganization?: string, byCompany?: string, byEntity?: string, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: 10;
        limit: number;
        page: number;
        data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    }>;
    OneSo(id: any, req: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./zohoSalesOrder.entity").zohoSalesOrder;
    }>;
    all_data(req: any): Promise<any>;
    updateSalesOrder(id: any): Promise<{
        statusCode: number;
        message: string;
        data: {
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
        };
    }>;
    updSalesOrder(id: any): Promise<{
        statusCode: number;
        message: string;
        data: {
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
        };
    }>;
    updateSalesOrders(start: any): Promise<({
        salesorder_id: any;
        response: {
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
        };
        statusCode: number;
        message: string;
        number: any;
        page: number;
        "error"?: undefined;
    } | {
        salesorder_id: any;
        error: string;
        statusCode: number;
        message: string;
        number: any;
        page: number;
        response?: undefined;
    })[]>;
    zohoAllSo(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOneSo(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachment(salesOrderId: any, res: any): Promise<Buffer>;
    OrderSummary(salesOrderId: any, res: any): Promise<Buffer>;
    salesOrderPackages(packageIds: any, res: any): Promise<Buffer>;
    salesOrderBill(billId: any, res: any): Promise<Buffer>;
    salesOrderInvoice(invoiceId: any, res: any): Promise<Buffer>;
    invoiceAllDetails(orderIds: any, purchaseOrder: boolean): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
}
