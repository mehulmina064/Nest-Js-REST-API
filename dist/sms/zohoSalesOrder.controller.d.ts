import { User } from './../users/user.entity';
import { SmsService } from './sms.service';
import { Repository } from 'typeorm';
import { UserService } from './../users/user.service';
import { zohoToken } from './token.entity';
import { zohoSalesOrderService } from './zohoSalesOrder.service';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
import { zohoSalesOrderByUser } from './zohoSalesOrderByUser.entity';
import { ProductService } from './../product/product.service';
export declare class zohoSalesOrderController {
    private readonly userRepository;
    private readonly zohoTokenRepository;
    private readonly zohoSalesOrderRepository;
    private readonly zohoSalesOrderByUserRepository;
    private readonly SmsService;
    private readonly userService;
    private readonly productService;
    private readonly zohoSalesOrderService;
    constructor(userRepository: Repository<User>, zohoTokenRepository: Repository<zohoToken>, zohoSalesOrderRepository: Repository<zohoSalesOrder>, zohoSalesOrderByUserRepository: Repository<zohoSalesOrderByUser>, SmsService: SmsService, userService: UserService, productService: ProductService, zohoSalesOrderService: zohoSalesOrderService);
    AddressBySo(): Promise<any[]>;
    updateSalesOrder(body: any): Promise<string[] | "false" | "NO_DATA saved in prodo" | {
        orderDetails: any;
        zohoId: any;
    }[] | undefined>;
    updatePocDashboard(body: any): Promise<"false" | (boolean | import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
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
    saveOrder(id: any, sales: any): Promise<string[] | "NO_DATA saved in prodo" | {
        orderDetails: any;
        zohoId: any;
    }[] | undefined>;
    updatePocOnSalesOrder(id: any, salesOrder: any): Promise<(import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
        email: any;
        orderIds: any[];
    } & zohoSalesOrderByUser))[]>;
    sync_data(email: any, salesOrder: any): Promise<false | import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
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
    } & import("../users/dashboardData.entity").dashboardData)>;
    update_order(id: any): Promise<string[] | "NO_DATA saved in prodo" | {
        orderDetails: any;
        zohoId: any;
    }[] | undefined>;
    sync_dashboard(user: any, salesOrder: any): Promise<import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
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
    } & import("../users/dashboardData.entity").dashboardData)>;
    zohoInventorySalesOrder(req: any): Promise<{}[]>;
    newTokenForReorder(): Promise<string>;
    zohoBookTokenFarji(): Promise<any>;
    newZohoBookTokenFarji(): Promise<string>;
    InventorySalesOrderByID(id: any): Promise<any>;
    setItemPrice(lineItems: any, date: any): Promise<any>;
    itemDetails(lineItem: any, data: any): Promise<string>;
    calShipment(lineItems: any, packages: any): Promise<any>;
    itemStatus(lineItems: any, salesOrder: any): Promise<any>;
    calculateStatus(lineItem: any): Promise<"Delivered" | "Quality Check" | "In Transit[Fully Shipped]" | " In Transit[Fully packed]" | "In Transit[Partially Shipped]" | "In Transit[Partially Packed]">;
    packageDetails(id: any): Promise<any>;
}
