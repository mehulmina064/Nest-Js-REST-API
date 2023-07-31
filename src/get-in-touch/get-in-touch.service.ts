import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { GetInTouch } from './get-in-touch.entity';
import { UserService } from './../users/user.service';
import { TicketsService } from './../tickets/tickets.service';
const crypto = require('crypto');

@Injectable()
export class GetInTouchService {
  constructor(
    @InjectRepository(GetInTouch)
    private readonly getInTouchRepository: Repository<GetInTouch>,
    private readonly userService: UserService,
    private readonly ticketService: TicketsService

  ) {}

  async findAll(): Promise<GetInTouch[]> {
    return await this.getInTouchRepository.find();
  }

  async findOne(id: string): Promise<GetInTouch> {
    return await this.getInTouchRepository.findOne(id);
  }

  async save(getInTouch: GetInTouch) {
    // console.log(getInTouch)
    let email=getInTouch.formSubmittedBy
    let name=email.split("@")
    let ticket={
      subject:`Query [${getInTouch.formType}]`,
      name:name[0],
      email:getInTouch.formSubmittedBy,
      title:getInTouch.formData.companyName?getInTouch.formData.companyName:getInTouch.formData.investmentInstitute,//company or Institute
      type:"Unregistered User",//designation name
      contact:getInTouch.formData.mobileNumber,
      message:getInTouch.formData.message,
      Description:`Name:${getInTouch.formName},Mobile No:${getInTouch.formData.mobileNumber} `
    }
    // console.log(ticket)
    let user=await this.userService.findByEmail(email)
    // console.log(user)
    if(user){
      let data={
        type:""
      }
      data=await this.userService.findCombinedUserData(user.id,data)
    //  console.log(data)
      ticket.type=data.type
      ticket.title=data.title
      ticket.contact=data.contactNumber?data.contactNumber:ticket.contact
    }
    // return ticket
    let ticket_data= await  this.ticketService.getintouch(ticket)
    // console.log(ticket)
    // return getInTouch
    let prodo_save_data= await this.getInTouchRepository.save(getInTouch);
    // let prodo_save_data= false

    return {Ticket:ticket_data,GetInTouch:prodo_save_data?prodo_save_data:getInTouch}
  }


  async remove(id) {
    const user = this.getInTouchRepository.findOne(id).then(result => {
      this.getInTouchRepository.delete(result);
    });
  }
}
