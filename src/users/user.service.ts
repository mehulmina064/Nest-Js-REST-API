import { OrganizationType, OrganizationDomain, OrganizationStatus } from './../organization/organization.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository, FindManyOptions, getRepository } from 'typeorm';
import { User, UserStatus, UserType } from './user.entity';
import { Permission, UserRole } from '../users/roles.constants';
import * as CryptoJS from 'crypto-js';
import * as xlsx from 'xlsx';
import { MailService } from '../mail/mail.service';
import { UserCreateDto, UserDto } from './user.dto';
import { Organization } from '../organization/organization.entity';
import { K, template } from 'handlebars';
// import { SmsController } from './../sms/sms.controller';
import fetch from 'node-fetch'
import {HttpException,HttpStatus } from '@nestjs/common';
const http = require("https");
import { callbackPromise } from 'nodemailer/lib/shared';
import { OrganizationService } from './../organization/organization.service';
var ObjectId = require('mongodb').ObjectID;


// import { Response } from 'express';
// import { Response } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly organizationService: OrganizationService,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async findAll(filter: FindManyOptions<User> | undefined): Promise<User[]> {
    // Convert String into ObjectID Object
    if(filter){
      console.log("filter exists")
      return await this.userRepository.find(filter);
    }
    console.log("filter does not exist")
    return await this.userRepository.find();
  }


  async findOne(id: string): Promise<User> {
    // console.log('id', id);
    const user = await this.userRepository.findOne(String(id));
    // console.log('user', user);
    return user
  }

  async findCombinedUserData(id: string,new_ticket){
    const user = await this.userRepository.findOne(String(id));
    // return user
    if(user){
      new_ticket.type=user.designation?`Designation-${user.designation}`:`Designation-${new_ticket.type}`
      new_ticket.title=user.companyName?`CompanyName- ${user.companyName}`:`CompanyName-${new_ticket.title}`
      new_ticket.email=user.email
      new_ticket.contactNumber=user.contactNumber
      let org = await this.organizationRepository.findOne(String(user.organization_id))
      new_ticket.title=`${org.name?`CompanyName- ${org.name}`:new_ticket.title} [${org.type?org.type:""}]`//company or Institute [Type of Org]
      return new_ticket
    }
    else{
      return new_ticket
    }
   
  }
 
  //Get List of Available UserRoles
  async getUserRoles() {
    return Object.keys(Permission);
  }
  async filter(filter: any) {
    return await this.userRepository.find(filter);
  }

  async remove(id: ObjectID) {
    const order = await this.userRepository.findOne(id);
    await this.deleteZohoUser(order);
    await this.dashboardDataDelete(id);
    await this.userRepository.delete(id);
    return order;
  }
  async dashboardDataDelete(id: ObjectID) {
    let res=await this.dashboardDataRepository.findOne({userId:id}) 
    if(res){
      await this.dashboardDataRepository.delete(res);
    }
    else{
      return true;
    }

  }

  async generateOtp(contactNumber: string) {
    const otp = await OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    await this.otpRepository.save({ contactNumber, otp });
    return { otp };
  }

  async generatePassword() {
    let pass = await OTP.generate(8, { upperCase: false, specialChars: false, alphabets: true });
    return pass;
  }

  async verifyOtp(contactNumber: any, otp: any) {
    const checkOtp = await this.otpRepository.findOne({ contactNumber, otp });
    return !!checkOtp;
  }

  async assignRoles(id: ObjectID, roles: UserRole[]) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user);
    // if user.roles includes roles
    user.roles= await [...user.roles, ...roles];
    return await this.userRepository.save(user);
  }
  async addUser(user: User) {
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
      // return { status: 'failure', message: 'User already exists' };
    } else {
      user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
      user.isVerified=false;
      const newUser = await this.userRepository.save(user);
      return { status: 'success', message: 'User created successfully', data: newUser };
    }
  }
  async save(user: User, account:Account, organization:Organization) {
    // check if user already exists
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
      // return { status: 'failure', message: 'User already exists' };
    }
    console.log("user",user);
    console.log("account",account);
    console.log("organization",organization);
    // create account

    user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
    var saveUser = await this.userRepository.save(user);
    var userName = saveUser.firstName +' '+ saveUser.lastName;
    account.email=user.email;
    var saveAccount = await this.accountRepository.save(account);
    var saveOrganization = await this.organizationRepository.save(organization);
    saveUser.accountId = saveAccount.id;
    saveUser.organization_id = String(saveOrganization.id);
    saveOrganization.account_id = saveAccount.id;
    saveOrganization.customerId=String(saveOrganization.id)
    saveOrganization.companyIds=[]
    saveOrganization.entityIds=[]
    saveOrganization.status=OrganizationStatus.ACTIVE
    //is
    let zohouser=await this.zohoWebUserUpload(saveUser);
    console.log("zohouser",zohouser);
    saveUser.status=UserStatus.ACTIVE
    // saveUser.orgRole="ORG_ADMIN"
    // saveUser.orgIds.push(saveUser.organization_id)
    await this.updateData(saveUser)
    await this.userRepository.save(saveUser);
    await this.organizationRepository.save(saveOrganization);
    // sendSms
    let SMS = {
      flow_id:"62c2c6b528e92365c24410b5",
      sender:"mPRODO",
      short_url: "1 (On) or 0 (Off)",
      mobile:"+91",
      name:""
      authkey:"366411AamHKyDckoqf6129d4c4P1"
    };
    SMS.mobile=SMS.mobile+user.contactNumber
    SMS.name=SMS.name+user.firstName

    const SmsOptions = {
      "method": "POST",
      "hostname": "api.msg91.com",
      "port": null,
      "path": "/api/v5/flow/",
      "headers": {
        "authkey": "366411AamHKyDckoqf6129d4c4P1",
        "content-type": "application/JSON"
      }
    };
    let data
    const rep = await http.request(SmsOptions, function (res) {
      const chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        // console.log(body.toString());
        data= body.toString();
        data=JSON.parse(data)
        console.log(data) 

      });
    });
    rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
    // rep.write(`${super1}`)
     data = {
      type: 'success',
      message: "Message sent successfully" 
    };
    console.log(data) 
    rep.end();
    let mailOptions = {
      TriggerName: 'NewUser',
      doc: saveUser,
      templatevars:{
            user: saveUser,
            account: saveAccount,
            organization: saveOrganization
          },
    }
    await this.mailTriggerService.SendMail(mailOptions);
       return {
         "user" : saveUser,
         "account" : saveAccount,
         "organization" :saveOrganization};
     }

  async update(id: string | number | Date | ObjectID | FindConditions<User> | string[] | number[] | Date[] | ObjectID[], user: Partial<User>) {
    if (user.roles && user.roles.length > 0) {
      throw new HttpException({
        status: 400,
        error: "You cannot change your own role", 
        message: "You cannot change your own role"
      }, HttpStatus.BAD_REQUEST);
    }
    let data= await this.userRepository.update(id, user);
    let saveUser=await this.userRepository.findOne(id);
    let zohouser=await this.zohoWebUserUpload(saveUser);
    console.log("zohouser",zohouser);
    return data;
  }

  async updatePassword(id: string | number | Date | ObjectID | FindConditions<User> | string[] | number[] | Date[] | ObjectID[] | undefined, user: any) {
    user.currentPassword = CryptoJS.HmacSHA1(user.currentPassword, 'jojo').toString();
    console.log(user);
    const foundUser = await this.userRepository.findOne(id);
    if (foundUser.password !== user.currentPassword) {
      return { status: 'failure', message: 'Current Password do not match' };
    }
    user.password = CryptoJS.HmacSHA1(user.newPassword, 'jojo').toString();
    user.confirmPassword = CryptoJS.HmacSHA1(user.confirmPassword, 'jojo').toString();
    if (user.password !== user.confirmPassword) {
      return { status: 'failure', message: 'Passwords do not match' };
    }
    return await this.userRepository.update(id, { password: user.password });
  }

  async login(user:any) {
    user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
    const criteria = (user.email.indexOf('@') === -1) ? { contactNumber :user.email } : { email :user.email};
    const foundUser = await this.userRepository.findOne(criteria)
    console.log('foundUser in userService ',foundUser);
    if (foundUser) {
    const pass = foundUser.password;
      if( pass != user.password){ 
        throw new HttpException({
          status: 400,
          error: "Bad Request", 
          message: 'Wrong Password'
        }, HttpStatus.BAD_REQUEST);
      }
     foundUser.lastLoginAt=new Date();
      await this.userRepository.update(foundUser.id,foundUser)
      return { status: 'success', message: 'User logged in successfully', user: foundUser };
    }else{
      throw new HttpException({
        status: 400,
        error: "Bad Request", 
        message: 'User not found'
      }, HttpStatus.BAD_REQUEST);
      return { status: 'failure', message: 'User not found'};      
    }
      
  }
  // async forgotPassword(email: string,mobile:string) {
  async forgotPassword(email: string) {
    let mobile=email;
    const criteria = (email.indexOf('@') === -1) ? ( email="" ) : ( email=email );
    // const foundUser = await this.userRepository.findOne(criteria)
    console.log('email',email);
    console.log('mobile',mobile);
    if(email==""){
      const foundUser = await this.userRepository.findOne({ contactNumber: mobile });
      console.log('foundUser-by number',foundUser);
      if (foundUser) {
        let SMS = {
          authkey:'366411AamHKyDckoqf6129d4c4P1',
          template_id:'62c2c993686eff1b09630536',
          mobile:'91'
        };
        SMS.mobile=SMS.mobile+mobile
        let SmsOptions = {
      
          path:`https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
        };
        console.log('body',SmsOptions.path)
        let res = await fetch(SmsOptions.path)
        res=await res.text()
        res=JSON.parse(res)
        console.log('res',res)
        if(res.type==="error"){
          throw new HttpException({
            status: 400,
            error: "Bad Request", 
            message: res.message
          }, HttpStatus.FORBIDDEN);
        }
        else{
          throw new HttpException({
            status: 200,
            type: 'success',
            message: "OTP sent successfully"
          }, HttpStatus.OK);
        }
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }
    else {
         const foundUser = await this.userRepository.findOne({ email: email });
         console.log('foundUser',foundUser);
         if (foundUser) {
           const otp = await OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
           await this.otpRepository.save({ email: foundUser.email, otp });
           let MailOptions = {
              TriggerName: 'ForgotPassword',
              doc: foundUser,
              templatevars:{
                    user: foundUser,
                    otp: otp,
                  },
                }
            await this.mailTriggerService.SendMail(MailOptions);
           return { status: 'success', message: 'OTP sent to your registered email' };
         } else {
           return { status: 'failure', message: 'User not found' };
         }
    }
  }
  // async resetPassword(email: string, otp: string, password: string, mobile: string) {
  async resetPassword(email: string, otp: string, password: string) {
    let mobile=email;
    const criteria = (email.indexOf('@') === -1) ? ( email="" ) : ( email=email );
    // const foundUser = await this.userRepository.findOne(criteria)
    console.log('email',email);
    console.log('mobile',mobile);
    if(email==""){
      const foundUser = await this.userRepository.findOne({ contactNumber: mobile });
      // console.log('foundUser',foundUser);
      if (foundUser) {
        let SMS = {
          authkey:'366411AamHKyDckoqf6129d4c4P1',
          otp:'',
          mobile:'91'
        };
        SMS.mobile=SMS.mobile+mobile
        SMS.otp=otp
        let SmsOptions = {
          path:`https://api.msg91.com/api/v5/otp/verify?otp=${SMS.otp}&authkey=${SMS.authkey}&mobile=${SMS.mobile}`,
        };
        console.log('sms',SmsOptions)
        let res = await fetch(SmsOptions.path)
        res=await res.text()
        res=JSON.parse(res)
        res.status=res.status
        if(res.type==="error"){
          throw new HttpException({
            status: 404,
            error: res.error,
            message: res.message
          }, HttpStatus.FORBIDDEN);
        }
        else{
          foundUser.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
          await this.userRepository.save(foundUser);
          return { status: 'success', message: 'Password reset successfully' };
        }
      }
      else {
        return { status: 'failure', message: 'User not found' };
      }

    }
    else{
           const foundUser = await this.userRepository.findOne({ email: email });
           if (foundUser) {
             const checkOtp = await this.otpRepository.findOne({ email: foundUser.email, otp: otp });
             console.log('checkOtp',checkOtp);
             if (checkOtp) {
               await this.otpRepository.remove(checkOtp);
               foundUser.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
               await this.userRepository.save(foundUser);
               return { status: 'success', message: 'Password reset successfully' };
             } else {
               return { status: 'failure', message: 'OTP do not match' };
             }
           } else {
             return { status: 'failure', message: 'User not found' };
           }
     }
  }  
 

  async updateOrganizationDomains() {
    let organizations = await this.organizationRepository.find({where: {domain: {$exists: false}}});
    organizations.forEach(async organization => {
      organization.domains = [OrganizationDomain.PROCUREMENT, OrganizationDomain.INVENTORY, OrganizationDomain.ECOMMERCE];
      let saveOrganization = await this.organizationRepository.save(organization);
      console.log('saveOrganization',saveOrganization);
    }
    );
    return { status: 'success', message: 'Organization domains updated successfully' };

  }
  async createUser(user: User) {
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
      // return { status: 'failure', message: 'User already exists' };
    }
    else {
      const newuser = await this.userRepository.save(user);
      return { status: 'success', message: 'User created successfully', user: newuser };
    }
  }
  async addUserToOrganization(user: User, organizationId: string, adminUser: User) {
    user.organization_id = organizationId;
    const organization = await this.organizationRepository.findOne(organizationId);
    user.accountId = adminUser.accountId;
    let account = await this.accountRepository.findOne(adminUser.accountId);
    let password= await this.generatePassword();
    console.log('-----------password----',password);
    user.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
    user.createdBy = String(adminUser.id);
    user.isVerified=false;
    console.log('user',user);
    user.roles = [...user.roles, UserRole.USER];
    console.log('roles',user.roles);
    const newuser = await this.userRepository.save(user);
    let zohouser=await this.zohoWebUserUpload(user);
    console.log("zohouser",user);
    newuser.password=password;
    let mailOptions = {
      TriggerName: 'AddUserToOrganization',
      doc: organization,
      templatevars: {
        user: newuser,
        organization: organization,
        account: account,
      }
    }
    await this.mailTriggerService.SendMail(mailOptions);
    return { status: 'success', message: 'User added successfully', user: newuser };
  }

}


