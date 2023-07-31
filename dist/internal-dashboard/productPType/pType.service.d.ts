import { Repository } from 'typeorm';
import { productPType } from './pType.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class pTypeService {
    private readonly productPTypeRepository;
    private readonly zohoTokenRepository;
    constructor(productPTypeRepository: Repository<productPType>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: productPType): Promise<productPType>;
    softRemove(id: string, userId: string): Promise<productPType>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<productPType>): Promise<productPType>;
    findAll(query?: any): Promise<{
        data: productPType[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addFields(id: string, userId: string, fields: any): Promise<any>;
    editFields(id: string, userId: string, fields: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
