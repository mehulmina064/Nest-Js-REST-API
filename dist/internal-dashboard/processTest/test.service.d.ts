import { Repository } from 'typeorm';
import { Test } from './test.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class TestService {
    private readonly processTestRepository;
    private readonly zohoTokenRepository;
    constructor(processTestRepository: Repository<Test>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: Test): Promise<Test>;
    softRemove(id: string, userId: string): Promise<Test>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<Test>): Promise<Test>;
    findAll(query?: any): Promise<{
        data: Test[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    addTestValues(id: string, userId: string, testValues: any): Promise<any>;
    editTestValues(id: string, userId: string, testValues: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
