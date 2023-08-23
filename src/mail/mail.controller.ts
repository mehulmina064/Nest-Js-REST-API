import { User } from './../users/user.entity';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, getRepository } from 'typeorm';
import * as fs from 'fs';
var ejs = require('ejs');
import * as path from 'path';
import {existsSync, readFileSync} from 'fs';
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@beastab.in',
    pass: ''
  }
});

import { MailService } from './mail.service';

  
async function SendMail(mailTrigger:any){
  return new Promise((resolve, reject) => {
    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = fs.readFileSync(path.resolve(templatesDir), 'utf8');
    if(!mailTrigger.template){
      return "error in send mail function"+"Template not found";
    }
    let html = ejs.render(template, mailTrigger.templatevars);
    let mailOptions = { 
        from: mailTrigger.from+'<noreply@beastab.in>',
        to: mailTrigger.mails,
        subject: mailTrigger.subject,
        template : mailTrigger.template,
        text : mailTrigger.text,
        templatevars : mailTrigger.templatevars,
        html: html
        }; 
      transporter.sendMail(mailOptions,  function(error, info){
      if (error) {
        console.log("error in send mail function",error);
        reject("error in send mail function"+error)
        
      } else {
        console.log('Email sent ' + info.response);
        resolve('Email sent ' + info.response)
      }
    }
     )}
    );                
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}

  @Get()
  sendMail() {
    const user = {
      id: '5e9f8f9f8f9f8f9f8f9f8f9f8f9f9f9f',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      password: '123456', 
      contactNumber: '1234567890',
      role: 'ADMIN', 
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const getInTouch = {
      formType: 'Buyer Enquiries',
      formName: 'testnew',
      formData: {
        fullName: 'testnew',
        companyName: 'testnew',
        email: 'gmail@gmail.com',
        mobileNumber: '7988101065',
        message: 'rdfvgbhjn ufyhjbn',
      },
      formSubmittedBy: 'gmail@gmail.com',
    };

    var mailOptions = {
      from: '"Prodo Team" <noreply@beastab.in>',
      to: 'mehul.mina@beastab.in',
      subject: 'Hello',
      template: 'diwaliOffer',
      templatevars: {
        getInTouch: getInTouch,
        context: 'abc',
      },
    };
    return this.mailService.sendMailWithTemplate(mailOptions);
  }
 

  @Post('customEmail')
  async customEmail(@Body('templatevars') templatevars:any,@Body('mail') mail:any,@Body('text') text:string,@Body('subject') subject:string,@Body('from') from:string,@Body('template') template:string){
    if(mail.length>0){
      if(!subject){ 
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'ERROR_FIELD <subject:string>',
          message: "must have subject value",
        }, HttpStatus.BAD_REQUEST);
      }
      if(text){
        let mailTrigger = {
          from:from?from:'Prodo', 
          mails: mail?mail:"mehul.mina@beastab.in",
          subject: subject,
          template: "textMail",
          templatevars: {
            text:text
          }
        }
        // console.log(mailTrigger) 
        return await SendMail(mailTrigger).then((res1)=>{
          return {
            status:'success',
            message:" Email sent ",
            data: res1
          }
        }).catch((err)=>{
          return {
            status:'Error', 
            message:" Error from nodemailer  ",
            data: err
          }
        })

      }
      else{
        if(!template){
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'ERROR_FIELD <template:string>',
            message: "must have template value",
          }, HttpStatus.BAD_REQUEST); 
        }
        let mailTrigger = {
          from:from?from:'Prodo', 
          mails: mail?mail:"mehul.mina@beastab.in",
          subject: subject,
          template: template,
          text:text?text:"",
          templatevars: templatevars?templatevars:{}
        }
        return await SendMail(mailTrigger).then((res1)=>{
          return {
            status:'success',
            message:" Email sent ",
            data: res1
          }
        }).catch((err)=>{
          return {
            status:'Error',
            message:" Error from nodemailer  ",
            data: err
          }
        })
      }
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'ERROR_FIELD <mail:array>',
      message: "must have mails",
    }, HttpStatus.BAD_REQUEST); 
  }
  }

}
