import { Injectable } from '@nestjs/common';
import * as path from 'path';
import {existsSync, readFileSync} from 'fs';
import * as fs from 'fs';
import {render} from 'ejs';
import {juiceResources, inlineContent} from 'juice'
import {htmlToText} from "html-to-text"
import {HttpException,HttpStatus } from '@nestjs/common';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@prodo.in',
    pass: ''
  }
});
var transporter2 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: 'noreply@prodo.in',
    // pass: 'Prodo@2021'
    user: 'hitarthi.kohli@prodo.in',
    pass: ''
  }
});


// var mailOptions = {
//   from: 'noreply@prodo.in',
//   to: 'santosh.ray@prodo.in',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };
@Injectable()
export class MailService {

  getHello(): string {
    return 'Hello World!';
  }

  
  public sendMail(mailOptions): void {
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
  async getMailTemplates(): Promise<string[]> {
    const templatesDir = path.resolve('./mailtemplates');
    const files = await new Promise((resolve, reject) => {
      fs.readdir(templatesDir, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
    return files.filter(file => file.endsWith('.html'));
  }
  
  //SendMailTeam function with gets data from user distionary
  async sendMailTeam(mailTrigger: any){
    // console.log("Data", mailTrigger);
    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = readFileSync(path.resolve(templatesDir), 'utf8');
    console.log(mailTrigger.template);
    if(!mailTrigger.template){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Please provide templateName',
        message: "Please provide templateName"
      }, HttpStatus.FORBIDDEN);
    }
    let html = render(template, mailTrigger.templatevars);
    let mailOptions = { 
        from: mailTrigger.from+'<noreply@prodo.in>',
        to: mailTrigger.mails,
        subject: mailTrigger.subject,
        template : mailTrigger.template,
        text : mailTrigger.text,
        templatevars : mailTrigger.templatevars,
        html: html
        }; 
    // let mailOptions = Data
    // mailOptions.from +='<noreply@prodo.in>'
    // console.log("mailOptions", mailOptions);  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }
    );
  }
  async sendBulkMail(mailTrigger: any){
    // console.log("Data", mailTrigger);
    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = readFileSync(path.resolve(templatesDir), 'utf8');
    console.log(mailTrigger.template);
    if(!mailTrigger.template){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Please provide templateName',
        message: "Please provide templateName"
      }, HttpStatus.FORBIDDEN);
    }
    let html = render(template, mailTrigger.templatevars);
    let mailOptions = { 
        from: mailTrigger.from+'<hitarthi.kohli@prodo.in>',
        // from: mailTrigger.from+'<anchal.kaushik@prodo.in>',
        replyTo: 'Hitarthi Kohli <hitarthi.kohli@prodo.in>',

        // from:'satosh.ray@prodo.in',

        to: mailTrigger.mails?mailTrigger.mails:'me <hitarthi.kohli@prodo.in>',
        subject: mailTrigger.subject,
        bcc:mailTrigger.bcc?mailTrigger.bcc:'',
        template : mailTrigger.template,
        text : mailTrigger.text,
        templatevars : mailTrigger.templatevars,
        // attachments: mailTrigger.attachments,
        html: html
        }; 
    // let mailOptions = Data
    // mailOptions.from +='<noreply@prodo.in>'
    // console.log("mailOptions", mailOptions);  
    transporter2.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }
    );
  }
  async sendBulkMailToManufacturer(mailTrigger: any){
    // console.log("Data", mailTrigger);
    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = readFileSync(path.resolve(templatesDir), 'utf8');
    // console.log(mailTrigger.template);
    if(!mailTrigger.template){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Please provide templateName',
        message: "Please provide templateName"
      }, HttpStatus.FORBIDDEN);
    }
    let html = render(template, mailTrigger.templatevars);
    let mailOptions = { 
        from: mailTrigger.from+'<noreply@prodo.in>',
        // from: mailTrigger.from+'<anchal.kaushik@prodo.in>',
        replyTo: 'Team Prodo <noreply@prodo.in>',

        // from:'satosh.ray@prodo.in',

        to: mailTrigger.mails?mailTrigger.mails:'me <noreply@prodo.in>',
        subject: mailTrigger.subject,
        bcc:mailTrigger.bcc?mailTrigger.bcc:'',
        template : mailTrigger.template,
        text : mailTrigger.text,
        templatevars : mailTrigger.templatevars,
        attachments: [
          {
            filename:"Hindi-Instructions.pdf",
            path:'https://drive.google.com/uc?export=download&id=14-y6eTAngrM15cLcwdKbeE9TNuJ6dNA4'
          },
          {
            filename:"English-Instructions.pdf",
            path:'https://drive.google.com/uc?export=download&id=1AzNfxnSXoZW-15Ck1yZ0vX2IqWwaYHV1'
          }
        ],
        html: html
        }; 
    // let mailOptions = Data
    // mailOptions.from +='<noreply@prodo.in>'
    // console.log("mailOptions", mailOptions);  
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return error
      } else {
        console.log('Email sent: ' + info.response);
        return 'Email sent: ' + info.response
      }
    }
    );
  }
  async sendnewOrderMail(mailTrigger: any){
    // console.log("Data", mailTrigger);
    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = readFileSync(path.resolve(templatesDir), 'utf8');
    console.log(mailTrigger.template);
    if(!mailTrigger.template){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Please provide templateName',
        message: "Please provide templateName"
      }, HttpStatus.FORBIDDEN);
    }
    let html = render(template, mailTrigger.templatevars);
    let mailOptions = { 
        from: mailTrigger.from+'<noreply@prodo.in>',
        to:mailTrigger.mails,
        subject: mailTrigger.subject,
        bcc:mailTrigger.bcc?mailTrigger.bcc:'',
        template : mailTrigger.template,
        text : mailTrigger.text,
        templatevars : mailTrigger.templatevars,
        // attachments: mailTrigger.attachments,
        html: html
        }; 
    // let mailOptions = Data
    // mailOptions.from +='<noreply@prodo.in>'
    // console.log("mailOptions", mailOptions);  
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return "error"
      } else {
        console.log('Email sent: ' + info.response);
        return ('Email sent: ' + info.response)
      }
    }
    );
  }

  async inviteToProdo(userEmail :any,adminUser :any,data : any,institution :any,inviteId : any){
    let link ="https://prodo.in/inviteTest/" + inviteId
    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
     today = mm + '/' + dd + '/' + yyyy;  
   
    let mailTrigger = {
      from: 'noreply@prodo.in', 
      // mails: mails,
      // bcc: bcc,
      to: `${userEmail}`,

      subject:  `Invitation for joining ${institution.name} `,
      template: 'inviteTest',
      // text: `Invite to join the organization ${institution.name} at the role of ${data.role} by  ${adminUser.firstName} (${adminUser.email} .You credentials are email :${userEmail}, and password is ${data.password} password link is provided here => https://prodo.in/`
      templatevars: {
        // itemDetails: inviteId,
        institution : institution,
        data : data,
        role : data.role,
        adminUser : adminUser
        date:today,
        Link:link,
        inviteid : inviteId
      },
    };

    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = readFileSync(path.resolve(templatesDir), 'utf8');
    let html = render(template, mailTrigger.templatevars);
    var mailOptions = {
      from: 'noreply@prodo.in',
      // from: `${adminUser.email}`,
       to: `${userEmail}`,
       subject: `Invitation for joining ${institution.name} `,
       text: `Invite to join the organization ${institution.name} at the role of ${data.role} by  ${adminUser.firstName} (${adminUser.email} .You credentials are email :${userEmail}, and password is ${data.password} password link is provided here => https://prodo.in/`,
       html : html  ,
       templatevars: mailTrigger.templatevars,
      template: 'inviteTest',  
      link : link
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }

  async inviteUser(adminUser:any,user:any,type:any,data:any,institution :any,inviteId : any){  
    let link ="https://prodo.in/inviteTest/" + inviteId
    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
     today = mm + '/' + dd + '/' + yyyy;  
    if(type == "organization"){    
      var mailOptions = {
        from: 'noreply@prodo.in',
        // from: `${adminUser.email}`,

        to: `${user.email}`,
        subject: `Invitation for joining the ${type}`,
        text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
        templatevars: {
          // itemDetails: inviteId,
          institution : institution,
          data : data,
          role : data.role,
          adminUser : adminUser,
          date:today,
          Link:link,
          inviteId : inviteId
        },
        template : "inviteExisting"

      };
      var templatesDir =`./mailtemplates/${mailOptions.template}.html`
      var template = readFileSync(path.resolve(templatesDir), 'utf8');
      let html = render(template, mailOptions.templatevars);

     var mailTrigger = {
        from: 'noreply@prodo.in',
        // from: `${adminUser.email}`,

        to: `${user.email}`,
        subject: `Invitation for joining the ${type}`,
        text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
        template : "inviteExisting",
        html : html,
        templatevars: mailOptions.templatevars,
      link : link

      };
      
      transporter.sendMail(mailTrigger, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      
    }
    if(type == "company"){
      var mailOptions = {
        from: 'noreply@prodo.in',
        // from: `${adminUser.email}`,

        to: `${user.email}`,
        subject: `Invitation for joining the ${type}`,
        text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
        templatevars: {
          // itemDetails: inviteId,
          institution : institution,
          data : data,
          role : data.role,
          adminUser : adminUser,
          date:today,
          Link:link,
          inviteId : inviteId

        },
        template : "inviteExisting"

        
      };

      var templatesDir =`./mailtemplates/${mailOptions.template}.html`
      var template = readFileSync(path.resolve(templatesDir), 'utf8');
      let html = render(template, mailOptions.templatevars);
      
      var mailTrigger = {
        from: 'noreply@prodo.in',
        // from: `${adminUser.email}`,

        to: `${user.email}`,
        subject: `Invitation for joining the ${type}`,
        text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
        template : mailOptions.template,
        html : html,
        templatevars: mailOptions.templatevars,
      //  template: 'inviteTest', 
      };
      transporter.sendMail(mailTrigger, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      
    }
    if(type == "entity"){    
      var mailOptions = {
        from: 'noreply@prodo.in',
        to: `${user.email}`,
        subject: `Invitation for joining the ${type}`,
        text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
        templatevars: {
          // itemDetails: inviteId,
          institution : institution,
          data : data,
          role : data.role,
          adminUser : adminUser,
          date:today,
          Link:link,
          inviteId : inviteId

        },
        template : "inviteExisting"
       
      };

      var templatesDir =`./mailtemplates/${mailOptions.template}.html`
      var template = readFileSync(path.resolve(templatesDir), 'utf8');
      let html = render(template, mailOptions.templatevars);
      
      var mailTrigger = {
        from: 'noreply@prodo.in',
        to: `${user.email}`,
        subject: `Invitation for joining the ${type}`,
        text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
        templatevars: {
          // itemDetails: inviteId,
          institution : institution,
          data : data,
          role : data.role,
          adminUser : adminUser,
          date:today,
          Link:link
        },
        template : "inviteExisting",
        html : html,
        templatevars: mailOptions.templatevars,
       
      };
      transporter.sendMail(mailTrigger, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return {'Email sent ' : info.response}
        }
      });

      
    }

  }



}

export type MailOptions = {
  from: string,
  to: string,
  subject: string,
  template: string,
  templatevars: any
}
export const sendMailWithTemplate = function sendMailWithTemplate({template:templateName, templatevars, ...Options}): void {
  var templatesDir =`./mailtemplates/${templateName}.html`
  var template = readFileSync(path.resolve(templatesDir), 'utf8');
  var renderedTemplate = render(template, templatevars);
  console.log(renderedTemplate);
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
