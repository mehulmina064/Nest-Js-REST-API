/// <reference types="node" />
import { User } from './../users/user.entity';
import { SmsService } from './sms.service';
import { Repository } from 'typeorm';
import { UserService } from './../users/user.service';
import { zohoToken } from './token.entity';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
import { zohoSalesOrderByUser } from './zohoSalesOrderByUser.entity';
import { ProductService } from './../product/product.service';
export declare class SmsController {
    private readonly userRepository;
    private readonly zohoTokenRepository;
    private readonly zohoSalesOrderRepository;
    private readonly zohoSalesOrderByUserRepository;
    private readonly SmsService;
    private readonly userService;
    private readonly productService;
    constructor(userRepository: Repository<User>, zohoTokenRepository: Repository<zohoToken>, zohoSalesOrderRepository: Repository<zohoSalesOrder>, zohoSalesOrderByUserRepository: Repository<zohoSalesOrderByUser>, SmsService: SmsService, userService: UserService, productService: ProductService);
    sendOtp(body: any): Promise<void>;
    verifyOtp(body: any): Promise<void>;
    resendOtp(body: any): Promise<void>;
    sendSms(body: any): Promise<{
        type: string;
        message: string;
    }>;
    sendBulkSms(req: any): Promise<{
        type: string;
        message: string;
    }>;
    test(): Promise<any>;
    productMapByAPI(body: any): Promise<{}>;
    userSendOtp(req: any): Promise<{
        type: string;
        message: string;
    }>;
    userVerifyOtp(req: any): Promise<void>;
    userResendOtp(req: any): Promise<{
        type: string;
        message: string;
    }>;
    productMap(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{}>;
    productMap1(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{}>;
    zohoToken(): Promise<string>;
    zohoCrmProduct(item: any, token: string): Promise<any>;
    test1(): Promise<any[]>;
    zohoBookToken(): Promise<string>;
    zohoBookProduct(item: any, token: string): Promise<"INVALID_TOKEN" | {
        itemSku: any;
        status: string;
        message?: undefined;
        item?: undefined;
        details?: undefined;
    } | {
        itemSku: any;
        message: any;
        status: string;
        item?: undefined;
        details?: undefined;
    } | {
        itemSku: any;
        message: any;
        item: any;
        status: string;
        details?: undefined;
    } | {
        itemSku: any;
        message: any;
        details: string;
        item: any;
        status: string;
    } | {
        itemSku: any;
        message: any;
        details: string;
        status: string;
        item?: undefined;
    }>;
    bookproductMapVar(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    }>;
    bookproductMap(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    }>;
    bookproductMap1(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    }>;
    zohoBooks(): Promise<{
        Products_Added: number;
        Products_Updated: number;
        failed: number;
        Response: {
            res: string | {
                itemSku: any;
                status: string;
                message?: undefined;
                item?: undefined;
                details?: undefined;
            } | {
                itemSku: any;
                message: any;
                status: string;
                item?: undefined;
                details?: undefined;
            } | {
                itemSku: any;
                message: any;
                item: any;
                status: string;
                details?: undefined;
            } | {
                itemSku: any;
                message: any;
                details: string;
                item: any;
                status: string;
            } | {
                itemSku: any;
                message: any;
                details: string;
                status: string;
                item?: undefined;
            };
            level: string;
        }[];
    }>;
    zohoBookTokenFarji(): Promise<any>;
    newZohoBookTokenFarji(): Promise<string>;
    zohoBookSalesOrder(req: any): Promise<any[] | "NO_DATA">;
    zohoBookPurchaseOrder(): Promise<any[]>;
    SalesOrderByID(id: any): Promise<any>;
    zohoBookSalesOrderByID(id: string): Promise<any>;
    PurchaseOrderByID(id: any): Promise<any>;
    zohoBookPurchaseOrderByID(id: string): Promise<any>;
    zohoInventorySalesOrderSave(): Promise<"NO_DATA" | (import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
        orderDetails: any;
        zohoId: any;
    } & zohoSalesOrder))[]>;
    conectPoc(): Promise<"NO_DATA" | (string | (import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
        email: any;
        orderIds: any[];
    } & zohoSalesOrderByUser))[])[]>;
    addordersToAdmin(id: any): Promise<import("typeorm/query-builder/result/UpdateResult").UpdateResult>;
    updatePocOnSalesOrder(id: any, salesOrder: any): Promise<(import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
        email: any;
        orderIds: any[];
    } & zohoSalesOrderByUser))[]>;
    zohoInventorySalesOrder(req: any): Promise<any[]>;
    InventorySalesOrderByID(id: any): Promise<any>;
    setItemPrice(lineItems: any, date: any): Promise<any>;
    itemDetails(lineItem: any, data: any): Promise<string>;
    calShipment(lineItems: any, packages: any): Promise<any>;
    itemStatus(lineItems: any, salesOrder: any): Promise<any>;
    calculateStatus(lineItem: any): Promise<"Delivered" | "Quality Check" | "In Transit[Fully Shipped]" | " In Transit[Fully packed]" | "In Transit[Partially Shipped]" | "In Transit[Partially Packed]">;
    packageDetails(id: any): Promise<any>;
    order_invoice(id: string, res1: any): Promise<Buffer>;
    order_summery(id: string, res1: any): Promise<Buffer>;
    order_package(id: string, res1: any): Promise<Buffer>;
    order_bill(id: string, res1: any): Promise<Buffer>;
    order_po(id: string, res1: any): Promise<Buffer>;
    create_order(body: any, req: any): Promise<any>;
    newTokenForReorder(): Promise<string>;
    reOrderDetails(salesOrder: any): Promise<any>;
    saveReOrder(id: any, sales: any): Promise<string[] | "NO_DATA saved in prodo" | ({
        orderDetails: any;
        zohoId: any;
    } & zohoSalesOrder)[]>;
    schedule(): Promise<void>;
    all_data(req: any): Promise<any>;
    all_data1(): Promise<(import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
        userId: string;
        data: {
            orders: {
                total: number;
                completed: number;
                inProgress: number;
                submitted: number;
                cancelled: number;
            };
            rfq: {
                approved: number;
                rejected: number;
                inProgress: number;
                total_submitted: number;
            };
            payments: {
                total: number;
                paid: number;
                due: number;
            };
            pieChart: never[];
            barChart: never[];
        };
    } & import("../users/dashboardData.entity").dashboardData))[]>;
    updateSalesOrder(body: any): Promise<any>;
}
