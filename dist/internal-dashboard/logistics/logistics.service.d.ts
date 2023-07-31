import { Repository } from 'typeorm';
import { logistics } from './logistics.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class logisticsService {
    private readonly logisticRepository;
    private readonly zohoTokenRepository;
    constructor(logisticRepository: Repository<logistics>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: logistics): Promise<logistics>;
    softRemove(id: string, userId: string): Promise<logistics>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<logistics>): Promise<logistics>;
    findAll(query?: any): Promise<{
        data: logistics[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
