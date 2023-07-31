import { MailService } from '../mail/mail.service';
import { MailOptions, sendMailWithTemplate } from './../mail/mail.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetInTouchService } from './get-in-touch.service';
import { GetInTouch } from './get-in-touch.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';

@Controller('get-in-touch')
export class GetInTouchController {
  constructor(private readonly getInTouchService: GetInTouchService,
              private readonly mailService: MailService,
              private readonly mailTriggerService: MailTriggerService) 
              {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<GetInTouch[]> {
    return this.getInTouchService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getInTouchService.findOne(id);
  }

  
  @Post()
  async generateTicket(@Body() getInTouch: GetInTouch) {
    let subject={
      subject:`New ${getInTouch.formType} Query from ${getInTouch.formData.fullName?getInTouch.formData.fullName : (getInTouch.formData.name ? getInTouch.formData.name :getInTouch.formData.firstName  ) } `
     }
    let mailOptions = {
      TriggerName: 'getInTouch',
      doc: getInTouch.formData,
      templatevars:{
        getInTouch: getInTouch,
        context: 'Thank you for contacting us. We will get back to you shortly.',    
      }
    }
    await this.mailTriggerService.SendMail(mailOptions);
    // let prodoTeamEmail = 'sales@prodo.in'
    if(getInTouch.formType === 'Investor Enquiries') {
      let mailOptions = {
        TriggerName: 'getInTouchInvestor',
        doc: subject,
        templatevars:{
          getInTouch: getInTouch,
          context: 'Hello Team, \n\n' + getInTouch.formData.fullName + ' has submitted an enquiry under' + getInTouch.formType + 'Please find the details below.\n\n' 
        }
      }
      await this.mailTriggerService.SendMail(mailOptions);
      // prodoTeamEmail = 'sameen@prodo.in'
    } else if(getInTouch.formType === 'Supplier Enquiries') {
      let mailOptions = {
        TriggerName: 'getInTouchSupplier',
        doc: subject,
        templatevars:{
          getInTouch: getInTouch,
          context: 'Hello Team, \n\n' + getInTouch.formData.fullName + ' has submitted an enquiry under' + getInTouch.formType + 'Please find the details below.\n\n'
        }
      }
    } else if(getInTouch.formType === 'Diwali Offer') {
      let subject2={
        subject:`New ${getInTouch.formType} Diwali Offer Query from ${getInTouch.formData.fullName?getInTouch.formData.fullName : (getInTouch.formData.name ? getInTouch.formData.name :getInTouch.formData.firstName  ) } `
       }
      let mailOptions = {
        TriggerName: 'diwalioffer',
        doc: subject2,
        templatevars:{
          getInTouch: getInTouch,
          context: 'Hello Team, \n\n' + getInTouch.formData.fullName + ' has submitted an enquiry under' + getInTouch.formType + 'Please find the details below.\n\n'
        }
      }
      await this.mailTriggerService.SendMail(mailOptions);
    }

    return await this.getInTouchService.save(getInTouch)
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.getInTouchService.remove(id);
  }
}
