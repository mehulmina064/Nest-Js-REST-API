import { Repository } from 'typeorm';
import { WhiteLabelingOrRfq } from './white-labeling-or-rfq.entity';
import { MailService } from '../mail/mail.service';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class WhiteLabelingOrRfqService {
    private readonly whiteLabelingOrRfqRepository;
    private readonly mailservice;
    private readonly mailtriggerservice;
    constructor(whiteLabelingOrRfqRepository: Repository<WhiteLabelingOrRfq>, mailservice: MailService, mailtriggerservice: MailTriggerService);
    findAll(): Promise<WhiteLabelingOrRfq[]>;
    findTypeByUser(type: any, userId: any): Promise<WhiteLabelingOrRfq[]>;
    findAllByUser(userId: any): Promise<WhiteLabelingOrRfq[]>;
    findOne(id: string): Promise<WhiteLabelingOrRfq>;
    save(WhiteLabelingOrRfq: WhiteLabelingOrRfq): Promise<WhiteLabelingOrRfq>;
    update(id: any, whiteLabelingOrRfq: Partial<WhiteLabelingOrRfq>): Promise<WhiteLabelingOrRfq | null>;
    remove(id: any): Promise<void>;
}
