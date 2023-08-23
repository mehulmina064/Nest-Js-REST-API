import { HttpService, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JSONType } from 'aws-sdk/clients/s3';
import { GetInTouch } from '../get-in-touch/get-in-touch.entity';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { zohoToken } from './../sms/token.entity';


const fetch = require('node-fetch');

@Injectable()
export class TicketsService {
  constructor(
    private readonly userService: UserService, 
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
  ) {}

  async getintouch  (getintouch){
    // console.log(getintouch)
    let token = await this.tickettoken()
    // return token
    // console.log(token)
    let contact_check = await this.getcontactid(getintouch,token)
    // return contact_check
    let contact_id = contact_check.id
    let ticket = {
      productId: getintouch.productId?getintouch.productId:null,
      contactId: contact_id,
      subject: getintouch.subject,
      departmentId: '78228000000010772',
      description: getintouch.message,
      phone: getintouch.contact,
      email: getintouch.email,
      teamId:"78228000000288286",
      cf : {
        "cf_type_of_issue" : getintouch.type_of_issue?getintouch.type_of_issue:"Get In Touch"},
    };
    // ticket=JSON.stringify(ticket)
    // return ticket
    let result_ticket = await this.ticketgenerate(ticket ,token )
    return result_ticket
  }

  async otherTicket (new_ticket){
    // console.log(getintouch)
    let token = await this.tickettoken()
    // return token
    // console.log(token)
    let contact_check = await this.getcontactid(new_ticket,token)
    // return contact_check
    let contact_id = contact_check.id
    let ticket = {
      productId: new_ticket.productId?new_ticket.productId:null,
      contactId: contact_id,
      subject: new_ticket.subject,
      departmentId: '78228000000010772',
      description: new_ticket.message,
      phone: new_ticket.contact,
      email: new_ticket.email,
      teamId:"78228000000288286",
      cf : {
        "cf_type_of_issue" : new_ticket.type_of_issue?new_ticket.type_of_issue:"Query"},
    };
    // return ticket
    let result_ticket = await this.ticketgenerate(ticket ,token )
    return result_ticket
  }
 
  async create(email: string) {
    console.log(email);
    let ticket_token = await this.tickettoken();
    console.log(ticket_token, 'wait logs for ticket tocke  start here');
    let contact = await this.getcontactid(email, ticket_token);
    if(!contact){
    return "No contact" 
    }
    console.log(contact, 'contact details');
    let ticket = {
      productId: null,
      contactId: `${contact.id}`,
      subject: 'test',
      departmentId: '78228000000238157',
      description: 'Hai This is Description',
      phone: `${contact.phone}`,
      email: email,
      // teamId:"78228000000286896"
      teamID :"78228000000288286"
    };
    let result_ticket = await this.ticketgenerate(ticket, ticket_token);
    console.log(result_ticket);
    return result_ticket;
  }

