import { MailOptions, MailService, sendMailWithTemplate } from './../mail/mail.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProdoPartnerService } from './prodo-partner.service';
import { ProdoPartner } from './prodo-partner.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';

@Controller('prodo-partner')
export class ProdoPartnerController {
  constructor(private readonly prodoPartnerService: ProdoPartnerService,
    private readonly mailService: MailService,
    private readonly mailTriggerService: MailTriggerService
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<ProdoPartner[]> {
    return this.prodoPartnerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prodoPartnerService.findOne(id);
  }

  @Post()
  save(@Body() prodoPartner: ProdoPartner) {
    let mailOptions = {
      TriggerName: 'newProdoPartner',
      doc: prodoPartner,
      templatevars:{
        prodoPartner: prodoPartner,
        clientContext: 'Thank you for contacting us. We will get back to you shortly.',
        prodoContext : 'New Prodo Partner Query has been Received.'
      }
    }
    this.mailTriggerService.SendMail(mailOptions);
//     const ppmail:MailOptions= {
//   from: '"Prodo Team" <noreply@prodo.in>',
//   to: prodoPartner.email,
//   subject: 'Thank you for contacting us',
//   template: 'ProdoPartner',
//   templatevars: {
//     prodoPartner: prodoPartner,
//     context: 'Thank you for contacting us. We will get back to you shortly.',
//   }
// }
// const prodoMail:MailOptions = {
//   from: '"Prodo Team" <noreply@prodo.in>',
//   to: 'operations@prodo.in',
//   subject: 'New Prodo Partner',
//   template: 'ProdoPartner',
//   templatevars: {
//     prodoPartner: prodoPartner,
//     context: 'New Prodo Partner Query has been Received.',
//   }
// }
//     this.mailService.sendMailWithTemplate(ppmail)
//     this.mailService.sendMailWithTemplate(prodoMail)


    return this.prodoPartnerService.save(prodoPartner);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.prodoPartnerService.remove(id);
  }
}
