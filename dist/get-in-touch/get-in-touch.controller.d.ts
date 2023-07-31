import { MailService } from '../mail/mail.service';
import { GetInTouchService } from './get-in-touch.service';
import { GetInTouch } from './get-in-touch.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class GetInTouchController {
    private readonly getInTouchService;
    private readonly mailService;
    private readonly mailTriggerService;
    constructor(getInTouchService: GetInTouchService, mailService: MailService, mailTriggerService: MailTriggerService);
    findAll(): Promise<GetInTouch[]>;
    findOne(id: string): Promise<GetInTouch>;
    generateTicket(getInTouch: GetInTouch): Promise<{
        Ticket: any;
        GetInTouch: GetInTouch;
    }>;
    delete(id: any): Promise<void>;
}
