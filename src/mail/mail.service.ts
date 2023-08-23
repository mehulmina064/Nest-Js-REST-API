import { Injectable } from '@nestjs/common';
import * as path from 'path';
import {existsSync, readFileSync} from 'fs';
import * as fs from 'fs';
import {render} from 'ejs';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@beastab.in',
    pass: ''
  }
});

@Injectable()
export class MailService {

  getHello(): string {
    return 'Hello World!';
  }

  
  public sendMail(mailOptions:any): void {
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  public sendMailWithTemplate({template:templateName, templatevars, ...Options}): void {
    var templatesDir =`./mailtemplates/${templateName}.html`
    var template = readFileSync(path.resolve(templatesDir), 'utf8');
    // var renderedTemplate = render(template, templatevars);
    // console.log(renderedTemplate);
    if(templateName && existsSync(templatesDir)){
      const template = readFileSync(templatesDir, "utf-8");
      const html = render(template, templatevars);
      var mailOptions = {
        ...Options,
      }
      mailOptions.html = html;
      // mailOptions.text = text;
    }else{
      console.log('please check your templName or template Dir')
    }
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email with Templates sent: ' + info.response);
      }
    });
  }
    //Get list of file names in Mail Template folder
}
