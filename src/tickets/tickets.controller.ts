import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { UserService } from '../users/user.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService,
    private readonly userService: UserService, 
    ) {}


  @Get()  /// post request for creating tickets
  getTickets() {
    return this.ticketsService.AllTickets();
  }
  @Get(':email')
  findOne(@Param('email') email: string) {
    // console.log(email)
      return this.ticketsService.AllTicketsByMail(email);
  }
  @Post()  /// post request for creating tickets
  create(@Body() email: any) {
    return this.ticketsService.create(email.email);
  }
  
  @Post('test')//Test Get In Touch
  getintouch(@Body() getintouch : any){
    return  this.ticketsService.getintouch(getintouch)
  }

  @UseGuards(JwtAuthGuard)
  @Post('help-query')//Test Other tickets
  async otherTicket(@Body() new_ticket : any,@Request() req){
    // return req.user
    new_ticket.title="Unregistered"//company or Institute
    new_ticket.type="Normal User"//designation name
    new_ticket=await this.userService.findCombinedUserData(req.user.id,new_ticket)
    // return new_ticket
    let email=new_ticket.email
    let name=email.split("@")
    let ticket={
      subject:`${new_ticket.ticket_type} [${new_ticket.id}]`,
      name:name[0],
      email:new_ticket.email,
      title:new_ticket.title,//company or Institute
      type:new_ticket.type,//designation name
      contact:new_ticket.contactNumber,
      message:new_ticket.description,
      type_of_issue:new_ticket.type_of_issue?new_ticket.type_of_issue:"Query"
    }
    // return ticket
    return {Ticket:await this.ticketsService.otherTicket(ticket),Query:new_ticket}

    // return  await this.ticketsService.otherTicket(ticket)
  }
}
