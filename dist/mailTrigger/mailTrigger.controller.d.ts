import { Team } from './../team/team.entity';
import { MailTrigger } from './mailTrigger.entity';
import { MailTriggerService } from './mailTrigger.service';
import { MailService } from './../mail/mail.service';
import { Repository } from 'typeorm';
export declare class MailTriggerController {
    private readonly teamRepository;
    private readonly mailTriggerService;
    private readonly mailService;
    constructor(teamRepository: Repository<Team>, mailTriggerService: MailTriggerService, mailService: MailService);
    findAll(): Promise<MailTrigger[]>;
    findOne(id: string): Promise<MailTrigger>;
    save(mailTrigger: MailTrigger): Promise<MailTrigger>;
    update(id: string, mailTrigger: MailTrigger): Promise<MailTrigger>;
    delete(id: string): Promise<void>;
    findMembers(id: string): Promise<Team[]>;
    removeMember(id: string, teamName: string): Promise<void>;
    addMember(id: string, teamId: string): Promise<void>;
    addMembers(id: string, teamIds: string[]): Promise<void>;
    removeMembers(id: string, teamIds: string[]): Promise<void>;
}
