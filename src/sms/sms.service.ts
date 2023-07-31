import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import {SmsTemplate} from './sms.entity'

@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(SmsTemplate)
    private readonly SmsTemplateRepository: Repository<SmsTemplate>,
) { }
  async findAll(): Promise<SmsTemplate[]> {
    return this.SmsTemplateRepository.find();
  }
  async findOne(id: string): Promise<SmsTemplate> {
    return this.SmsTemplateRepository.findOne(id);
  }
  async update(id: string, SmsTemplate: SmsTemplate): Promise<SmsTemplate> {
    return this.SmsTemplateRepository.update(id, SmsTemplate);
  }
  async remove(id: string): Promise<void> {
    await this.SmsTemplateRepository.delete(id);
  }
  async save(SmsTemplate:SmsTemplate){
    return this.SmsTemplateRepository.save(SmsTemplate);
  }

  async saveData(SmsTemplate:SmsTemplate){
    console.log("number in service-",SmsTemplate)
    // this.SmsTemplateRepository.save(SmsTemplate);
  }

}
