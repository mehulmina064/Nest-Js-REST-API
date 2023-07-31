import { Repository } from 'typeorm';
import { internalTeam } from './team.entity';
import { UserAndTeam } from './EmployeeAndTeam.entity';
import { zohoToken } from '../../sms/token.entity';
import { CreateUserTeamDto } from './team.dto';
export declare class userTeamService {
    private readonly internalTeamRepository;
    private readonly userTeamsRepository;
    private readonly zohoTokenRepository;
    constructor(internalTeamRepository: Repository<internalTeam>, userTeamsRepository: Repository<UserAndTeam>, zohoTokenRepository: Repository<zohoToken>);
    findOne(id: string): Promise<any>;
    save(team: CreateUserTeamDto): Promise<CreateUserTeamDto & UserAndTeam>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<UserAndTeam>): Promise<UserAndTeam>;
    findAll(query?: any): Promise<{
        data: UserAndTeam[];
        count: number;
    }>;
}
