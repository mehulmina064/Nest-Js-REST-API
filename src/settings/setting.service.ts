import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.find();
  }

  async findOne(id: string): Promise<Setting> {
    return await this.settingRepository.findOne(id);
  }

  async save(category: Setting) {
    return await this.settingRepository.save(category);
  }

  async remove(id) {
    const user = this.settingRepository.findOne(id).then(result => {
      this.settingRepository.delete(result);
    });
  }
}
