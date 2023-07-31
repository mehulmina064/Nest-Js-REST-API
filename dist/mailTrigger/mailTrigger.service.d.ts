import { Repository } from 'typeorm';
import { MailTrigger } from './mailTrigger.entity';
import { MailService } from './../mail/mail.service';
import { Team } from './../team/team.entity';
export declare class MailTriggerService {
    private readonly MailTriggerRepository;
    private readonly mailService;
    private readonly teamRepository;
    constructor(MailTriggerRepository: Repository<MailTrigger>, mailService: MailService, teamRepository: Repository<Team>);
    findAll(): Promise<MailTrigger[]>;
    findOne(id: string): Promise<MailTrigger>;
    save(mailTrigger: MailTrigger): Promise<MailTrigger>;
    update(id: string, mailTrigger: MailTrigger): Promise<MailTrigger>;
    remove(id: string): Promise<void>;
    findByName(name: string): Promise<MailTrigger>;
    SendMail(Data: any): Promise<void>;
    getTeams(id: string): Promise<Team[]>;
    removeTeam(id: string, team: string): Promise<void>;
    addTeam(id: string, team: string): Promise<void>;
    addBulkTeams(id: string, teams: string[]): Promise<void>;
    removeBulkTeams(id: string, teams: string[]): Promise<void>;
    removeTeamFromAll(team: string): Promise<void>;
}
