import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
export declare class FaqService {
    private readonly faqRepository;
    constructor(faqRepository: Repository<Faq>);
    findAll(): Promise<Faq[]>;
    findAllByType(type: string): Promise<Faq[]>;
    findOne(id: string): Promise<Faq>;
    save(faq: Faq): Promise<Faq>;
    update(id: string, faq: Faq): Promise<import("typeorm").UpdateResult>;
    remove(id: any): Promise<void>;
}
