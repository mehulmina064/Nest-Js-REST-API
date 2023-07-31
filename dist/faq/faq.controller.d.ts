import { FaqService } from './faq.service';
import { Faq } from './faq.entity';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    findAll(): Promise<Faq[]>;
    findAllByType(type: string): Promise<Faq[]>;
    findOne(id: string): Promise<Faq>;
    save(faq: Faq): Promise<Faq>;
    update(id: string, faq: Faq): Promise<import("typeorm").UpdateResult>;
    delete(id: any): Promise<void>;
}
