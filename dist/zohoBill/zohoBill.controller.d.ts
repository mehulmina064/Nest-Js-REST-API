/// <reference types="node" />
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { zohoBillService } from './zohoBill.service';
export declare class zohoBillController {
    private readonly userRepository;
    private readonly zohoBillService;
    constructor(userRepository: Repository<User>, zohoBillService: zohoBillService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./zohoBill.entity").zohoBill[];
    }>;
    updateOne(id: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./zohoBill.entity").zohoBill;
    }>;
    updateAll(start: any): Promise<({
        bill_id: any;
        response: import("./zohoBill.entity").zohoBill;
        statusCode: number;
        message: string;
        number: any;
        "error"?: undefined;
    } | {
        bill_id: any;
        error: string;
        statusCode: number;
        message: string;
        number: any;
        response?: undefined;
    })[]>;
    zohoAll(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOne(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachment(purchaseOrderId: any, res: any): Promise<Buffer>;
    Summary(billId: any, res: any): Promise<Buffer>;
}
