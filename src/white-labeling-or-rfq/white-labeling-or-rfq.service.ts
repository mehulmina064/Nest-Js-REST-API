import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhiteLabelingOrRfq } from './white-labeling-or-rfq.entity';
import {getMongoManager} from "typeorm";
import { MailService } from '../mail/mail.service';
import { isTSImportEqualsDeclaration } from '@babel/types';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
import {HttpException,HttpStatus } from '@nestjs/common';
const http = require("https");
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class WhiteLabelingOrRfqService {
  constructor(
    @InjectRepository(WhiteLabelingOrRfq)
    private readonly whiteLabelingOrRfqRepository: Repository<WhiteLabelingOrRfq>,
    private readonly mailservice: MailService,
    private readonly mailtriggerservice: MailTriggerService,
  ) {}

  async findAll(): Promise<WhiteLabelingOrRfq[]> {
    const rfqs = this.whiteLabelingOrRfqRepository.find();
    
    return rfqs;
  }
  
  async findTypeByUser(type, userId): Promise<WhiteLabelingOrRfq[]> {
    return await this.whiteLabelingOrRfqRepository.find({type, userId});
  }
  async findAllByUser(userId): Promise<WhiteLabelingOrRfq[]> {
    return await this.whiteLabelingOrRfqRepository.find({ userId});
  }

  async findOne(id: string): Promise<WhiteLabelingOrRfq> {
    return await this.whiteLabelingOrRfqRepository.findOne(id);
  }

  async save(WhiteLabelingOrRfq: WhiteLabelingOrRfq) {
    const createdwhiteLabelingOrRfq = await this.whiteLabelingOrRfqRepository.save(WhiteLabelingOrRfq)
    const name = await createdwhiteLabelingOrRfq.name;
    //send mail by mailtrigger service
    let mailOptions = {
      TriggerName: 'rfqSubmit',
      doc: createdwhiteLabelingOrRfq,
      templatevars:{
            name:name,
            companyname:createdwhiteLabelingOrRfq.organisation,
            email:createdwhiteLabelingOrRfq.workEmail,
            file:createdwhiteLabelingOrRfq.file,
            products:JSON.stringify(createdwhiteLabelingOrRfq.products),
            number:createdwhiteLabelingOrRfq.mobileNumber
      }
    }
    this.mailtriggerservice.SendMail(mailOptions);

    // var mailOptions = [{
    //   from: 'noreply@prodo.in',
    //   to: ['sameen@prodo.in','sales@prodo.in'],
    //   subject: `RFQ Submitted`,
    //   templatevars:{
    //     name:name,
    //     companyname:createdwhiteLabelingOrRfq.organisation,
    //     email:createdwhiteLabelingOrRfq.workEmail,
    //     file:createdwhiteLabelingOrRfq.file,
    //     products:JSON.stringify(createdwhiteLabelingOrRfq.products),
    //     number:createdwhiteLabelingOrRfq.mobileNumber
    //   },
    //   template:'rfq'
    // },   
    // await mailOptions.forEach( async (option)=>{
    //    await this.mailservice.sendMailWithTemplate(option)
    // })
    return createdwhiteLabelingOrRfq;
  }
  async update(id, whiteLabelingOrRfq: Partial<WhiteLabelingOrRfq>) {
    await this.whiteLabelingOrRfqRepository.update(id, whiteLabelingOrRfq)
    return this.whiteLabelingOrRfqRepository.findOne(id);
  }

  async remove(id) {
    const user = this.whiteLabelingOrRfqRepository.findOne(id).then(result => {
      this.whiteLabelingOrRfqRepository.delete(result);
    });
  }
}
