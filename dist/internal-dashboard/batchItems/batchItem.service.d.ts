import { Repository } from 'typeorm';
import { BatchItem } from './batchItem.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class batchItemService {
    private readonly batchItemRepository;
    private readonly zohoTokenRepository;
    constructor(batchItemRepository: Repository<BatchItem>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: BatchItem): Promise<BatchItem>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<BatchItem>): Promise<BatchItem>;
    findAll(query?: any): Promise<{
        data: BatchItem[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
