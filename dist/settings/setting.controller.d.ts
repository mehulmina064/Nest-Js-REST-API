import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    findAll(): Promise<Setting[]>;
    findOne(id: string): Promise<Setting>;
    save(category: Setting): Promise<Setting>;
    delete(id: any): Promise<void>;
}
