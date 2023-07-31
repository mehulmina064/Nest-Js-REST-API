/// <reference types="node" />
import { User } from './../users/user.entity';
import { Repository } from 'typeorm';
import { zohoPurchaseOrderService } from './zohoPurchaseOrder.service';
export declare class zohoPurchaseOrderController {
    private readonly userRepository;
    private readonly zohoPurchaseOrderService;
    constructor(userRepository: Repository<User>, zohoPurchaseOrderService: zohoPurchaseOrderService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./zohoPurchaseOrder.entity").zohoPurchaseOrder[];
    }>;
    updateSalesOrder(id: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./zohoPurchaseOrder.entity").zohoPurchaseOrder;
    }>;
    updateSalesOrders(start: any): Promise<({
        purchaseorder_id: any;
        response: import("./zohoPurchaseOrder.entity").zohoPurchaseOrder;
        statusCode: number;
        message: string;
        number: any;
        "error"?: undefined;
    } | {
        purchaseorder_id: any;
        error: string;
        statusCode: number;
        message: string;
        number: any;
        response?: undefined;
    })[]>;
    zohoAllSo(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOnePo(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachment(purchaseOrderId: any, res: any): Promise<Buffer>;
    OrderSummary(purchaseOrderId: any, res: any): Promise<Buffer>;
}
