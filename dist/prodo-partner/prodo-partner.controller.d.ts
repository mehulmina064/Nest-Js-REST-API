import { MailService } from './../mail/mail.service';
import { ProdoPartnerService } from './prodo-partner.service';
import { ProdoPartner } from './prodo-partner.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class ProdoPartnerController {
    private readonly prodoPartnerService;
    private readonly mailService;
    private readonly mailTriggerService;
    constructor(prodoPartnerService: ProdoPartnerService, mailService: MailService, mailTriggerService: MailTriggerService);
    findAll(): Promise<ProdoPartner[]>;
    findOne(id: string): Promise<ProdoPartner>;
    save(prodoPartner: ProdoPartner): Promise<ProdoPartner>;
    delete(id: any): Promise<void>;
}
