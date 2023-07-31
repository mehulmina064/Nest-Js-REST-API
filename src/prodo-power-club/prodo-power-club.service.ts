import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { ProdoPowerClub } from './prodo-power-club.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class ProdoPowerClubService {
  constructor(
    @InjectRepository(ProdoPowerClub)
    private readonly prodoPowerClubRepository: Repository<ProdoPowerClub>,
    private readonly mailservice: MailService,
    private readonly mailTriggerService: MailTriggerService
  ) {}

  async findAll(): Promise<ProdoPowerClub[]> {
    return await this.prodoPowerClubRepository.find();
  }

  async findOne(id: string): Promise<ProdoPowerClub> {
    return await this.prodoPowerClubRepository.findOne(id);
  }

  async save(prodoPowerClub: ProdoPowerClub) {
    const powerClub = await this.prodoPowerClubRepository.save(prodoPowerClub);
    let mailOptions = {
      TriggerName: 'newPowerClubMember',
      doc: prodoPowerClub,
      templatevars:{
        Member: prodoPowerClub,
        clientContext: 'Thank you for your interest in Prodo Power Club. We will be in touch shortly.',
        prodoContext : 'Hello Team we have new Prodo Power Club Member .'
      }
    }
    this.mailTriggerService.SendMail(mailOptions);
  //   var mailOptions =[ {
  //     from: 'noreply@prodo.in',
  //     to: powerClub.email,
  //     subject: `Hello ${powerClub.name}, Welcome to Prodo Power Club`,
  //     templatevars:{
  //       name:powerClub.name,
  //       email:powerClub.email,
  //       mobileNumber:powerClub.mobileNumber,
  //       capacity:powerClub.capacity,
  //       productDetails:powerClub.productDetails,
  //       unitLocations:powerClub.unitLocations,
  //       context:`<p>Thank you for your interest in Prodo Power Club. We will get back to you shortly.</p>`
  //     },
  //     template:'ProdoPartner'
  //   },
  //   {
  //     from: 'noreply@prodo.in',
  //     to: ['sales@prodo.in','sameen@prodo.in'],
  //     subject: `Hello Team we have new Prodo Partner ${powerClub.name}`,
  //     templatevars:{
  //           name:powerClub.name,
  //           email:powerClub.email,
  //           mobileNumber:powerClub.mobileNumber,
  //           capacity:powerClub.capacity,
  //           productDetails:powerClub.productDetails,
  //           unitLocations:powerClub.unitLocations,
  //           context: 'Hello Team we have new Prodo Partner'
  //     },
  //     template:'ProdoPartner'
  //   }
  // ]

    // mailOptions.forEach( async(option)=>{
    //   await this.mailservice.sendMailWithTemplate(option)
    // });
    return powerClub;
  }

  async remove(id) {
    const user = this.prodoPowerClubRepository.findOne(id).then(result => {
      this.prodoPowerClubRepository.delete(result);
    });
  }
}
