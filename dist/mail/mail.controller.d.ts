import { User } from './../users/user.entity';
import { Team } from './../team/team.entity';
import { Repository } from 'typeorm';
import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    private readonly userRepository;
    private readonly TeamRepository;
    constructor(mailService: MailService, userRepository: Repository<User>, TeamRepository: Repository<Team>);
    sendMail(): void;
    test(): Promise<void>;
    customEmail(templatevars: any, mail: any, text: string, subject: string, from: string, template: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    newEmployeeEmail(users: any, mail: string, subject: string, from: string): Promise<{
        status: string;
        message: string;
        data: {};
    } | {
        status: string;
        message: string;
        data: any;
    }>;
    sendBulkEMail(body: any): Promise<void>;
    getMailTemplates(): Promise<string[]>;
    create_order(body: any, req: any): Promise<any>;
}
