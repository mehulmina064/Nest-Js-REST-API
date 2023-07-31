import { ContactFormService } from './contact-form.service';
import { ContactForm } from './contact-form.entity';
export declare class ContactFormController {
    private readonly contactFormService;
    constructor(contactFormService: ContactFormService);
    findAll(): Promise<ContactForm[]>;
    findAllByType(type: string): Promise<ContactForm[]>;
    findOne(id: string): Promise<ContactForm>;
    save(Form: ContactForm): Promise<ContactForm>;
    update(id: string, Form: ContactForm): Promise<import("typeorm").UpdateResult>;
    delete(id: any): Promise<void>;
}
