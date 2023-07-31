import { Repository } from 'typeorm';
import { SmsTemplate } from './sms.entity';
export declare class SmsService {
    private readonly SmsTemplateRepository;
    constructor(SmsTemplateRepository: Repository<SmsTemplate>);
    findAll(): Promise<SmsTemplate[]>;
    findOne(id: string): Promise<SmsTemplate>;
    update(id: string, SmsTemplate: SmsTemplate): Promise<SmsTemplate>;
    remove(id: string): Promise<void>;
    save(SmsTemplate: SmsTemplate): Promise<SmsTemplate>;
    saveData(SmsTemplate: SmsTemplate): Promise<void>;
}
