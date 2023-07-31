import { Repository } from 'typeorm';
import { batch } from './batch.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class batchService {
    private readonly batchRepository;
    private readonly zohoTokenRepository;
    constructor(batchRepository: Repository<batch>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: batch): Promise<batch>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<batch>): Promise<batch>;
    findAll(query?: any): Promise<{
        data: batch[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