  async tickettoken(){
    let zohoToken = await this.zohoTokenRepository.findOne('630484493c00a10e2a9d7c6e')
  let token=zohoToken.token
  // console.log("oldtoken",token)
  let out
  let res = await fetch(`https://desk.zoho.in/api/v1/contacts`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
  .then(data => out?(out = data):out); ///data returned
// console.log('rescontact',out);
// return out
if(!out){
  return token
  }
  if(out.message=='You are not authenticated to perform this operation.'||out.message=="The OAuth Token you provided is invalid."){
    // console.log("NEW_TOKEN")
  token=await this.newZohoBookTokenFarji()
  return token
  }
  return token
  }
  
  async newZohoBookTokenFarji(){
    let zohoToken = await this.zohoTokenRepository.findOne('630484493c00a10e2a9d7c6e')
    // console.log("zohoToken",zohoToken)
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
     
      })
  });
  zoho=await zoho.text()
  zoho=JSON.parse(zoho)
  let token="Zoho-oauthtoken "
  token=token+zoho.access_token
  zohoToken.token=token
  let kill=await this.zohoTokenRepository.save(zohoToken)
  // console.log("kill in new token",kill)
  return token
  }


  async ticketgenerate(ticket: JSONType, ticket_token: any) {
    let kill;
    let sample_ticket = await fetch('https://desk.zoho.in/api/v1/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${ticket_token}`,
      },
      body: JSON.stringify(ticket),
    })
      .then(r => r.json())
      .then(data => kill = data); ///data returned
    // console.log('res', kill);
    return kill;
  }

  async getcontactid(getintouch: any , ticket_token: any) {
    let kill;
    let out
    let sample_contact = await fetch('https://desk.zoho.in/api/v1/contacts?limit=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${ticket_token}`,
      },
    })
      .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
      .then(data => out?(out = data):out); ///data returned
    console.log('rescontact',out);
    // return out
    if(!out){
      // console.log("nodata")
      let contact = {
        "lastName" : getintouch.name,
        "description" : getintouch.Description,
        "phone" : Number(getintouch.contact),
        "email" : getintouch.email,
        "type" : getintouch.type,
        "phone" : getintouch.contact,
        "mobile" : getintouch.contact,
        "title": getintouch.title
      }
      // console.log(contact)
      // return contact
      let zoho = await fetch('https://desk.zoho.in/api/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `${ticket_token}`,
      },
      body:JSON.stringify(contact)
    }) .then(resp => resp.json())
    .then(data => kill = data); ///data returned
    return kill;
    }
    let all_contacts = out.data;
    // console.log("dd",out.data)
    let obj = all_contacts.find(o => o.email === `${getintouch.email}`);
    if (!obj)
    {
      let contact = {
        "lastName" : getintouch.name,
        "description" : getintouch.Description,
        "phone" : Number(getintouch.contact),
        "email" : getintouch.email,
        "type" : getintouch.type,
        "phone" : getintouch.contact,
        "mobile" : getintouch.contact,
        "title": getintouch.title
      }
      // return contact
      let zoho = await fetch('https://desk.zoho.in/api/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `${ticket_token}`,
      },
      body:JSON.stringify(contact)
    }) .then(resp => resp.json())
    .then(data => kill = data); ///data returned
    return kill;
    }
    else{
      // console.log(obj)
      return obj
    }
  }

  async findOne(id: string) {
    let sample_user = await this.userService.findByEmail(id)
    let token = await this.tickettoken()
    let kill
    let all_contacts = await fetch(`https://desk.zoho.in/api/v1/contacts`,{
      method : 'GET',
      headers : {
        Authorization : `${token}`
      }
    }).then(resp =>resp.json())
    .then(data=>(kill = data));
    let arr_ofresult = kill.data
    let obj = arr_ofresult.find(o => o.email === id);
    if (obj === undefined)
    {
      return " well  you'll have to create a ticket for the email"
    }
    else {
      console.log(obj.id)
      let contact_id = obj.id
      let all_tickets = await fetch(`https://desk.zoho.in/api/v1/tickets`,{
        method : 'GET',
        headers : {
          Authorization :`${token}`
        }
      }).then(resp =>resp.json())
      .then(resticket=>(kill =resticket))
      console.log(kill,"###5%%%%%%%%%%%%%")
      let ticket_arr = kill.data
       let obj1 = ticket_arr.find(o => o.contactId === contact_id);
      return obj1;
    }
  }

  async getTickets(email: string) {
    // console.log(email);
    let ticket_token = await this.tickettoken();
    // console.log(ticket_token, 'wait logs for ticket tocke  start here');
    let contact = await this.getcontactid(email, ticket_token);
    if(!contact){
    return "No contact" 
    }
    let result_ticket = await this.getAllTickets(ticket_token);
    // console.log(result_ticket);
    return result_ticket;
  }
  async getAllTickets(ticket_token: any) {
    let kill;
    let sample_ticket = await fetch('https://desk.zoho.in/api/v1/tickets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${ticket_token}`,
      }
        })
      .then(r => r.json())
      .then(data => kill = data); ///data returned
    // console.log('res', kill);
    return kill;
  }
  async AllTickets() {
    let ticket_token = await this.tickettoken();
    let result_ticket = await this.getAllTickets(ticket_token);
    return result_ticket;
  }
  async findByMail(email: any , ticket_token: any) {
    let out
    let sample_contact = await fetch('https://desk.zoho.in/api/v1/contacts?limit=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${ticket_token}`,
      },
    })
      .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
      .then(data => out?(out = data):out); ///data returned
    // console.log('rescontact',out);
    // return out
    if(!out){
      return "No Tickets"
    }
    let all_contacts = out.data;
    // console.log("dd",out.data)
    let obj = await all_contacts.find(o => o.email === `${email}`);
    if (!obj)
    {
      return "No Tickets"
    }
    else{
      return obj
    }
  }
  async findByC_id_all_tickets(c_id:any,ticket_token: any) {
    let kill;
    // console.log("hello",c_id)
    let sample_ticket = await fetch(`https://desk.zoho.in/api/v1/contacts/${c_id}/tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${ticket_token}`,
      }
        })
      .then(r => r.json())
      .then(data => kill = data); ///data returned
    // console.log('res', kill);
    if(kill.errorCode){
      return {
        "data": [
        ]
    }
    }
    return kill;
  }
  async AllTicketsByMail(email) {
    // console.log("in function")
    let ticket_token = await this.tickettoken();
    let contact = await this.findByMail(email, ticket_token);
    // return contact
    // console.log(contact)
    // if(){
    //   return {
    //     "data": [
    //     ]
    // }
    // }
    if(!contact||contact=="No Tickets"){
    // return "No contact" 
    return {
      "data": [
      ]
    }
  }
    // return contact
    return await this.findByC_id_all_tickets(contact.id,ticket_token)
  }
}

