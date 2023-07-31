import { Repository } from 'typeorm';
import { prodoPermissionGroup } from './prodoPermissionGroup.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class prodoPermissionService {
    private readonly prodoPermissionGroupRepository;
    private readonly zohoTokenRepository;
    constructor(prodoPermissionGroupRepository: Repository<prodoPermissionGroup>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: prodoPermissionGroup): Promise<prodoPermissionGroup>;
    softRemove(id: string, userId: string): Promise<prodoPermissionGroup>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<prodoPermissionGroup>): Promise<prodoPermissionGroup>;
    findAll(query?: any): Promise<{
        data: prodoPermissionGroup[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    addPermissions(id: string, userId: string, permissions: any): Promise<any>;
    editPermissions(id: string, userId: string, permissions: any): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
