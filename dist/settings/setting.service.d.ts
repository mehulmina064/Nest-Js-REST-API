import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
export declare class SettingService {
    private readonly settingRepository;
    constructor(settingRepository: Repository<Setting>);
    findAll(): Promise<Setting[]>;
    findOne(id: string): Promise<Setting>;
    save(category: Setting): Promise<Setting>;
    remove(id: any): Promise<void>;
}
