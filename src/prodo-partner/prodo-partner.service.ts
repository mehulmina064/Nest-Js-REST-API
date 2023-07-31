import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { ProdoPartner } from './prodo-partner.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class ProdoPartnerService {
  constructor(
    @InjectRepository(ProdoPartner)
    private readonly prodoPartnerRepository: Repository<ProdoPartner>,
  ) {}

  async findAll(): Promise<ProdoPartner[]> {
    return await this.prodoPartnerRepository.find();
  }

  async findOne(id: string): Promise<ProdoPartner> {
    return await this.prodoPartnerRepository.findOne(id);
  }

  async save(prodoPartner: ProdoPartner) {
    var prodo_partner = await this.prodoPartnerRepository.save(prodoPartner);
    
    return prodo_partner;
  }

  async remove(id) {
    const user = this.prodoPartnerRepository.findOne(id).then(result => {
      this.prodoPartnerRepository.delete(result);
    });
  }
}
