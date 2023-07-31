import { Repository } from 'typeorm';
import { internalTeam } from './team.entity';
import { zohoToken } from '../../sms/token.entity';
import { CreateTeamDto } from './team.dto';
export declare class internalTeamService {
    private readonly teamRepository;
    private readonly zohoTokenRepository;
    constructor(teamRepository: Repository<internalTeam>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(role: CreateTeamDto): Promise<CreateTeamDto & internalTeam>;
    softRemove(id: string, userId: string): Promise<internalTeam>;
    hardRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<internalTeam>): Promise<internalTeam>;
    findAll(query?: any): Promise<{
        data: internalTeam[];
        count: number;
    }>;
    check(id: string): Promise<any>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
}
