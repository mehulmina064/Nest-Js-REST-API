import { Repository } from 'typeorm';
import { process } from './process.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class processService {
    private readonly processRepository;
    private readonly zohoTokenRepository;
    constructor(processRepository: Repository<process>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: process): Promise<process>;
    softRemove(id: string, userId: string): Promise<process>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<process>): Promise<process>;
    findAll(query?: any): Promise<{
        data: process[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
