import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { ContactForm } from './contact-form.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
import {HttpException,HttpStatus } from '@nestjs/common';

@Injectable()
export class ContactFormService {
  constructor(
    @InjectRepository(ContactForm)
    private readonly FormRepository: Repository<ContactForm>,
    private readonly mailservice: MailService,
    private readonly mailTriggerService: MailTriggerService
  ) {}

  async findAll(): Promise<ContactForm[]> {
    return await this.FormRepository.find();
  }

  async findAllByType(type: string): Promise<ContactForm[]> {
    return await this.FormRepository.find({ type });
  }

  async findOne(id: string): Promise<ContactForm> {
    return await this.FormRepository.findOne(id);
  }

  async save(Form: ContactForm) {
    var form = await this.FormRepository.save(Form);
    var mailOptions = [] as any;
    if(form.type == "join_the_team"){
    //   mailOptions = [{
    //     from: 'noreply@prodo.in',
    //     to: ['sales@prodo.in','sameen@prodo.in'],
    //     subject: `${form.name} Want to join our Team`,
    //     templatevars:{
    //       name:form.name,
    //       email:form.email,
    //       mobileNumber:form.mobileNumber,
    //       linkedin:form.linkedin,
    //       file:form.file
    //     },
    //     template:'joinTheTeam'
    //   },
    // ]
    let mailOptions = {
      TriggerName: 'JoinTheTeam',
      doc: form,
      templatevars:{
        name:form.name,
        email:form.email,
        mobileNumber:form.mobileNumber,
        linkedin:form.linkedin,
        file:form.file
          },
    }
    await this.mailTriggerService.SendMail(mailOptions);
    }else{
    //   mailOptions = [{
    //     from: 'noreply@prodo.in',
    //     to: ['sales@prodo.in','sameen@prodo.in'],
    //     subject: `Sales Consultant Form Submitted By ${form.name}`,
    //     templatevars:{
    //       name:form.name,
    //       email:form.email,
    //       mobileNumber:form.mobileNumber,
    //       linkedin:form.linkedin
    //     },
    //     template:'becomeASalesConsultant'
    //   },
    // ]
      let mailOptions = {
        TriggerName: 'BecomeASalesConsultant',
        doc: form,
        templatevars:{
          name:form.name,
          email:form.email,
          mobileNumber:form.mobileNumber,
          linkedin:form.linkedin
            },
      }
      await this.mailTriggerService.SendMail(mailOptions);
    }
    
    // await mailOptions.forEach( async (option)=>{
    //   await this.mailservice.sendMailWithTemplate(option)
  //  })
    return form;
  }

  async update(id: string, ContactForm: ContactForm) {
    return await this.FormRepository.update(id, ContactForm);
  }

  async remove(id: string) {
    const user = this.FormRepository.findOne(id).then(result => {
      this.FormRepository.delete(result);
    });
  }
}
