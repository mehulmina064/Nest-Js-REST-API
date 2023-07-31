import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { ContactForm } from './contact-form.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class ContactFormService {
    private readonly FormRepository;
    private readonly mailservice;
    private readonly mailTriggerService;
    constructor(FormRepository: Repository<ContactForm>, mailservice: MailService, mailTriggerService: MailTriggerService);
    findAll(): Promise<ContactForm[]>;
    findAllByType(type: string): Promise<ContactForm[]>;
    findOne(id: string): Promise<ContactForm>;
    save(Form: ContactForm): Promise<ContactForm>;
    update(id: string, ContactForm: ContactForm): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<void>;
}
