import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
import { UserService } from './../users/user.service';
export declare class TeamService {
    private readonly TeamRepository;
    private readonly mailTriggerService;
    private readonly userService;
    constructor(TeamRepository: Repository<Team>, mailTriggerService: MailTriggerService, userService: UserService);
    findAll(): Promise<Team[]>;
    findOne(id: string): Promise<Team>;
    save(team: Team): Promise<Team>;
    update(id: string, team: Team): Promise<Team>;
    getTeamMembers(id: string): Promise<any>;
    removeMember(id: string, userEmail: string): Promise<void>;
    addMember(id: string, userEmail: string): Promise<void>;
    addBulkMember(id: string, userEmails: string[]): Promise<any>;
    removeBulkMember(id: string, userEmails: string[]): Promise<void>;
    remove(id: string): Promise<void>;
}
