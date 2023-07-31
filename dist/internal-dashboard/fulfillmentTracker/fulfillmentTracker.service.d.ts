import { Repository } from 'typeorm';
import { FulfillmentTracker } from './fulfillmentTracker.entity';
import { zohoSalesOrder } from '../../zohoSalesOrder/zohoSalesOrder.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class fulfillmentTrackerService {
    private readonly fulfillmentRepository;
    private readonly zohoTokenRepository;
    constructor(fulfillmentRepository: Repository<FulfillmentTracker>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: FulfillmentTracker): Promise<FulfillmentTracker>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<FulfillmentTracker>): Promise<FulfillmentTracker>;
    findAll(query?: any): Promise<{
        data: FulfillmentTracker[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    findBySalesOrder(id: string): Promise<false | FulfillmentTracker>;
    saveBySalesOrder(salesOrder: zohoSalesOrder): Promise<FulfillmentTracker>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
