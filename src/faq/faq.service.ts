import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async findAll(): Promise<Faq[]> {
    return await this.faqRepository.find();
  }

  async findAllByType(type: string): Promise<Faq[]> {
    return await this.faqRepository.find({ type });
  }

  async findOne(id: string): Promise<Faq> {
    return await this.faqRepository.findOne(id);
  }

  async save(faq: Faq) {
    return await this.faqRepository.save(faq);
  }

  async update(id: string, faq: Faq) {
    return await this.faqRepository.update(id, faq);
  }

  async remove(id) {
    const user = this.faqRepository.findOne(id).then(result => {
      this.faqRepository.delete(result);
    });
  }
}
