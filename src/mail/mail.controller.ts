import { User } from './../users/user.entity';
import { Team } from './../team/team.entity';


// import { Body, Controller, Get, Post,UseGuards,Request } from '@nestjs/common';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';

import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository } from 'typeorm';
import * as fs from 'fs';
var ejs = require('ejs');


import * as path from 'path';
import {existsSync, readFileSync} from 'fs';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@prodo.in',
    pass: ''
  }
});

// import { get } from 'superagent';
import { MailService, MailOptions } from './mail.service';

// import { GetInTouch } from 'dist/get-in-touch/get-in-touch.entity';

  
async function SendMail(mailTrigger:any){
  // console.log(mailTrigger)
  return new Promise((resolve, reject) => {
    var templatesDir =`./mailtemplates/${mailTrigger.template}.html`
    var template = fs.readFileSync(path.resolve(templatesDir), 'utf8');
    if(!mailTrigger.template){
      return "error in send mail function"+"Template not found";
    }
    let html = ejs.render(template, mailTrigger.templatevars);
    let mailOptions = { 
        from: mailTrigger.from+'<noreply@prodo.in>',
        to: mailTrigger.mails,
        // bcc: ["mehul.mina@prodo.in","santosh.ray@prodo.in"],
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
        // return "error in send mail function"+error;
        
      } else {
        console.log('Email sent ' + info.response);
        resolve('Email sent ' + info.response)
        // return 'Email sent ' + info.response;
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
    @InjectRepository(Team)
    private readonly TeamRepository: Repository<Team>,
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
      from: '"Prodo Team" <noreply@prodo.in>',
      to: 'mehul.mina@prodo.in',
      subject: 'Hello',
      template: 'diwaliOffer',
      templatevars: {
        getInTouch: getInTouch,
        context: 'abc',
      },
    };
    // let mailTrigger = 'SendBulk';
    return this.mailService.sendMailWithTemplate(mailOptions);
  }
  @Get('sendbulkmail')
  async test() {
    // let mails=["sameen@prodo.in"]["anchal.kaushik@prodo.in",
    let bcc = [
      //first  94
      // 'srinivasand@airasia.co.in',
      // 'onkar.singh@lalpathlabs.com',
      // 'sagar.saxena@swiggy.in',
      // 'Meer.waheedulla@flipkart.com',
      // 'saralar@drreddys.com',
      // 'ashutosh@getfitso.com',
      // 'harish.kumar@medanta.org',
      // 'sanjay.jha@goindigo.in',
      // 'neeraj.mittal@renaissance-group.in',
      // 'rajneesh.verma@cpwi.in',
      // 'ashish.rastogi@rsplgroup.com',
      // 'shivaji@biosense.in',
      // 'niranjan.eppili@thyrocare.com',
      // 'askus@gsk.com',
      // 'sanchit.arora@delhivery.com',
      // 'siddalinga.swamy@meesho.com',
      // 'kumar.lokesh@zomato.com',
      // 'krish.krishna@wework.co.in',
      // 'akash@chaayos.com',
      // 'prachi.vichare@trica.com',
      // 'Prachi.Nayak@yesbank.in',
      // 'keshav.gupta@grofers.com',
      // 'procurement@moolchandhealthcare.com',
      // 'lokesh.s@cafecoffeeday.com',
      // 'Latika.Sharma@in.nestle.com',
      // 'Rravindra.chand@amrihospitals.in',
      // 'marketing@belcibo.in',
      // 'rajesh.nautiyal@fortishealthcare.com',
      // 'a.bakshi@tatasteel.com',
      // 'jitendra.haryan@jaslokhospital.net',
      // 'krish.krishna@wework.co.in',
      // 'amfahlifeline@gmail.com',
      // 'inventory@drdangslab.com',
      // 'sdey@burgerking.in',
      // 'akash@chaayos.com',
      // 'ahmar@licious.com',
      // 'siddhant@meatigo.com',
      // 'emmanuel.desouza@91springboard.com',
      // 'geetikas@ecomexpress.in',
      // 'akashgohil@torrentpharma.com',
      // 'purchasemanager@atlantamediworld.co',
      // 'purmgr@cissahibabad.in',
      // 'purmgr@cissahibabad.in',
      // 'venkatesh.ks@meesho.com',
      // 'surinder.saini@paytm.com',
      // 'anirudh.likhite@nykaa.com',
      // 'arun.kumar@canon.co.in',
      // 'priyankesh@cartingpro.in',
      // 'dr.aktyagi@haldiram.com',
      // 'subhasis.satapathy@wowmomo.com',
      // 'walt amit.saincher@disney.com',
      // 'raghavendra.k@bosch.com',
      // 'anr@pepsico.com',
      // 'surinder.saini@paytm.com',
      // 'rahul.krishnan@dunzo.in',
      // 'kuldeep.y@ecomexpress.in',
      // 'onkar.singh@lalpathlabs.com',
      // 'finance.yhk@yashodahospital.org',
      // 'sanchit.arora@delhivery.com',
      // 'vinayaka@bigbasket.com',
      // 'raghuram.m@dunzo.in',
      // 'chandrika.nargund@shadowfax.in',
      // 'vn@ninjacart.com ',
      // 'vinodbalajimanjunath@airasia.co.in',
      // 'piyush.sidhar@pickrr.com',
      // 'Junaid@nestaway.com',
      // 'sharath@mobinius.com',
      // 'p.kalive@zensar.com',
      // 'manishg@triconinfotech.com',
      // 'vpravin2012@gmail.com ',
      // 'deepu@itvoyager.com',
      // 'ismail@midwestit.in',
      // 'ismkhan132@hotmail.com',
      // 'satyanand.nadkarni@celstream.com',
      // 'narayana.rao@accord-soft.com',
      // 'biplob.das@nineleaps.com',
      // 'mohan.ramaiah@wipro.com',
      // 'reshma.rai@ittiam.com',
      // 'roshan@datasemantics.in',
      // 'chandra.shekar@compassitesinc.com',
      // 'rakesh.kumar@allegion.com',
      // 'anil.kumar@qwikcilver.com',
      // 'victorien.chantreau@sonovision-aetos.in',
      // 'subramanya.kamath@fintellix.com',
      // 'sanjay.nayak@mindsquaretech.com',
      // 'girish.sabat@pathpartnertech.com',
      // 'sunil@mistralsolutions.com',
      // 'gautam.kasturi@spiderlogic.com',
      // 'vikas.gupta@graymatter.co.in',
      // 'nirant@edureka.com',
      // 'ms_manoj_2001@yahoo.com',
      // 'vikranth@dataweave.com',
      // 'sujeet.sreenivasan@ignitarium.com',
      // 'Sudhakar.ks@difacto.com',
      //2nd half
      // 'vishal2nice@gmail.com',
      // 'satish.shetty@nxtgen.com',
      // 'mkm_irfan@yahoo.in',
      // 'bantesh@ozonegroup.com',
      // 'parag.jain@arteriatech.com',
      // 'vijayabhaskarv@tarangtech.com',
      // 'rabeesh.k@fintellix.com',
      // 'mukesh.singh@embitel.com',
      // 'saikat.manna@gameskraft.in',
      // 'bijoys@healthasyst.com',
      // 'indrajith.ravindran@rosselltechsys.com',
      // 'azif.saly@ignitarium.com',
      // 'abhay@novopay.in',
      // 'rohit@xiphiastec.com',
      // 'raman.yaag@we-online.com',
      // 'dinesh.nair@lenovo.com',
      // 'sumit.agarwal@aurigo.com',
      // 'sweata.dodka@laerdal.com',
      // 'mijesh.mohan@maventic.com',
      // 'pharmacube8@gmail.com',
      // 'purav@smytten.com ',
      // 'ezaz@smytten.com ',
      // 'anurag.satyarth@eggoz.in',
      //3rd half
      // 'shilanjanisood@gmail.com',
      // 'vinay@ourgoodspace.com',
      // 'slavar21@gmail.com',
      // 'onlyrefills@gmail.com',
      // 'ritisharchoudhary@gmail.com',
      // 'manibali@yahoo.com',
      // 'kiit.gaurav@gmail.com',
      // 'vikas.sawant@cred.club',
      // 'sayantika.mukherjee@razorpay.com',
      // 'shivangi.katyal@godigit.com',
      // 'arpitha.bg@navi.com',
      // 'avincop@gmail.com',
      // 'ankit4388@gmail.com',
      // 'sanjeev.ranjan.nps@gmail.com',
      // 's.subramanian16@simc.edu',
      // 'aks_1601@rediffmail.com',
      // 'gokuld@cafecoffeeday.com',
      // 'prabhatkumar23.official@gmail.com',
      // 'chittaranjan.sahoo@lgsoftindia.com',
      // 'anjana.prasad@sliceit.com',
      // 'sunilsamuelmcc@gmail.com',
      // 'kishan.pednekar@nestle.com',
      // 'anupam.alok07@gmail.com',
      // 'wrakesh_1982@yahoo.com',
      // 'swapnil.ghorpade@sanofi.com',
      // 'nandini.bhalla@loreal.com',
      // 'yogesh.sharma@thezurihotels.com',
      // 'vivek.singh@ikea.com',
      // 'maharules@gmail.com',
      // 'abhinavjha.1307@gmail.com',
      // 'rupaljindal88@gmail.com',
      // 'avani.k@bewakoof.com',
      // 'suvash.chandra@thesouledstore.com',
      // 'rishu@zivame.com',
      // 'divnay2@gmail.com',
      // 'tammanaparadise.priyanka@gmail.com',
      // 'ahmedkamranabid@gmail.com',
      // 'shalu0687@gmail.com',
      // 'nareshsaluja22@gmail.com',
      // 'rizwan@sugarcosmetics.com',
      // 'sharmapriyanshu20@gmail.com',
      // 'sumeet.shivhare@unacademy.com',
      // 'karthik.jayaseelan@garmin.com',
      // 'yadav.meghnayadav@gmail.com',
      // 'ami.sharma1@signify.com',
      //4rth half
      // 'praseeth.varma@gmail.com',
      // 'pratappremnath@gmail.com',
      // 'suryasureka000@gmail.com',
      // 'neelshekhar@gmail.com',
      // 'raamkii@gmail.com',
      // 'saquibhasnain17@gmail.com',
      // 'jaideep.kapani@gmail.com',
      // 'sumitsinghgandhi@gmail.com',
      // 'pushkar30186@gmail.com',
      // 'ashishmishra_hr@yahoo.co.in',
      // 'prthbnmani@gmail.com',
      // 'sandesha_23@yahoo.com',
      // 'ma.p.suresh@gmail.com',
      // 'kuldeepmotal@yahoo.com',
      // 'dkumar.1000@gmail.com',
      // 'canshuman@hotmail.com',
      // 'pvjosephkirankumar@gmail.com',
      // 'maitrayeeghosh91@gmail.com',
      // 'jodie.singh@gmail.com',
      // 'admin@sakthimasala.com',
      // 'amitachra@gmail.com',
      // 'sugarbaji@gmail.com',
      // 'd.dilip.k@gmail.com',
      // 'lukeprakasha@rediffmail.com',
      // 'pallavi@hrxbrand.com',
      // 'guptapraful@hotmail.com',
      // 'abhishek.ganguly@oyorooms.com',
      // 'juhijain2002@gmail.com',
      // 'anuj.das@loreal.com',
      // 'vadehra.rati@gmail.com',
      // 'jayadevanpk@gmail.com',
      // 'sayesekhar@gmail.com',
      // 'abhishek.mehrotra@nw18.com',
      // 'naresh.saluja@landmarkgroup.in',
      // 'sayantika.mukherjee@razorpay.com',
      // 'eltonthomas89@gmail.com',
      // 'jibinkpious@gmail.com',
      // 'poddaramay@gmail.com',
      // 'akashkejriwal17@gmail.com',
      // 'shishir.kataria@gmail.com',
      // 'vikramtomar26@hotmail.com',
      // 'nitz990@gmail.com',
      // 'mahalakshmi.iyer@johnjacobs.com',
      // 'sbmsssga@yahoo.co.in',
      // 'smeer.chopra@gmail.com',
      // 'aditi0704@gmail.com',
      // 'divyangthakur@gmail.com',
      // 'gauravsaggit@gmail.com',
      // 'pallavichops@gmail.com',
      // 'globalkunwar@gmail.com',
      // 'veerashekar.r@redbus.com',
      // 'mayooresh@gmail.com',
      // 'dhiraj_ag@yahoo.com',
      // 'vidhya2504@gmail.com',
      // 'syedmohammadzohaib@gmail.com',
      // 'naveenanand0127@gmail.com',
      // 'sharmachetan2@gmail.com',
      // 'moumita.karmakar29@gmail.com',
      // 'paras.mehta@zestmoney.in',
      // 'shambhavi799sd@gmail.com',
      // 'krishna271190@gmail.com',
      // 'sachinvashishtha@gmail.com',
      // 'tashfinster@gmail.com',
      // 'vijay.gwalani@gmail.com',
      // 'puneeth.bekal@gmail.com',
      // 'sapan.mitter@gmail.com',
      // 'rachit.brijkunta@gmail.com',
      // 'rydbyrd@hotmail.com',
      // 'anjalimehra64@gmail.com',
      // 'muskaan.tandon@shiprocket.com',
      // 'mehraj@dunzo.in',
      // 'shivansh_bh@yahoo.com',
      // 'shweta301996@gmail.com',
      // 'aashish.agrawal@live.com',
      // 'pruthvi1994@gmail.com',
      // 'pallikamakshi@gmail.com',
      // 'taakk2015@email.iimcal.ac.in',
      // 'abhimanyugovind@gmail.com',
      // 'saviocerejo1@gmail.com',
      // 'shaikhaltaf2@gmail.com',
      // 'shivharesumeet0@gmail.com',
      // 'shifa.rastogi@gmail.com',
      // 'krithika.ganesan1@gmail.com',
      // 'samirsethi7@gmail.com',
      // 'gagandeep.20042003@gmail.com',
      // 'jn.sunil@gmail.com',
      // 'drhimanshu.s@gmail.com',
      // 'raghavakshay656@gmail.com',
      // 'srishtisingh08@yahoo.com',
      // 'dubey.kunal@gmail.com',
      // 'chetanmhjn@gmail.com',
      // 'way2vps@gmail.com',
      // 'patankar.shilpa@gmail.com',
      // 'saurabh1702@gmail.com',
      // 'sharmajessica@gmail.com',
      //test emails
      'mehul.mina@prodo.in ',
    ];
    // let bcc = ['santosh.ray@prodo.in','mehul.mina@prodo.in','sabir.ansari@prodo.in']
    let subject =
      '100% Customizable Diwali Gifts || Best Bulk Pricing || Best Brands';
    let mailTrigger = {
      from: 'Team Prodo', 
      // mails: mails,
      bcc: bcc,
      subject: subject,
      template: 'diwaliOffer',
      // attachments: [
      //   {   // utf-8 string as an attachment
      //       filename: 'Diwali.pdf',
      //       path:'https://prodo-files-upload.s3.ap-south-1.amazonaws.com/files/Diwali+Festive+Gift+Combos.pdf'
      //   }
      // ],
      templatevars: {
        context: 'abc',
      },
    };
    return this.mailService.sendBulkMail(mailTrigger);
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
          mails: mail?mail:"mehul.mina@prodo.in",
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
          mails: mail?mail:"mehul.mina@prodo.in",
          subject: subject,
          template: template,
          text:text?text:"",
          templatevars: templatevars?templatevars:{}
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
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'ERROR_FIELD <mail:array>',
      message: "must have mails",
    }, HttpStatus.BAD_REQUEST); 
  }
  }

  @Post('newEmployeeEmail')
  async newEmployeeEmail(@Body('users') users:any,@Body('mail') mail:string,@Body('subject') subject:string,@Body('from') from:string){
    
    if(!users){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'ERROR_FIELD <users:array>',
        message: "must have users field",
      }, HttpStatus.BAD_REQUEST); 
    }
    
    if(users.length>0){
    let mailTrigger = {
      from:from?from:'Team Prodo', 
      mails: mail?mail:"mehul.mina@prodo.in",
      subject: subject?subject:"New Employee Email",
      template: 'welcomeMail',
      text:"",
      templatevars: {
        users: users,
      }
    }
    // console.log("function",mailTrigger)
    return await SendMail(mailTrigger).then((res1)=>{
      return {
        status:'success',
        message:" Email sent ",
        data: res1
      }
    }).catch((err)=>{
      console.log("in error")
      return {
        status:'Error',
        message:" Error from nodemailer  ",
        data: err
      }
    })
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'ERROR_FIELD <users:array>',
      message: "must have users",
    }, HttpStatus.BAD_REQUEST); 
  }
  }

  @Post('sendBulkEMail')
  async sendBulkEMail(@Body() body:any) {
    const contacts = body.contacts;
    const mailOption = body.MailOption;
    contacts.forEach(async contact => {
      mailOption.to = contact.email;
      await this.mailService.sendMailWithTemplate(mailOption);
    });
  }
  //Get list of file names in Mail Template folder
  @Get('/getMailTemplates')
  async getMailTemplates() {
    return await this.mailService.getMailTemplates();
  }
  @Post('custom-salesOrder')
  @UseGuards(JwtAuthGuard)
  async create_order(@Body() body: any,@Request() req:any): Promise<any>{
    let orders=body
    let user=await this.userRepository.findOne(req.user.id)
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;  
    let po_list=orders[0].po?orders[0].po:[]
    
    let data={
      user_name:user.firstName+" "+user.lastName,
      user_email:user.email,
      user_contact:user.contactNumber,
      date:today, 
      total:orders.length,
      line_items:[],
      po:po_list
    }


    for(let i=0;i<orders.length;i++){
      let order1=orders[i]
      data.line_items.push({
        "productName":order1.productName,
        "quantity": order1.qty,
        "rate":order1.price,
        "description":order1.description,
        "id":order1.zohoBooksProductId?order1.zohoBooksProductId:order1.sku
     })
    }
    let subject =`New Order Created By ${data.user_name}`;
    let team=await this.TeamRepository.findOne('63188e5149ccf9ab922a2ee2');//Custom Sales Order Team name
    let mails = team.mails
  let mailTrigger = {
    from: 'Team Prodo',
    mails: mails,
    subject: subject,
    template: 'NewOrderMail',
    templatevars: {
      data: data,
    },
  };
  return await this.mailService.sendnewOrderMail(mailTrigger);
    // return data

}
}
