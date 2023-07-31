import { Repository } from 'typeorm';
import { parentSku } from './parentSku.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class parentSkuService {
    private readonly parentSkueRepository;
    private readonly zohoTokenRepository;
    constructor(parentSkueRepository: Repository<parentSku>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: parentSku): Promise<parentSku>;
    softRemove(id: string, userId: string): Promise<parentSku>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<parentSku>): Promise<parentSku>;
    findAll(query?: any): Promise<{
        data: parentSku[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
