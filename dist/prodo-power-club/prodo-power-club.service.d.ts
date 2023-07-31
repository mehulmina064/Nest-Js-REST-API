import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { ProdoPowerClub } from './prodo-power-club.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class ProdoPowerClubService {
    private readonly prodoPowerClubRepository;
    private readonly mailservice;
    private readonly mailTriggerService;
    constructor(prodoPowerClubRepository: Repository<ProdoPowerClub>, mailservice: MailService, mailTriggerService: MailTriggerService);
    findAll(): Promise<ProdoPowerClub[]>;
    findOne(id: string): Promise<ProdoPowerClub>;
    save(prodoPowerClub: ProdoPowerClub): Promise<ProdoPowerClub>;
    remove(id: any): Promise<void>;
}
