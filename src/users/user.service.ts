import { Territory } from './../territory/territory.entity';
import { OrganizationType, OrganizationDomain, OrganizationStatus } from './../organization/organization.entity';
import { Account } from './../account/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository } from 'typeorm';
import { User, UserStatus, UserType } from './user.entity';
import { Permission, UserRole } from '../users/roles.constants';
import * as CryptoJS from 'crypto-js';
import * as OTP from 'otp-generator';
import * as xlsx from 'xlsx';
import { Otp } from './otp.entity';
import { MailService } from '../mail/mail.service';
import { AccountType } from '../account/account.entity';
import { UserCreateDto, UserDto } from './user.dto';
import { Organization } from '../organization/organization.entity';
import { K, template } from 'handlebars';
// import { SmsController } from './../sms/sms.controller';
import fetch from 'node-fetch'
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
import {HttpException,HttpStatus } from '@nestjs/common';
const http = require("https");
import { dashboardData } from './dashboardData.entity';
import { ProductService } from './../product/product.service';
import { CategoryService } from './../categories/category.service';
import { callbackPromise } from 'nodemailer/lib/shared';
import { salesOrderReview } from './salesOrderReview.entity';
import { OrganizationService } from './../organization/organization.service';
import { Company } from '../company/company.entity';
import { Entitie } from '../entities/entity.entity';
import { AccountDto } from 'src/account/account.dto';
import { TempuserService } from '../tempuser/tempuser.service';
var ObjectId = require('mongodb').ObjectID;


// import { Response } from 'express';
// import { Response } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly mailService: MailService,
    private readonly organizationService: OrganizationService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(dashboardData)
    private readonly dashboardDataRepository: Repository<dashboardData>,
    @InjectRepository(salesOrderReview)
    private readonly salesOrderReviewRepository: Repository<salesOrderReview>,
    private readonly mailTriggerService: MailTriggerService,
    private readonly productService: ProductService,
    private readonly categoryService : CategoryService,
    private readonly tempUserService : TempuserService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Entitie)
    private readonly entityRepository: Repository<Entitie>,
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
    // console.log('user',JSON.stringify(user.password));
    // let criteria = {  email:user.email, password: user.password }; 
    //test
    // const criteria = (user.email.indexOf('@') === -1) ? { contactNumber :user.email , password: user.password } : { email :user.email , password: user.password };
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
          //  var mailOptions = {
          //    from: ['Team Prodo <noreply@prodo.in>',],
          //    to: email,
          //    subject: `Hello ${foundUser.firstName} ${foundUser.lastName} , Please use the OTP to reset your password`,
          //  }
          //  await this.mailService.sendMailWithTemplate({
          //    template: 'forgotPassword',
          //    templatevars: {
          //      user: foundUser,
          //      otp: otp
       
          //    },
          //    ...mailOptions
          //  });    

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
    // var mailOptions = {
    //   from: ['noreply@prodo.in',],
    //   to: [user.email],
    //   subject: `You have been added to ${organization.name}`, 
    //   // `Sending Test Email ${saveUser.firstName + saveUser.lastName} using Node.js`,
    //   templatevars:{
    //     user: newuser,
    //   },
    //   template:'userSignup'
    // }
    // this.mailService.sendMailWithTemplate(mailOptions);
    return { status: 'success', message: 'User added successfully', user: newuser };
  }

  async uploadUsers(adminUser: User, file: any) {
    const data = xlsx.readFile(file.path);
    const sheet_name_list = data.SheetNames;
    const userData = xlsx.utils.sheet_to_json(data.Sheets[sheet_name_list[0]]);
    // console.log('userData',userData);
    // return userData;
    let users:User[]=[];
    //loop on userData
    for(let i=0;i<userData.length;i++){
    // userData.forEach(async user => {
      let user = userData[i];
      let newUser={
        "territory_id": [],
        "permissions": [],
        "teams": [],
        "organization_id": "",
        "firstName": user['First Name']?user['First Name']:'NA',
        "lastName": user['Last Name']?user['Last Name']:'NA',
        "roles": [
            "USER",
            "ADMIN",
            "CLIENT",
        ],
        "designation": "Manager",
        "companyName": user['Company Name']?user['Company Name']:'NA',
        "email": user['Official Email Address']?user['Official Email Address']:'NA',
        "password": "",
        "contactNumber": user['Mobile Number']?user['Mobile Number']:'NA',
        "gstin": user['GSTIN']?user['GSTIN']:'NA',
        "businessEntityName": user['Entity Name']?user['Entity Name']:'NA',
        "businessContactNumber": user['Mobile Number']?user['Mobile Number']:'NA',
        "businessRegisteredAddress": user['Billing Address']?user['Billing Address']:'NA',
        "businessCity": user['City']?user['City']:'NA',
        "businessState": user['State']?user['State']:'NA',
        "businessPinCode": user['Pin']?user['Pin']:'NA',
        "isActive": true,
        "isVerified": false,
        "accountId": ""
    }
        newUser.email = newUser.email.replace(/\s/g, ''); 

      newUser.password = CryptoJS.HmacSHA1("Hklq783@", 'jojo').toString();
      const foundExistingUser = await this.userRepository.findOne({ email: newUser.email });
      if (foundExistingUser) {
        //delete foundExistingUser
        // await this.userRepository.delete(foundExistingUser.id);
        console.log('foundExistingUser',foundExistingUser);
        newUser.id = foundExistingUser.id;
        foundExistingUser.email = newUser.email.replace(/\s/g, ''); 
        // newUser.createdBy = String(adminUser.id);
        // newUser.createdAt = foundExistingUser.createdAt;
        // newUser.updatedBy = String(adminUser.id);
        foundExistingUser.updatedAt = new Date();
        // const updatedUser = await this.userRepository.save(newUser);
        let updatedUser = await this.userRepository.update(newUser.id, foundExistingUser);
        users.push(updatedUser);
        users.push(newUser);
      } else { 
        let account = new Account();
        account.type = AccountType.EXTERNAL;
        let organization = new Organization();
        organization.name = user['Company Name']?user['Company Name']:'NA';
        organization.type = OrganizationType.CLIENT;
        organization.domains = [OrganizationDomain.PROCUREMENT,OrganizationDomain.ECOMMERCE,OrganizationDomain.INVENTORY,OrganizationDomain.SUPPLIER,OrganizationDomain.ADMIN];
        newUser.createdAt = new Date();
        let saveUser = await this.saveForzoho(newUser,account,organization);
        users.push(saveUser);

      }

      
    }

    return { status: 'success', message: 'Users uploaded successfully', users: users };


  }

  async saveForzoho(user: User, account:Account, organization:Organization) {
    // check if user already exists
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      // throw new HttpException({
      //   status: HttpStatus.FORBIDDEN,
      //   error: 'Forbidden',
      //   message: "User already exists"
      // }, HttpStatus.FORBIDDEN);
      return { status: 'failure', message: 'User already exists' };
    }
    // console.log("user",user);
    // console.log("account",account);
    // console.log("organization",organization);
    // return {
    //   "user" : user,
    //   "account" : account,
    //   "organization" : organization};
    // create account

    // user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
    var saveAccount = await this.accountRepository.save(account);
    var saveOrganization = await this.organizationRepository.save(organization);
    user.accountId = saveAccount.id;
    user.organization_id = String(saveOrganization.id);
    saveOrganization.account_id = saveAccount.id;
    //is
    // let zohouser=await this.zohoWebUserUpload(saveUser);
    // console.log("zohouser",zohouser);
    // await this.userRepository.update(saveUser.id,saveUser);
    var saveUser = await this.userRepository.save(user);

    await this.organizationRepository.save(saveOrganization);
    // sendSms
    // let SMS = {
    //   flow_id:"62c2c6b528e92365c24410b5",
    //   sender:"mPRODO",
    //   short_url: "1 (On) or 0 (Off)",
    //   mobile:"+91",
    //   name:""
    //   authkey:"366411AamHKyDckoqf6129d4c4P1"
    // };
    // SMS.mobile=SMS.mobile+user.contactNumber
    // SMS.name=SMS.name+user.firstName

    // const SmsOptions = {
    //   "method": "POST",
    //   "hostname": "api.msg91.com",
    //   "port": null,
    //   "path": "/api/v5/flow/",
    //   "headers": {
    //     "authkey": "366411AamHKyDckoqf6129d4c4P1",
    //     "content-type": "application/JSON"
    //   }
    // };
    // let data
    // const rep = await http.request(SmsOptions, function (res) {
    //   const chunks = [];
    
    //   res.on("data", function (chunk) {
    //     chunks.push(chunk);
    //   });
    
    //   res.on("end", function () {
    //     const body = Buffer.concat(chunks);
    //     // console.log(body.toString());
    //     data= body.toString();
    //     data=JSON.parse(data)
    //     console.log(data) 

    //   });
    // });
    // rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
    // // rep.write(`${super1}`)
    //  data = {
    //   type: 'success'
    //   message: "Message sent successfully" 
    // };
    // console.log(data) 
    // rep.end();
    // let mailOptions = {
    //   TriggerName: 'NewUser',
    //   doc: saveUser,
    //   templatevars:{
    //         user: saveUser,
    //         account: saveAccount,
    //         organization: saveOrganization
    //       },
    // }
    // await this.mailTriggerService.SendMail(mailOptions);
       return {
         "user" : saveUser,
         "account" : saveAccount,
         "organization" :saveOrganization};
     }
 

  async getUserCount(organizationId: string) {
    return await this.findAll({ where: { organization_id: organizationId } }).then(userCount => {
      return userCount[1];
    });
   
  }

  async addPermission(user: User, permission: Permission) {
    const foundUser = await this.userRepository.findOne({ id: user.id });
    if (foundUser) {
      foundUser.permissions.push(permission);
      const updatedUser = await this.userRepository.save(foundUser);
      return { status: 'success', message: 'Permission added successfully', user: updatedUser };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }

  async removePermission(user: User, permission: Permission) {
    const foundUser = await this.userRepository.findOne({ id: user.id });
    if (foundUser) {
      const index = foundUser.permissions.indexOf(permission);
      if (index > -1) {
        foundUser.permissions.splice(index, 1);
      }
      const updatedUser = await this.userRepository.save(foundUser);
      return { status: 'success', message: 'Permission removed successfully', user: updatedUser };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }

  async getPermissions(user: User) {
    const foundUser = await this.userRepository.findOne({ id: user.id });
    if (foundUser) {
      return { status: 'success', message: 'Permissions fetched successfully', permissions: foundUser.permissions };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }
  
  async updateTeam(user: User, teamName: string) {
    // const foundUser = await this.userRepository.findOne({ id: user.id });
    const foundUser = await this.findByEmail(user.email);
    if (foundUser) {
      if(foundUser.teams.includes(teamName)){
        return { status: 'failure', message: 'Team already exists' };
      }
      foundUser.teams.push(teamName);
      const updatedUser = await this.userRepository.save(foundUser);
      return { status: 'success', message: 'Team updated successfully', user: updatedUser };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }
  async checkTeam(user: User, teamName: string) {
    // const foundUser = await this.userRepository.findOne({ id: user.id });
    const foundUser = await this.findByEmail(user.email);
    if (foundUser) {
      if(foundUser.teams.includes(teamName)){
        return true;
      }
      return false;
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }
  async removeTeam(user: User, teamName: string) {
    // const foundUser = await this.userRepository.findOne({ id: user.id });
    const foundUser = await this.findByEmail(user.email);
    if (foundUser) {
      const index = foundUser.teams.indexOf(teamName);
      if (index > -1) {
        foundUser.teams.splice(index, 1);
      }
      const updatedUser = await this.userRepository.save(foundUser);
      return { status: 'success', message: 'Team removed successfully', user: updatedUser };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }
  async getTeams(user: User) {
    // const foundUser = await this.userRepository.findOne({ id: user.id });
    const foundUser = await this.findByEmail(user.email);
    if (foundUser) {
      return { status: 'success', message: 'Teams fetched successfully', teams: foundUser.teams };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }
  }
  async getTeamMembers(teamName: string) {
    const foundTeam = await this.teamRepository.findOne({ name: teamName });
    if (foundTeam) {
      return { status: 'success', message: 'Team members fetched successfully', teamMembers: foundTeam.members };
    }
    else {
      return { status: 'failure', message: 'Team not found' };
    }
  }
  async changeTeamName(user:User,oldTeamName: string,newTeamName: string){
    const fuser = await this.findByEmail(user.email);
    if (fuser) {
      const index = fuser.teams.indexOf(oldTeamName);
      if (index > -1) {
        fuser.teams.splice(index, 1);
      }
      fuser.teams.push(newTeamName);
      const updatedUser = await this.userRepository.save(fuser);
      return { status: 'success', message: 'Team Name Update successfully', user: updatedUser };
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }

  }

  async zohoToken(){
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
          'refresh_token':'1000.c236170cf7209060b3760ad60ba68035.5fd6722cf25268cb92f26e3417e3fd19',
          'client_id':'1000.IX5LZETFZ78PTGVDPZSRT5PL6COE5H',
          'client_secret':'a106415659f7c06d2406f446068c1739e81174c2b7',
          'grant_type': 'refresh_token' 
      })
  });
  zoho=await zoho.text()
  zoho=JSON.parse(zoho)
  let token="Zoho-oauthtoken "
  token=token+zoho.access_token
  return token
  }
async deleteZohoUser(puser:User){
  let user=puser
  let Ac_id= ObjectID
  Ac_id= user.accountId;
  const account = await this.accountRepository.findOne(Ac_id);
  let Organization_id= ObjectID
  Organization_id=user.organization_id
  // console.log("org id",Organization_id);
  const organization = await this.organizationRepository.findOne(Organization_id);
  console.log(typeof user.roles)
  let Roles
  if(typeof user.roles === 'object'){
    Roles=user.roles.join(',');
  }
  else if (typeof user.roles === 'string'){
    Roles=user.roles;
  }
  // console.log(Roles);
  let Teams=user.teams.join(',');
  // console.log(Teams);
  let Organization_Domains=organization.domains.join(',');
  // console.log(Organization_Domains);
let zohoUserObject={
Email:user.email,
Account_Type:account.type,
Name:user.id,
ContactNumber:JSON.stringify(user.contactNumber),
Teams:Teams,
id:user.id,
IsVerified:user.isVerified,
Organization_Domains:Organization_Domains,
Account_id:account.id,
Organization_id:user.organization_id,
Organization_Name:organization.name,
FirstName:user.firstName,
Roles:Roles,
Organization_Type:organization.type,
LastName:user.lastName
}
    let out=[]
    out.push(zohoUserObject)
    let token=await this.zohoToken()
    let zoho1 = await fetch('https://www.zohoapis.in/crm/v2/WebUsers', {
      method: 'POST',
      headers:{
        'Authorization':`${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Content-Length':'904'
      },    
      // body: out
      body:JSON.stringify({data: out})
    });
    zoho1=await zoho1.text() 
    zoho1=JSON.parse(zoho1)
    let  id=zoho1.data[0].details.id
    // console.log("DELETE USER",zoho1,id)
    // let id = user.id
    let zoho2 = await fetch(`https://www.zohoapis.in/crm/v2/WebUsers/${id}`, {
    method: 'DELETE',
    headers:{
      'Authorization':`${token}`,
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Content-Length':'904'
    },    
    // body: out
    body:JSON.stringify({data: out}) 
    });
zoho2=await zoho2.text()
zoho2=JSON.parse(zoho2)
console.log("zoho product put",zoho2.data)
return zoho2
}
  async zohoCrmUser(item:any,token:string)
{
  let out=[]
  out.push(item)
  let zoho1 = await fetch('https://www.zohoapis.in/crm/v2/WebUsers', {
  method: 'POST',
  headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },    
  // body: out
  body:JSON.stringify({data: out})
});


zoho1=await zoho1.text() 
zoho1=JSON.parse(zoho1)
// console.log("zoho product post",zoho1)
console.log("zoho product post",zoho1)
// let id
if(zoho1.data[0].code=="SUCCESS"){
  return zoho1
}
else if (zoho1.data[0].code=="DUPLICATE_DATA") {
 let  id=zoho1.data[0].details.id
  console.log("id",id)
console.log("duplicate data",token)
let zoho2 = await fetch(`https://www.zohoapis.in/crm/v2/WebUsers/${id}`, {
  method: 'PUT',
  headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },    
  // body: out
  body:JSON.stringify({data: out})
});
zoho2=await zoho2.text()
zoho2=JSON.parse(zoho2)
console.log("zoho product put",zoho2.data)
return zoho2
}
else if(zoho1.data[0].code=="INVALID_DATA"){
  console.log("invalid data",zoho1.data[0].details)
  console.log("data",{data: out})
  return item
} if(zoho1.data[0].code=="INVALID_TOKEN"){
  console.log("invalid token",zoho1.data[0].details)
  return "INVALID_TOKEN"
}

}
  

  async zohoWebUserUpload(user:User){
    // let user=await this.findByEmail(nuser.email);
    let token=await this.zohoToken()
      let Ac_id= ObjectID
      Ac_id= user.accountId;
      const account = await this.accountRepository.findOne(Ac_id);
      let Organization_id= ObjectID
      Organization_id=user.organization_id
      // console.log("org id",Organization_id);
      const organization = await this.organizationRepository.findOne(Organization_id);
      console.log(typeof user.roles)
      let Roles
      if(typeof user.roles === 'object'){
        Roles=user.roles.join(',');
      }
      else if (typeof user.roles === 'string'){
        Roles=user.roles;
      }
      // console.log(Roles);
      let Teams=user.teams.join(',');
      // console.log(Teams);
      let Organization_Domains=organization.domains.join(',');
      // console.log(Organization_Domains);
  let zohoUserObject={
    Email:user.email,
    Account_Type:account.type,
    Name:user.id,
    ContactNumber:JSON.stringify(user.contactNumber),
    Teams:Teams,
    id:user.id,
    IsVerified:user.isVerified,
    Organization_Domains:Organization_Domains,
    Account_id:account.id,
    Organization_id:user.organization_id,
    Organization_Name:organization.name,
    FirstName:user.firstName,
    Roles:Roles,
    Organization_Type:organization.type,
    LastName:user.lastName
  }
  console.log(zohoUserObject);
  let res1=await this.zohoCrmUser(zohoUserObject,token)
  return res1
  }
  async zohoWebUsersUpload(){
    let token=await this.zohoToken()
    const users = await this.userRepository.find();
    let res = []
    //loop on users one by one
    for(let i=0;i<users.length;i++){
      let user=users[i]
    // users.forEach(async user => {
      // await this.zohoWebUsersUpload(user);
      // console.log("user",user); 
      let Ac_id= ObjectID
      Ac_id= user.accountId;
      const account = await this.accountRepository.findOne(Ac_id);
      let Organization_id= ObjectID
      Organization_id=user.organization_id
      // console.log("org id",Organization_id);
      const organization = await this.organizationRepository.findOne(Organization_id);
      console.log(typeof user.roles)
      let Roles
      if(typeof user.roles === 'object'){
        Roles=user.roles.join(',');
      }
      else if (typeof user.roles === 'string'){
        Roles=user.roles;
      }
      // console.log(Roles);
      let Teams=user.teams.join(',');
      // console.log(Teams);
      let Organization_Domains=organization.domains.join(',');
      // console.log(Organization_Domains);
  let zohoUserObject={
    Email:user.email,
    Account_Type:account.type,
    Name:user.id,
    ContactNumber:JSON.stringify(user.contactNumber),
    Teams:Teams,
    id:user.id,
    IsVerified:user.isVerified,
    Organization_Domains:Organization_Domains,
    Account_id:account.id,
    Organization_id:user.organization_id,
    Organization_Name:organization.name,
    FirstName:user.firstName,
    Roles:Roles,
    Organization_Type:organization.type,
    LastName:user.lastName
  }
  console.log(zohoUserObject);
  let res1=await this.zohoCrmUser(zohoUserObject,token)
  if(res1=="INVALID_TOKEN"){
    token=await this.zohoToken()
    let res1=await this.zohoCrmUser(zohoUserObject,token)
    }
    res.push(res1)
    // });
  }
    return res
  }

  async userdashboardData(user){
    if(user.roles.includes('PRODO_ADMIN')){
      let res=await this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27')
      if(res){
      return res.data
      }
      else{
        return "NA"
      }
    }
    else{
      let res=await this.dashboardDataRepository.findOne({userId:user.id}) 
      if(res){
      return res.data
      }
      else{
        return "NA"
      }
    }
  }
  async calDashboardData(user,salesOrders){
    // let currentTime6 = new Date();     
    // let currentTime7 = currentTime6.toLocaleTimeString();
    // console.log("in cal dashboard",currentTime7)
    if(user.roles.includes('PRODO_ADMIN')){
      let res=await this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27')
      if(res){
      let data=await this.d_data_update(res.data,salesOrders)
    console.log("in cal after d data dashboard mid",data)
      data=await this.updatepieChart(data)
      res.data=data
      // return res
      return await this.dashboardDataRepository.update('62ef33a6aa3b932525b5ef27',res)//uncomment
      }
      else{
         let d_data={
          userId:'62e978c437a104c778675a82',
          data:{
          orders : {
              total : 0,
              completed : 0,
              inProgress : 0,
              submitted:0,
              cancelled : 0
          },
          rfq : {
              approved : 0,
              rejected : 0,
              inProgress : 0,
              total_submitted:0,
          },
          payments : {
              total : 0,
              paid : 0,
              due : 0,
  
          },
          pieChart : [],
          barChart : []
      }
    }
    d_data.data=await this.d_data_update(d_data.data,salesOrders)
    // console.log("in cal dashboard mid d_data")
    console.log("in cal after d data dashboard mid",d_data.data)


    d_data.data=await this.updatepieChart(d_data.data)

    // return d_data
        return await this.dashboardDataRepository.save(d_data)
      }
    }
    else{
      // console.log("user",user);
      // let ju=user.id
      let res=await this.dashboardDataRepository.findOne({userId:`${user.id}`})
      // console.log("res-else from mongo",res);
      // return res
      if(res){
        // console.log("res-if",res);
      let data=await this.d_data_update(res.data,salesOrders)
      console.log("res-else after d-data");
    // console.log("in cal after d data dashboard mid",data)
      data=await this.updatepieChart(data)
      // console.log("res",res);

      console.log("res-else after update");

      // delete res["data"]
      // // await this.dashboardDataRepository.update(res.id,res)
      // console.log("res before",res)
      res.data=data
      // return res;
      let m= await this.dashboardDataRepository.update(res.id,res) 
      //  await this.dashboardDataRepository.save(res)
    console.log("in cal dashboard res",res)
    return m

      }
      else{
        let d_data1={
          userId:`${user.id}`, 
          data:{
          orders : {
              total : 0,
              completed : 0,
              inProgress : 0,
              submitted:0,
              cancelled : 0
          },
          rfq : {
              approved : 0,
              rejected : 0,
              inProgress : 0,
              total_submitted:0,
          },
          payments : {
              total : 0,
              paid : 0,
              due : 0,
  
          },
          pieChart : [],
          barChart : []
      }
    }
      if(salesOrders.length>0){ 
      d_data1.data=await this.d_data_update(d_data1.data,salesOrders)
    console.log("in cal dashboard mid d_data update")
    console.log("in cal after d data dashboard mid",d_data1.data)


      d_data1.data=await this.updatepieChart(d_data1.data) 
      }
        // return d_data1
    console.log("in cal dashboard mid d_data")
    // console.log("in cal dashboard mid d_data save",d_data1)

        return await this.dashboardDataRepository.save(d_data1)
      }
    }

  }
  async d_data_update(data,orders){
    // console.log("data",data);
    // let currentTime6 = new Date();     
    // let currentTime7 = currentTime6.toLocaleTimeString();
    // console.log("in d_data_update",currentTime7)
    let current_date = new Date();
    if(data.barChart.length<1){
    for(let i = 0; i < 8; i++){
        let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        data.barChart.push({name : month, value : Number(0)});
    } 
  }
    console.log("in d_data_update mid")

    var bar = new Promise((resolve, reject) => {
      orders.forEach(async (C, i, array) => {
        data.orders.total++; 
        data.orders.submitted++;
        if(C.paid_status=="unpaid")
        {
          data.payments.due+=Number(C.total);
        }
        else{
        data.payments.paid += Number(C.total) || 0;
        }
        data.payments.total += Number(C.total) || 0;
            if(C.status === 'fulfilled'){
                data.orders.completed++;
            }
            else {
                data.orders.inProgress++;
            }
            let a;
            for(a of C.details.line_items){
              if(a.sku.startsWith('.')){
                a.sku=a.sku.substring(1)
              }
              let product=await this.productService.getProductBySku(a.sku)
              if(product){ 
              // console.log(product.categoryId,product.zohoBooksProductId); 
                let found = data.pieChart.find(element => element.name == product.categoryId.toString());
                // console.log('found',found);
                if(found){    
                    found.value += Number(a.item_total) || 0;
                }
                else {
                    data.pieChart.push({name : product.categoryId, value : Number(a.quantity)});
                }
                // console.log("piechart",data.pieChart); 
              }
              else{
                let found = data.pieChart.find( element => element['name'] == "Others".toString());
                // console.log('found',found);
                if(found){
                    found.value += Number(a.item_total) || 0;
                }
                else {
                    data.pieChart.push({name : 'Others', value : Number(a.item_total)});
                }     
                // console.log("product",a);
              }
                 
                }
        let date = new Date(C.date);
        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        let foundBar = data.barChart.find(element => element.name === month);
        if(foundBar){
            foundBar.value += Number(C.total) || 0;
        }
        else{
            data.barChart.push({C : month, value : Number(C.total)});
        }
        // console.log("barChart",data.barChart); 
        if(orders.length-1  === i){
        // console.log("barChart",data);
            resolve(data);
        }
    });
  });
  // console.log("in d_data_update end",bar)
  return bar;
  }

  async updatepieChart(data: any) {
    let pieChart = data.pieChart;
    let pieChartArray = [];
    for(let i=0;i<pieChart.length;i++){
        pieChartArray.push(pieChart[i]); 
    } 
    for(let i=0;i<pieChartArray.length;i++)
    {   
        if(pieChartArray[i].name!=="Others"&&pieChartArray[i].name!=="Uniform & Work Accessories"&&pieChartArray[i].name!=="F&B Products"&&pieChartArray[i].name!=="Housekeeping"&&pieChartArray[i].name!=="Packaging"&&pieChartArray[i].name!=="Corporate Gifting"&&pieChartArray[i].name!=="Electronics & Electricals"&&pieChartArray[i].name!=="Safety & Wellness"){
        let product = pieChartArray[i].name.toString();
        pieChartArray[i].name = await this.categoryService.categoryName(product);
        }
    }
    // pieChartArray=await this.setPieChartCategory(pieChartArray)
var holder = {};
pieChartArray.forEach(function(d) {
  if (holder.hasOwnProperty(d.name)) {
    holder[d.name] = holder[d.name] + d.value;
  } else {
    holder[d.name] = d.value;
  }
});

var obj2 = [];

for (var prop in holder) {
  obj2.push({ name: prop, value: holder[prop] });
}
// console.log("obj2",obj2)
    data.pieChart = obj2;
    return data;
}

async setPieChartCategory(data: any){
  var bar = await new Promise((resolve, reject) => {
    data.forEach(async (C, i, array) => {
        
      if(C.name!=="Others"&&C.name!=="Uniform & Work Accessories"&&C.name!=="F&B Products"&&C.name!=="Housekeeping"&&C.name!=="Packaging"&&C.name!=="Corporate Gifting"&&C.name!=="Electronics & Electricals"&&C.name!=="Safety & Wellness"){
        let product = C.name.toString();
        C.name = await this.categoryService.categoryName(product);
        }
      if(data.length-1  === i){
            resolve(data);
        }
    });
  });

  return bar
}


async createNewsaleOrder(user,salesOrder) {
  let res=await this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27')
   res.data.orders.total++;
    res.data.orders.submitted++;
    if(salesOrder.paid_status=="unpaid")
    {
      res.data.payments.due+=Number(salesOrder.total);
    }
    else{
    res.data.payments.paid += Number(salesOrder.total) || 0;
    }
    res.data.payments.total += Number(salesOrder.total) || 0;
    await this.dashboardDataRepository.update('62ef33a6aa3b932525b5ef27',res)
  console.log("added for admin data");
  let res1=await this.dashboardDataRepository.findOne({userId:user.id})
  res1.data.orders.total++;
  res1.data.orders.submitted++;
  if(salesOrder.paid_status=="unpaid")
  {
    res1.data.payments.due+=Number(salesOrder.total);
  }
  else{
  res1.data.payments.paid += Number(salesOrder.total) || 0;
  }
  res1.data.payments.total += Number(salesOrder.total) || 0;

      // return res;
      await this.dashboardDataRepository.update(res.id,res1)
      return "added for user data and admin data";
  

}
async calDashboardData1(user,salesOrders){
  if(user.roles.includes('PRODO_ADMIN')){
    let res=await this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27')
    // console.log("Admin",res)

    if(res){
       let d_data={
        userId:'62e978c437a104c778675a82',
        data:{
        orders : {
            total : 0,
            completed : 0,
            inProgress : 0,
            submitted:0,
            cancelled : 0
        },
        rfq : {
            approved : 0,
            rejected : 0,
            inProgress : 0,
            total_submitted:0,
        },
        payments : {
            total : 0,
            paid : 0,
            due : 0,

        },
        pieChart : [],
        barChart : []
    }
  }
  // console.log("hello sync",d_data,res)
  d_data.data=await this.d_data_update(d_data.data,salesOrders)
  // console.log("hello sync2",d_data)

  d_data.data=await this.updatepieChart(d_data.data)
  // return d_data
  return await this.dashboardDataRepository.update('62ef33a6aa3b932525b5ef27',d_data)
  }
  else{
    return "user not admin"
  }
}
  else{
    let res=await this.dashboardDataRepository.findOne({userId:`${user.id}`})
     console.log("normal",res)
    if(res){
      let d_data1={
        userId:`${user.id}`,
        data:{
        orders : {
            total : 0,
            completed : 0,
            inProgress : 0,
            submitted:0,
            cancelled : 0
        }, 
        rfq : {
            approved : 0,
            rejected : 0,
            inProgress : 0,
            total_submitted:0,
        },
        payments : {
            total : 0,
            paid : 0,
            due : 0,

        },
        pieChart : [],
        barChart : []
    }
  }

    d_data1.data=await this.d_data_update(d_data1.data,salesOrders)
    console.log("hello d data update",d_data1)

    d_data1.data=await this.updatepieChart(d_data1.data)
    console.log("hello piechart update",d_data1)


      // return d_data1
     return await this.dashboardDataRepository.update(res.id,d_data1) 
    }
    else{
      return "user have no orders"
    }   
  }

}
async allDashboardData(){
  let res=await this.dashboardDataRepository.find()
  return res
}
async salesOrderReview(sup){
  let user_id=sup.user_id;
  let item_id=sup.zohoId;
  let prodo_id=sup.prodoId;
  let comment=sup.comment;
  let rating=sup.rating;
  let package_Id=sup.packageId

  let data=await this.salesOrderReviewRepository.findOne({where:{zohoId:item_id,userId:user_id,packageId:package_Id}})
  if(data){
    data.comment=comment
    data.rating=rating
    await this.salesOrderReviewRepository.update(data.id,data)
    return data
  }
  else{
    let data1={
      userId:user_id,
      zohoId:item_id,
      comment:comment,
      rating:rating,
      packageId:package_Id,
      prodoId:prodo_id
    }
    await this.salesOrderReviewRepository.save(data1)
    return data1
  }
}
async getReview(item_id,user_id,package_id){
  let data=await this.salesOrderReviewRepository.findOne({where:{zohoId:item_id,userId:user_id,packageId:package_id}})
  if(data){
    return data
  }
  else{
    return {
      userId:user_id,
      zohoId:item_id,
      comment:"",
      rating:0,
      packageId:package_id,
      prodoId:""
    }

    // return {message:"no data",status:404}
  }
  }

  async sendMailWithTemplate(templateName:any,subject:any) {
    let users=await this.userRepository.find()
    let no=1
    for (let user of users) {
      user.usersNo=no
      no++
    }
    // return users
    let data=[]
    let m=1
    for (const itemData of users) {
        if(itemData.usersNo%95>0){
            let found = data.find(element => element.id === m);
            if(found){
                found.emails.push(itemData.email)
            }
            else {
                data.push({id : m, emails :[itemData.email] });
            }
        }
        else{
            m++
            let found = data.find(element => element.id === m);
            if(found){
                found.emails.push(itemData.email)
            }
            else {
                data.push({id : m, emails :[itemData.email] });
            }
        }
    }
    
    // return data

    let mailOutput=[]
    for (const itemData of data) {  //remove this
        let bcc = itemData.emails //remove this
        // let bcc = ["mehul.mina@prodo.in","abhishek.gupta@prodo.in"] //comment this
            let mailTrigger = {
                from: 'Team Prodo', 
                bcc: bcc,
                subject: subject,
                template: templateName,
                templatevars: {
                },
              };
              await this.mailService.sendBulkMailToManufacturer(mailTrigger)
              mailOutput.push("Mail sent")
    }     //remove this
  return mailOutput 
}


  async fixAllUsers(){
    let allUser= await this.userRepository.find();
    // return allUser
    let res=[]
    for (let i = 0; i < allUser.length; i++) {
      // res.push(allUser[i]);
      var user = allUser[i];
      // res.push(user);
      if(!user.organization_id){
        res.push({"error":user})
      }
      else {

      user.orgRole= "ORG_ADMIN"

      if(!user.orgIdRoles){
      user.orgIdRoles=[]
      }
      user.orgIdRoles=await this.addRole(user.orgIdRoles,user.organization_id,'ORG_ADMIN')
      if(!user.orgIds){
        user.orgIds=[]
        }
      user.orgIds.push(`${user.organization_id}`)
      user.orgIds = [...new Set(user.orgIds)];

      res.push({email:user.email,details:await this.userRepository.save(user)});

      }
    }
    return res
  }
  async fixAllUsersOrganizations(){
    let allUser= await this.userRepository.find();
    // return allUser
    let res=[]
    for (let i = 0; i < allUser.length; i++) {
      var user = allUser[i];
      console.log(user.email," data fixing", i)
      let organization= await this.organizationService.fixOldData(user.organization_id)
      res.push(organization);
    }
    return res
  }

  async findAllUsers(){
    let allUser= await this.userRepository.find();
    return allUser
  }

  async setProfilePicture(profilePicture:any,userId:string){
    let user=await this.userRepository.findOne(userId)
    if(user){
      user.profilePicture=profilePicture
      let m=await this.userRepository.update(userId,user)
      return user
    }
    else{
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT_FOUND',
        message: "User Not Found",
      }, HttpStatus.NOT_FOUND);
    }

  }

  async addNewOrganization(user:any,organizationData:any,userRole:string,accountId:string){
    // return organizationData
    // console.log("Creating Organization data of email",user.email)
    organizationData.account_id=String(accountId)
     let updatedData={}
    //  console.log(updatedData.Organization)
    //  return updatedData
    updatedData.organization=await this.organizationService.newOrgSave(organizationData,"New")
    if(updatedData.organization){
    let orgId= String(updatedData.organization.id)
      if(user.orgIds.includes(orgId)){
        console.log("User Allready in this Organization ")
        // throw new HttpException({
        //   status: HttpStatus.BAD_REQUEST,
        //   error: 'Bad request',
        //   message:"Allready have that customer id organization",
        // }, HttpStatus.BAD_REQUEST);
       }
       else{
        user.orgIds.push(orgId)
        user.orgIdRoles=await this.addRole(user.orgIdRoles,orgId,userRole)
        if(!user.organization_id){
            user.organization_id=orgId
            user.orgRole=userRole
        }
       }
      //  return user
      await this.userRepository.update(user.id,user)
      updatedData.user=user
      return updatedData
    }
    else{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Forbidden',
        message: "Error in Saving Data"
      }, HttpStatus.BAD_REQUEST);
    }

  }

  async updateData(user:any){
    console.log("Updating data of email",user.email)
    let organization_id=user.organization_id
    let organization=await this.organizationService.findOne(organization_id)
    organization.account_id=String(user.accountId)
    let updatedData=await this.organizationService.newOrgSave(organization,"Old")
    // return updatedData
    if(updatedData){
      if(user.orgIds.includes(updatedData.orgId)){
        console.log("User Allready in this Organization ")
       }
       else{
        user.orgIds.push(updatedData.orgId)
        user.orgIdRoles=await this.addRole(user.orgIdRoles,updatedData.orgId,'ORG_ADMIN')
        if(!user.organization_id){
            user.organization_id=updatedData.orgId
            user.orgRole='ORG_ADMIN'
        }
       }
       if(user.companyIds.includes(updatedData.companyId)){
        console.log("User Allready in this Company ")
        user.companyId=updatedData.companyId
       }
       else{
        user.companyIds.push(updatedData.companyId)
        user.companyIdRoles=await this.addRole(user.companyIdRoles,updatedData.companyId,'COMPANY_ADMIN')
        if(!user.companyId){
          user.companyId=updatedData.companyId
          user.companyRole='COMPANY_ADMIN'
        }
       }
       if(user.entityIds.includes(updatedData.entityId)){
        console.log("User Allready in this Entity ") 
        user.entityId=updatedData.entityId
       }
       else{
        user.entityIds.push(updatedData.entityId)
        user.entityIdRoles=await this.addRole(user.entityIdRoles,updatedData.entityId,'ENTITY_ADMIN')
        if(!user.entityId){
          user.entityId=updatedData.entityId
          user.entityRole='ENTITY_ADMIN'
        }
       }
       user.orgRole="ORG_ADMIN"
      await this.userRepository.update(user.id,user)
      // updatedData.user=user 
      return updatedData
    }
    else{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Forbidden',
        message: "Error in Saving Data"
      }, HttpStatus.BAD_REQUEST);
    }
  }
 
  
  async orgUsers(ids:any){
    let filterData=[]
    for(let i = 0;i<ids.length;i++){
    filterData.push({orgIds:ids[i]})
    }
    let filter = {
        $or: filterData
    };
    let users = await this.userRepository.find({ where: filter });
    let resultUsers = []
    let org
    for(let j=0;j<ids.length;j++){
      // console.log(ids)
      org=await this.organizationRepository.findOne(ids[j])
      for (let user of users)  {
        let orgIdRoles=[]
        let companyIdRoles=[]
        let entityIdRoles=[]
        let orgRole=user.orgIdRoles.find( j => j.id==org.id)
        if(orgRole){
          orgIdRoles.push(orgRole)
        }
        for (let c of org.companyIds) 
        {
          let comRole=user.companyIdRoles.find( j => j.id==c)
          if(comRole){
            companyIdRoles.push(comRole)
          }
        }
        for (let e of org.entityIds) 
        {
          let eRole=user.entityIdRoles.find( j => j.id==e)
          if(eRole){
            entityIdRoles.push(eRole)
          }
        }
        let find = resultUsers.find(i => i.id==user.id)
        if(find){
          if(orgIdRoles.length>0){
            find.orgIdRoles=orgIdRoles
          }
          if(companyIdRoles.length>0){
            find.companyIdRoles=companyIdRoles
          }
          if(entityIdRoles){
            find.entityIdRoles=entityIdRoles
          }
        }
        else {
          resultUsers.push(
            {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              contactNumber:user.contactNumber,
              email:user.email,
              orgIdRoles:orgIdRoles,
              companyIdRoles:companyIdRoles,
              entityIdRoles:entityIdRoles
            }
          )
        }
  
      }
  }
  return resultUsers
  }


  async companyUsers(ids:any){
    let filterData=[]
    for(let i = 0;i<ids.length;i++){
    filterData.push({companyIds:ids[i]})
    }
    let filter = {
        $or: filterData
    };
    let users = await this.userRepository.find({ where: filter });
    let resultUsers = []
    let company
    for(let j=0;j<ids.length;j++){
      // console.log(ids)
      company=await this.companyRepository.findOne(ids[j])
      for (let user of users)  {
        let orgIdRoles=[]
        let companyIdRoles=[]
        let entityIdRoles=[]

        let compRole=user.companyIdRoles.find( j => j.id==company.id)
        if(compRole){
          companyIdRoles.push(compRole)
        }

        let orgRole=user.orgIdRoles.find( j => j.id==company.organization_id)
        if(orgRole){
          orgIdRoles.push(orgRole)
        }

        for (let e of company.entityIds) 
        {
          let eRole=user.entityIdRoles.find( j => j.id==e)
          if(eRole){
            entityIdRoles.push(eRole)
          }
        }
        let find = resultUsers.find(i => i.id==user.id)
        if(find){
          if(orgIdRoles.length>0){
            find.orgIdRoles=orgIdRoles
          }
          if(companyIdRoles.length>0){
            find.companyIdRoles=companyIdRoles
          }
          if(entityIdRoles.length){
            find.entityIdRoles=entityIdRoles
          }
        }
        else {
          resultUsers.push(
            {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              contactNumber:user.contactNumber,
              email:user.email,
              orgIdRoles:orgIdRoles,
              companyIdRoles:companyIdRoles,
              entityIdRoles:entityIdRoles
            }
          )
        }
  
      }
  }
  return resultUsers

  }


  async entityUsers(ids:any){
    // console.log(ids)
    let filterData=[]
    for(let i = 0;i<ids.length;i++){
    filterData.push({entityIds:ids[i]})
    }
    let filter = {
        $or: filterData
    };
    let users = await this.userRepository.find({ where: filter });
    let result = []
    let resultUsers = []
    let entity
    for(let j=0;j<ids.length;j++){
      // console.log(ids)
      entity=await this.entityRepository.findOne(ids[j])
      for (let user of users)  {
        let orgIdRoles=[]
        let companyIdRoles=[]
        let entityIdRoles=[]

        let compRole=user.companyIdRoles.find( j => j.id==entity.companyId)
        if(compRole){
          companyIdRoles.push(compRole)
        }

        let orgRole=user.orgIdRoles.find( j => j.id==entity.organization_id)
        if(orgRole){
          orgIdRoles.push(orgRole)
        }

        let entRole=user.entityIdRoles.find( j => j.id==entity.id)
        if(entRole){
          entityIdRoles.push(entRole)
        }
        let find = resultUsers.find(i => i.id==user.id)
        if(find){
          if(orgIdRoles.length>0){
            find.orgIdRoles=orgIdRoles
          }
          if(companyIdRoles.length>0){
            find.companyIdRoles=companyIdRoles
          }
          if(entityIdRoles.length>0){
            find.entityIdRoles=entityIdRoles
          }
        }
        else {
          resultUsers.push(
            {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              contactNumber:user.contactNumber,
              email:user.email,
              orgIdRoles:orgIdRoles,
              companyIdRoles:companyIdRoles,
              entityIdRoles:entityIdRoles
            }
          )
        }
  
      }
  }
  return resultUsers
  }

  async makeDummyUser(email:any){
    let user1=await this.findByEmail(email)
    if(user1){
     let account=await this.accountRepository.findOne(user.accountId)
     account.email=email
     await this.accountRepository.update(account.id,account)
     user1.roles=[UserRole.USER,UserRole.CLIENT,UserRole.ADMIN,UserRole.createRFQ]
     await this.userRepository.update(user1.id,user1)
      return user1
    }
    console.log("New dummy user")
    if(!email.includes('@')){
      throw new HttpException({
        status: HttpStatus.FAILED_DEPENDENCY,
        error: "Error from zoho fields in user", 
        message: "Field error email", 
      }, HttpStatus.FAILED_DEPENDENCY);
    } 
     let user=new User()
     let account=await this.accountRepository.findOne({where:{email:email}})
     if(!account){
      // console.log("new account creation")
      account=new Account()
      account.type=AccountType.EXTERNAL
      account.email=email
      account=await this.accountRepository.save(account)
     }
   
    let firstName=email.split('@')[0]
    firstName=firstName.split('.')
    let lastName=firstName[1]?firstName[1]:" "
    firstName=firstName[0]
      user.email=email
      user.firstName=firstName
      user.lastName=lastName
      user.contactNumber=""
      user.password="dbfd2fc50d850c89daba5a1cace7c223891c34a3"      //nAo7Nk13!
      user.createdAt=new Date()
      user.updatedAt=new Date()
      user.accountId=account.id
      user.isVerified=false
      user.orgIds=[]
      user.companyIds=[]
      user.entityIds=[]
      user.status=UserStatus.ACTIVE 
      user.userType=UserType.ZOHO 
      user.roles=[UserRole.USER,UserRole.CLIENT,UserRole.ADMIN,UserRole.createRFQ] 
      user.teams=[]
  
     return await this.userRepository.save(user)
  }

  async zohoPocUsers(emails:any){
    let users=[]
    if(emails.length>0){
      for(let i of emails){
        if(!i.includes('@')){
          throw new HttpException({
            status: HttpStatus.FAILED_DEPENDENCY,
            error: "Error from zoho fields in user",
            message: "Field error email not valid",
          }, HttpStatus.FAILED_DEPENDENCY);
        }
        let user=await this.findByEmail(i)
        if(user){
          await this.userRepository.update(user.id,user)
            users.push(user)
        }
        else{
          let dummy=this.makeDummyUser(i)
          users.push(dummy)
        }
      }
     return users
    }
    else{
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Error from zoho fields in user",
          message: "Field error email of pocs not found",
        }, HttpStatus.NOT_FOUND);
    }
  }

  async addRole(IdRoles:[],id:string,role:string){
    const find = IdRoles.find(data => data.id == id);
      if(find){
        find.role=role
        return IdRoles
      }
      IdRoles.push({"id" :`${id}`,"role" :`${role}`})
    return IdRoles
  }

  async addAdminRole(user:any){
    // throw new HttpException({
    //   status: HttpStatus.EXPECTATION_FAILED,
    //   error: 'EXPECTATION_USER',
    //   message: user,
    // }, HttpStatus.EXPECTATION_FAILED);
    if(!user.orgIds.includes(user.organization_id))
    {
      user.orgIds.push(user.organization_id)
      user.orgRole="ORG_ADMIN"
      user.orgIdRoles=await this.addRole(user.orgIdRoles,user.organization_id,"ORG_ADMIN")
    }
    if(!user.companyIds.includes(user.companyId))
    {
      user.companyIds.push(user.companyId)
      user.companyRole="COMPANY_ADMIN"
      user.companyIdRoles=await this.addRole(user.companyIdRoles,user.companyId,"COMPANY_ADMIN")
    }
    if(!user.entityIds.includes(user.entityId))
    {
      user.entityIds.push(user.entityId)
      user.entityRole="ENTITY_ADMIN"
      user.entityIdRoles=await this.addRole(user.entityIdRoles,user.entityId,"ENTITY_ADMIN")
    }
  return user
    
  }
  async addCompanyRole(user:any){
    if(!user.orgIds.includes(user.organization_id))
    {
      user.orgIds.push(user.organization_id)
      user.orgRole="ORG_EMPLOYEE"
      user.orgIdRoles=await this.addRole(user.orgIdRoles,user.organization_id,"ORG_EMPLOYEE")
    }
    if(!user.companyIds.includes(user.companyId))
    {
      user.companyIds.push(user.companyId)
      user.companyRole="COMPANY_ADMIN"
      user.companyIdRoles=await this.addRole(user.companyIdRoles,user.companyId,"COMPANY_ADMIN")
    }
    if(!user.entityIds.includes(user.entityId))
    {
      user.entityIds.push(user.entityId)
      user.entityRole="ENTITY_ADMIN"
      user.entityIdRoles=await this.addRole(user.entityIdRoles,user.entityId,"ENTITY_ADMIN")
    }
  return user
  }
  async addEntityRole(user:any){
     if(!user.orgIds.includes(user.organization_id))
    {
      user.orgIds.push(user.organization_id)
      user.orgRole="ORG_EMPLOYEE"
      user.orgIdRoles=await this.addRole(user.orgIdRoles,user.organization_id,"ORG_EMPLOYEE")
    }
    if(!user.companyIds.includes(user.companyId))
    {
      user.companyIds.push(user.companyId)
      user.companyRole="COMPANY_EMPLOYEE"
      user.companyIdRoles=await this.addRole(user.companyIdRoles,user.companyId,"COMPANY_EMPLOYEE")
    }
    if(!user.entityIds.includes(user.entityId))
    {
      user.entityIds.push(user.entityId)
      user.entityRole="ENTITY_ADMIN"
      user.entityIdRoles=await this.addRole(user.entityIdRoles,user.entityId,"ENTITY_ADMIN")
    }
  return user
  }
  async addEmployeeRole(user:any){
    if(!user.orgIds.includes(user.organization_id))
    {
      user.orgIds.push(user.organization_id)
      user.orgRole="ORG_EMPLOYEE"
      user.orgIdRoles=await this.addRole(user.orgIdRoles,user.organization_id,"ORG_EMPLOYEE")
    }
    if(!user.companyIds.includes(user.companyId))
    {
      user.companyIds.push(user.companyId)
      user.companyRole="COMPANY_EMPLOYEE"
      user.companyIdRoles=await this.addRole(user.companyIdRoles,user.companyId,"COMPANY_EMPLOYEE")
    }
    if(!user.entityIds.includes(user.entityId))
    {
      user.entityIds.push(user.entityId)
      user.entityRole="ENTITY_EMPLOYEE"
      user.entityIdRoles=await this.addRole(user.entityIdRoles,user.entityId,"ENTITY_EMPLOYEE")
    }
  return user
  }


  async zohoUsersUpdate(users1:any,orgId:any,companyId:any,entityId:any){
    let users=users1
    for(let i=0;i<users.length;i++){
      let user=users[i]
      user.organization_id=String(orgId)
      user.companyId=String(companyId)
      user.entityId=String(entityId)
      switch (i) {
        case 0:
          user=await this.addAdminRole(user)
          await this.userRepository.update(user.id,user)
          break;
        case 1:
          user=await this.addCompanyRole(user)
          await this.userRepository.update(user.id,user)
          break;
        case 2:
          // user=await this.addEntityRole(user)
          user=await this.addCompanyRole(user)
          await this.userRepository.update(user.id,user)
          break;
        default:
          // user=await this.addEmployeeRole(user)
          user=await this.addCompanyRole(user)
          await this.userRepository.update(user.id,user)
      }
    }
    return users
  }


  async switchupdate1(user:any) {
  return await this.userRepository.save(user)
}
/////////////////////////////////
async switchupdate(user :any,id:any,authority:any,type :any){

  if(authority =="PRODO_ADMIN"){
    await this.userRepository.update(user.id,user)
  }
  if(authority =="NOT_PRODO_ADMIN"){
    if(type == "organization"){
      let organization = await this.organizationRepository.findOne(id)
      if(organization.status == "ACTIVE"){
       user = await this.userRepository.update(user.id,user)

      }
      if(organization.status =="INACTIVE"){
        console.log("throw exception");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'not found', 
          message: "Organization not found",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
    if(type == "company"){
      let company = await this.companyRepository.findOne(id)
      if(company.status == "ACTIVE"){
       user = await this.userRepository.update(user.id,user)

      }
      if(company.status =="INACTIVE"){
        console.log("throw exception");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'not found', 
          message: "company not found",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
    if(type == "entity"){
      let entity = await this.entityRepository.findOne(id)
      if(entity.status == "ACTIVE"){
      user =  await this.userRepository.update(user.id,user)

      }
      if(entity.status =="INACTIVE"){
        console.log("throw exception");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'Not Found', 
          message: "Entity not found",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
  }
  // await this.userRepository.update(user.id,user)
  return user
}

async findusers(ids:any):Promise<User[]>{
let filterData=[]
for(let i = 0;i<ids.length;i++){
filterData.push({_id:ObjectId(ids[i])})
}
let filter = {
    $or: filterData
};
 console.log(filter)
const users = await this.userRepository.find({ where: filter });
return users
}

async adminLevelSwitch(type :any,check :any,user:any,adminUser:any,data:any){
// let skip = await this.userRepository.find({where : {orgIds : })
let compSkip
let orgSkip
let entSkip
if(check == "PRODO_ADMIN"){
console.log("prodo admin has requested switching so do it");
if(type == "organization"){
  orgSkip = await this.userRepository.find({where : {orgIds : data.id}})
  if(orgSkip.length<2){
    console.log("throw exception of adminkloss");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Admin loss might occur",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  else{
    await this.switchingfunc(type,user,data)  
 }
}
if(type == "company"){
  compSkip = await this.userRepository.find({where : {companyIds : data.id}})
  if(compSkip.length<2){
    console.log("throw exception of adminkloss");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Admin loss might occur",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  else{
    await this.switchingfunc(type,user,data)  
 }
}
if(type == "entity"){
  entSkip = await this.userRepository.find({where : {entityIds : data.id}})
  if(entSkip.length<2){
    console.log("throw exception of adminkloss");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Admin loss might occur",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  else{
     await this.switchingfunc(type,user,data)  
  }
}
// await this.switchingfunc(type,user,data)  
}
if(check =="NOT_PRODO_ADMIN"){
console.log("further checks will happen here ");
if(type == "organization"){
  console.log("org switching is requested");
  let organization = await this.organizationRepository.findOne(data.id)
  if(organization.status=="INACTIVE"){
    console.log("throw exception that you cannot change role to an inactive organization");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Organization does not exists",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  if(adminUser.accountId == organization.account_id){
    console.log("adminuser is the suoer admin of the organization therefore can do the switching");
    if(user.orgIds.includes(data.id)){
      console.log("switching is possible"); 
    await this.switchingfunc(type,user,data)

    }
    else{
      console.log("throw exception because the user is not part of the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User not part of the organization",
      }, HttpStatus.EXPECTATION_FAILED)
    }
  }
  else{
    console.log("throw exception that rest of the users cannot change the role because on same level it is not possible ");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user authority mismatch",
    }, HttpStatus.EXPECTATION_FAILED)
    
  }
}
if(type == "company"){
console.log("copany switch is requested");
let company = await this.companyRepository.findOne(data.id)
if(company.status == "INACTIVE" || !company){
  console.log("throw exception that cannot switch into nothing");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "company does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
let organization = await this.organizationRepository.findOne(company.organization_id)
if(!organization){
  console.log("throw exception that db error has occured");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Db error",
  }, HttpStatus.EXPECTATION_FAILED)
}
if(adminUser.accountId == organization.account_id){
  console.log("user is the super admin for the organization of the company therefpre can perform the switching");
  if(user.companyIds.includes(data.id)){
    console.log("switching is possible"); 
    await this.switchingfunc(type,user,data)

  }
  else{
    console.log("throw exception because the user is not part of the organization");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user not part of the company",
    }, HttpStatus.EXPECTATION_FAILED)
  }
}
for(let i of adminUser.orgIdRoles){
  if(i.id == company.organization_id && i.role == "ORG_ADMIN"){
    console.log("switching agin is possible"); 
    await this.switchingfunc(type,user,data)

  }
  if(i.id == company.organization_id && i.role !== "ORG_ADMIN"){
    console.log("throw exception because switching is not allowed on same levels");  
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Switching not allowed on same levels",
    }, HttpStatus.EXPECTATION_FAILED)
  }
}

}
if(type == "entity"){
console.log("entity switch is requested");
let entity = await this.entityRepository.findOne(data.id)
if(!entity || entity.status == "INACTIVE"){
  console.log("throw exception that you cannot switch into nothing");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Entity does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
let organization = await this.organizationRepository.findOne(entity.organization_id)
let company = await this.companyRepository.findOne(entity.companyId)
if(!organization || !company){
  console.log("throw db error that somehow org or company does not exist for entity");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "db error",
  }, HttpStatus.EXPECTATION_FAILED)
}
if(adminUser.accountId == organization.account_id){
  console.log("the user can performm switching because he is the super admin of the organization where the entity lies");
  if(user.entityIds.includes(data.id)){
    console.log("you can perform the switching");
    await this.switchingfunc(type,user,data)

  }
  else{
    console.log("throw exception that user is not part of the desired entity");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "User not part of the entity",
    }, HttpStatus.EXPECTATION_FAILED)
  }
}
for(let i of adminUser.orgIdRoles){
  if(i.id == organization.id && i.role =="ORG_ADMIN"){
    console.log("here too switching can take place");
    await this.switchingfunc(type,user,data)

  }
}
for(let i of adminUser.companyIdRoles){
  if(i.id == company.id && i.role == "COMPANY_ADMIN"){
    console.log("the user can perform the switching");
    await this.switchingfunc(type,user,data)
  }
  if(i.id == company.id && i.role !== "COMPANY_ADMIN"){
    console.log("throw exception that on same levels switching is not allowed");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Same level switching is forbidden",
    }, HttpStatus.EXPECTATION_FAILED)
  }
}
for(let i of adminUser.entityIdRoles){
  if(i.id == entity.id && i.role == "ENTITY_ADMIN"){
    console.log("the user can perform the switching");
    await this.switchingfunc(type,user,data)
  }
  if(i.id == entity.id && i.role !== "ENTITY_ADMIN"){
    console.log("throw exception that on same levels switching is not allowed");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'same level switching is forbidden',
      message: "Invalid User",
    }, HttpStatus.EXPECTATION_FAILED)
  }
}

}
}
}


async switchingfunc(type :any,user:any,data:any){
if(type == "organization"){
console.log("here finally switching will take place");
for(let i of user.orgIdRoles){
  if(i.id == data.id){
    i.role = data.role
  }
}
console.log("here save it");

}
if(type == "company"){
console.log("here finally switching will take place");
for(let i of user.companyIdRoles){
  if(i.id == data.id){
    i.role = data.role
  }
}
console.log("here save it");

}
if(type == "entity"){
console.log("here finally switching will take place");
for(let i of user.entityIdRoles){
  if(i.id == data.id){
    i.role = data.role
  }
}
console.log("here save it");

}
}


async superSwitch(user :any,type:any,data:any,id:any){
if(type == "organization"){
console.log("org switch is requested");
let organization = await this.organizationRepository.findOne(id)
if(!organization){
  console.log("throw exception that the org does not exists");  
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "organization does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
if (user.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("we can perform switching");
user.orgId = id
user.orgRole = data.role
}
if(organization.status == "INACTIVE"){
  console.log("switching cannot take place to nothing");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "organization does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
if(user.orgIds.includes(id)){
  console.log("switching might take place");
  for(let i of user.orgIdRoles){
    if(i.id == id && i.role == "ORG_ADMIN"){
      console.log("switching will finally take place");
      user.orgId = id
      user.orgRole = data.role
    }
    if(i.id == id && i.role !== "ORG_ADMIN"){
      console.log("throw error that you are not admin");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "You are not admin",
      }, HttpStatus.EXPECTATION_FAILED)
    }
  }
}
}
if(type == "company"){
console.log("company switch is requested");
let company = await this.companyRepository.findOne(id)
if(!company){
  console.log("throw exception that the org does not exists"); 
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "company does not exists",
  }, HttpStatus.EXPECTATION_FAILED) 
}
if (user.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("we can perform switching");
user.companyId = id
user.companyRole = data.role
}
if(company.status == "INACTIVE"){
  console.log("switching cannot take place to nothing");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "company does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
if(user.companyIds.includes(id)){
  console.log("switching might take place");
  for(let i of user.companyIdRoles){
    if(i.id == id && i.role == "COMPANY_ADMIN"){
      console.log("switching will finally take place");
      user.companyId = id
      user.companyRole = data.role
    }
    if(i.id == id && i.role !== "COMPANY_ADMIN"){
      console.log("throw error that you are not admin");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "You are not admin",
      }, HttpStatus.EXPECTATION_FAILED)
    }
  }
}
}
if(type == "entity"){
console.log("entity switch is requested");
let entity = await this.entityRepository.findOne(id)
if(!entity){
  console.log("throw exception that the ent does not exists");  
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "entity does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
if (user.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("we can perform switching");
user.entityId = id
user.entityRole = data.role
}
if(entity.status == "INACTIVE"){
  console.log("switching cannot take place to nothing");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "entity does not exists",
  }, HttpStatus.EXPECTATION_FAILED)
}
if(user.entityIds.includes(id)){
  console.log("switching might take place");
  for(let i of user.entityIdRoles){
    if(i.id == id && i.role == "ENTITY_ADMIN"){
      console.log("switching will finally take place");
      user.entityId = id
      user.entityRole = data.role
    }
    if(i.id == id && i.role !== "ENTITY_ADMIN"){
      console.log("throw error that you are not admin");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "You are not admin",
      }, HttpStatus.EXPECTATION_FAILED)
    }
  }
}
}
else{
console.log("throw exception that invalid switch is requested");
throw new HttpException({
  status: HttpStatus.EXPECTATION_FAILED,
  error: 'EXPECTATION_FAILED',
  message: "Invalid Switch is requested",
}, HttpStatus.EXPECTATION_FAILED)

}
}


async toAddTheUser(type :any,data:any,user:any,adminUser:any){
if(type == "organization"){
console.log("addding into the organization");
let organization = await this.organizationRepository.findOne(data.id)
if(!organization){
  console.log("throw exception that no org exists for the provided id");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Organization Does not exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("he can definitely add the user to an organization ");
  if(user.orgIds.includes(data.id)){
    console.log("throw exception that user is already a part of the organiation");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user is already part of the organization",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  else{
    console.log("here add the user to the organization"); 
    user.orgIds.push(data.id)
    user.orgIdRoles.push({id : data.id,role : data.role})
  }
}
if(adminUser.accountId == organization.account_id){
  console.log("adminuser is the super admin of the org therefore can add to the organiaztion");
  if(organization.status == "INACTIVE"){
    console.log("throw exception canot add user to nothing");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "organization does not exists",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  if(organization.status == "ACTIVE"){
    console.log("here addition can take place");
    if(user.orgIds.includes(data.id)){
      console.log("throw exception that user is already a part of the organiation");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "already part of the organization",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    else{
      console.log("here add the user to the organization"); 
      user.orgIds.push(data.id)
    user.orgIdRoles.push({id : data.id,role : data.role})
    }
  }
}
for(let i of adminUser.orgIdRoles){
  if(i.id == organization.id && i.role =="ORG_ADMIN"){
    console.log("he too can perform addition");
    if(organization.status == "INACTIVE"){
      console.log("throw exception canot add user to nothing");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "organization does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    if(organization.status == "ACTIVE"){
      console.log("here addition can take place");
      if(user.orgIds.includes(data.id)){
        console.log("throw exception that user is already a part of the organiation");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user already in organization",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      else{
        console.log("here add the user to the organization"); 
        user.orgIds.push(data.id)
      user.orgIdRoles.push({id : data.id,role : data.role})
      }
    }
    
  }
}
}
if(type == "company"){
console.log("adding to the company");
let company = await this.companyRepository.findOne(data.id)
if(!company){
  console.log("throw exception that no sucjh company exists");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "company does not exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
let organiation = await this.organizationRepository.findOne(company.organization_id)
if(!organiation){
  console.log("throw db error that somehow no org exists for the company");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "db error",
  }, HttpStatus.EXPECTATION_FAILED);
}
if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("he can definitely add the usr to the company");
  if(user.companyIds.includes(data.id)){
    console.log("throw exception that user is already a part of the organiation");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user already part of the company",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  else{
    console.log("here add the user to the organization"); 
    user.companyIds.push(data.id)
    user.companyIdRoles.push({id : data.id,role : data.role})
  }
}
if(adminUser.accountId == organiation.account_id){
  console.log("the user is the super admin of the organization where the company resides therefore can perform the switching too");
  if(company.status =="ACTIVE"){
  if(user.companyIds.includes(data.id)){
    console.log("throw exception that user is already a part of the organiation");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user already part of the company",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  else{
    console.log("here add the user to the organization"); 
    user.companyIds.push(data.id)
    user.companyIdRoles.push({id : data.id,role : data.role})
  }
}
if(company.status =="INACTIVE"){
  console.log("throw exception taht cannot add to nothing");  
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "company does not exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
}
for(let i of adminUser.orgIdRoles){
  if(i.id == organiation.id && i.role == "ORG_ADMIN" ){
    console.log("he too can perform the addition");
    if(company.status =="ACTIVE"){
      if(user.companyIds.includes(data.id)){
        console.log("throw exception that user is already a part of the organiation");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user is already part of the company",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      else{
        console.log("here add the user to the organization"); 
        user.companyIds.push(data.id)
    user.companyIdRoles.push({id : data.id,role : data.role})
      }
    }
    if(company.status =="INACTIVE"){
      console.log("throw exception taht cannot add to nothing"); 
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "company does not exists",
      }, HttpStatus.EXPECTATION_FAILED); 
    }
  }
}
for(let i of adminUser.companyIdRoles){
  if(i.id == company.id && i.role =="COMPANY_ADMIN"){
    console.log("he too can perform addition");
    if(company.status =="ACTIVE"){
      if(user.companyIds.includes(data.id)){
        console.log("throw exception that user is already a part of the organiation");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user already part of the organization",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      else{
        console.log("here add the user to the organization"); 
        user.companyIds.push(data.id)
    user.companyIdRoles.push({id : data.id,role : data.role})
      }
    }
    if(company.status =="INACTIVE"){
      console.log("throw exception taht cannot add to nothing");  
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "company does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    
  }
}
}
if(type == "entity"){
console.log("adding to the entity");
let entity = await this.entityRepository.findOne(data.id)
if(!entity){
  console.log("throw exception that no entity exists ehre you made the request"); 
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Entity does not exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
let company = await this.companyRepository.findOne(entity.companyId)
if(!company){
  console.log("throw db error");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "db error",
  }, HttpStatus.EXPECTATION_FAILED);
}
let organization = await this.organizationRepository.findOne(entity.organization_id)
if(!organization){
  console.log("throw exception that a db error has occured");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "db error",
  }, HttpStatus.EXPECTATION_FAILED);
}
if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("prodo aadmin can add the user");
  if(user.entityIds.includes(data.id)){
    console.log("throw exception that user is already a part of the organiation");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user already part of the entity",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  else{
    console.log("here add the user to the organization"); 
    user.entityIds.push(data.id)
    user.entityIdRoles.push({id : data.id,role : data.role})
  } 
}
if(adminUser.accountId == organization.account_id){
  console.log("admin User is the super admin of the entity therefore can perform addition");
  if(entity.status =="ACTIVE"){
  if(user.entityIds.includes(data.id)){
    console.log("throw exception that user is already a part of the organiation");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "user already part of the entity",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  else{
    console.log("here add the user to the organization"); 
    user.entityIds.push(data.id)
    user.entityIdRoles.push({id : data.id,role : data.role})
  } 
}
if(entity.status =="INACTIVE"){
  console.log("throw exception that cannot add to nothing");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "entity does not exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
}
for(let i of adminUser.orgIdRoles){
  if(i.id == organization.id && i.role == "ORG_ADMIN"){
    console.log("he too can perform addition");
    if(entity.status =="ACTIVE"){
      if(user.entityIds.includes(data.id)){
        console.log("throw exception that user is already a part of the organiation");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user already part of the entity",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      else{
        console.log("here add the user to the organization"); 
        user.entityIds.push(data.id)
    user.entityIdRoles.push({id : data.id,role : data.role})
      } 
    }
    if(entity.status =="INACTIVE"){
      console.log("throw exception that cannot add to nothing");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "entity does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    } 
  }

}
for(let i of adminUser.companyIdRoles){
  if(i.id == company.id && i.role == "COMPANY_ADMIN"){
    console.log("he too can perform addition");
    if(entity.status =="ACTIVE"){
      if(user.entityIds.includes(data.id)){
        console.log("throw exception that user is already a part of the organiation");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user alreeady part of the entity",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      else{
        console.log("here add the user to the organization"); 
        user.entityIds.push(data.id)
      user.entityIdRoles.push({id : data.id,role : data.role})
      } 
    }
    if(entity.status =="INACTIVE"){
      console.log("throw exception that cannot add to nothing");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "entity does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    } 
  }

}
for(let i of adminUser.entityIdRoles){
  if(i.id == entity.id && i.role == "ENTITY_ADMIN"){
    console.log("he too can perform addition");
    if(entity.status =="ACTIVE"){
      if(user.entityIds.includes(data.id)){
        console.log("throw exception that user is already a part of the organiation");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user already part of the entity",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      else{
        console.log("here add the user to the organization"); 
        user.entityIds.push(data.id)
    user.entityIdRoles.push({id : data.id,role : data.role})
      } 
    }
    if(entity.status =="INACTIVE"){
      console.log("throw exception that cannot add to nothing");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "entity does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    } 
  }
}
}
else{
console.log("throw exception that invalid type is given");
throw new HttpException({
  status: HttpStatus.EXPECTATION_FAILED,
  error: 'EXPECTATION_FAILED',
  message: "ivalid type is given",
}, HttpStatus.EXPECTATION_FAILED);
}
}



async toDeleteUser(user:any,adminUser:any,data:any,type:any){
if(type == "organization"){
  console.log("handling orgs");
  let organization = data.id
  if(!organization){
    console.log("throw exception that organization does not exists to perform the action");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "organization does not exisys",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
    console.log("he can definitely peforming the removal");
    if(user.orgIds.includes(data.id)){
      console.log("only now wwe canperform operation");
      for(let i of user.orgIds){
        if(i == data.id){
          user.orgIds.splice(i,1)
        }
      }
      for(let i of user.orgIdRoles){
        if(i.id == data.id){
          user.orgIds.splice(i,1)
        }
      }
      if(user.organizationId == `${data.id}`){
        user.organizationId= user.orgIds[0]
      }
    }
    else{
      console.log("user is already not part of the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User is laready not part of the organization",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }
  if(adminUser.accountId == organization.account_id){
    console.log("admin user is the super admiin of org therefore can perform the operation");
    if(organization.status == "ACTIVE"){
      if(user.orgIds.includes(data.id)){
        console.log("only now wwe canperform operation");
        for(let i of user.orgIds){
          if(i == data.id){
            user.orgIds.splice(i,1)
          }
        }
        for(let i of user.orgIdRoles){
          if(i.id == data.id){
            user.orgIds.splice(i,1)
          }
        }
        if(user.organizationId == `${data.id}`){
          user.organizationId= user.orgIds[0]
        }
      }
      else{
        console.log("user is already not part of the organization");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user is alreay not part of the organization",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
    else{
      console.log("handling ghost organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "organization does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }
  
}
if(type == "company"){
  console.log("handling company");
  let company = await this.companyRepository.findOne(data.id)
  if(!company){
    console.log("throw exception that company does not exists");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "company does not exists",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  let organization = await this.organizationRepository.findOne(company.organization_id)
  if(!organization){
    console.log("throw db error");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Db error",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
    console.log("he can definitely peforming the removal");
    if(user.companyIds.includes(data.id)){
      console.log("only now wwe canperform operation");
      for(let i of user.companyIds){
        if(i == data.id){
          user.companyIds.splice(i,1)
        }
      }
      for(let i of user.companyIdRoles){
        if(i.id == data.id){
          user.companyIdRoles.splice(i,1)
        }
      }
      if(user.companyId == `${data.id}`){
        user.companyId = user.companyIds[0]
      }
    }
    else{
      console.log("user is already not part of the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User already not part of the company",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }
  if(adminUser.accountId == organization.account_id){
    console.log("admin user is the super admin therefore he might");
    if(company.status == "ACTIVE"){
      if(user.companyIds.includes(data.id)){
        console.log("only now wwe canperform operation");
        for(let i of user.companyIds){
          if(i == data.id){
            user.companyIds.splice(i,1)
          }
        }
        for(let i of user.companyIdRoles){
          if(i.id == data.id){
            user.companyIdRoles.splice(i,1)
          }
        }
        if(user.companyId == `${data.id}`){
          user.companyId = user.companyIds[0]
        }
      }
      else{
        console.log("user is already not part of the organization");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user already not part of the company",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
    else{
      console.log("throw error handling ghost company");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "company does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }
  for(let i of adminUser.orgIdRoles){
    if(company.status == "ACTIVE"){
    if(i.id == organization.id && i.role == "ORG_ADMIN"){
      console.log("he too can perform the removal");
      for(let i of user.companyIds){
        if(i == data.id){
          user.companyIds.splice(i,1)
        }
      }
      for(let i of user.companyIdRoles){
        if(i.id == data.id){
          user.companyIdRoles.splice(i,1)
        }
      }
      if(user.companyId == `${data.id}`){
        user.companyId = user.companyIds[0]
      }
      
    }
    if(i.id == organization.id && i.role !=="ORG_ADMIN"){
      console.log("throw exception that you cannot"); 
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Insufficient scope",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }
  }
}
if(type == "entity"){
  console.log("handling entity");
  let entity = await this.entityRepository.findOne(data.id)
  if(!entity){
    console.log("throw exception that the entity does not exists");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "entity does not exists",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  let company = await this.companyRepository.findOne(entity.companyId)
  if(!company){
    console.log("db error");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "db error",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  let organization = await this.organizationRepository.findOne(entity.organization_id)
  if(!organization){
    console.log("db error"); 
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "db error",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
    console.log("he can perfrom the removal");
    if(user.entityIds.includes(data.id)){
      console.log("only now wwe canperform operation");
      for(let i of user.entityIds){
        if(i == data.id){
          user.entityIds.splice(i,1)
        }
      }
      for(let i of user.entityIdRoles){
        if(i.id == data.id){
          user.entityIdRoles.splice(i,1)
        }
      }
      if(user.entityId == `${data.id}`){
        user.entityId = user.enityIds[0]
      }
    }
    else{
      console.log("user is already not part of the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "user not part of the entity",
      }, HttpStatus.EXPECTATION_FAILED);
    } 
  }
  if(adminUser.accountId == organization.account_id){
    console.log("adminuser is super admi of org");
    if(entity.status =="ACTIVE"){
      console.log("he too can peform the operation");
      if(user.entityIds.includes(data.id)){
        console.log("only now wwe canperform operation");
        for(let i of user.entityIds){
          if(i == data.id){
            user.entityIds.splice(i,1)
          }
        }
        for(let i of user.entityIdRoles){
          if(i.id == data.id){
            user.entityIdRoles.splice(i,1)
          }
        }
        if(user.entityId == `${data.id}`){
          user.entityId = user.enityIds[0]
        }
      }
      else{
        console.log("user is already not part of the organization");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "user not part of the entity",
        }, HttpStatus.EXPECTATION_FAILED);
      } 
    }
    else{
      console.log("handling ghost entity");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "enbtity does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
      
    }
    
  }
  for(let i of adminUser.orgIdRoles){
    if(i.id == organization.id && i.role =="ORG_ADMIN"){
      console.log("you can perform the operation");
      if(entity.status =="ACTIVE"){
        console.log("he too can peform the operation");
        if(user.entityIds.includes(data.id)){
          console.log("only now wwe canperform operation");
          for(let i of user.entityIds){
            if(i == data.id){
              user.entityIds.splice(i,1)
            }
          }
          for(let i of user.entityIdRoles){
            if(i.id == data.id){
              user.entityIdRoles.splice(i,1)
            }
          }
          if(user.entityId == `${data.id}`){
            user.entityId = user.enityIds[0]
          }
        }
        else{
          console.log("user is already not part of the organization");
          throw new HttpException({
            status: HttpStatus.EXPECTATION_FAILED,
            error: 'EXPECTATION_FAILED',
            message: "user not part of the entity",
          }, HttpStatus.EXPECTATION_FAILED);
        } 
      }
      else{
        console.log("handling ghost entity");  
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "entity does not exists",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
  }
  for(let i of adminUser.companyIdRoles){
    if(i.id == company.id && i.role =="COMPANY_ADMIN"){
      console.log("you can perform the operation");
      if(entity.status =="ACTIVE"){
        console.log("he too can peform the operation");
        if(user.entityIds.includes(data.id)){
          console.log("only now wwe canperform operation");
          for(let i of user.entityIds){
            if(i == data.id){
              user.entityIds.splice(i,1)
            }
          }
          for(let i of user.entityIdRoles){
            if(i.id == data.id){
              user.entityIdRoles.splice(i,1)
            }
          }
          if(user.entityId == `${data.id}`){
            user.entityId = user.enityIds[0]
          }
        }
        else{
          console.log("user is already not part of the organization");
          throw new HttpException({
            status: HttpStatus.EXPECTATION_FAILED,
            error: 'EXPECTATION_FAILED',
            message: "user not part of the entity",
          }, HttpStatus.EXPECTATION_FAILED);
        } 
      }
      else{
        console.log("handling ghost entity");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "entity does not exists",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    }
  }
}
else{
  console.log("throw exception that invalid type provided");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "ivalid type provided",
  }, HttpStatus.EXPECTATION_FAILED);
}

}




////////////////////////////////////////////////////////////////////

async inviteUser(user:any,adminUser:any,data :any,type:any,id :any)   
{
if(type == "organization")
{
  let organization = await this.organizationRepository.findOne(id)
   if(!organization){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Organization does not exist",
      }, HttpStatus.EXPECTATION_FAILED);  
    }
  if(adminUser.roles.includes(UserRole.PRODO_ADMIN) || adminUser.accountId == organization.account_id )
  { 
    if(user.orgIds.includes(id))
    {
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User already in the organization",
      }, HttpStatus.EXPECTATION_FAILED);  
    }
    else
    {
     let tempUser = await this.tempUserService.existingInvite(data,adminUser,user,type)
      return await this.mailService.inviteUser(adminUser,user,type,data,organization,tempUser.id)
      // sendingInvites(adminUser:any,user : any, type :any,data :any,institution :any)
    }
  }
  else
  {
  console.log("chek for org admin");
  for (let iterate of adminUser.orgIdRoles ){
  if(iterate.id == id && iterate.role == "ORG_ADMIN")
  {
    console.log("you can send the emails");
    let tempUser = await this.tempUserService.existingInvite(data,adminUser,user,type)
    console.log("back from the ded");
    let inviteId = tempUser.id
   let mailResponse =  await this.mailService.inviteUser(adminUser,user,type,data,organization,inviteId)
    return mailResponse

      }
    }
    if(!adminUser.orgIds.includes(id))
    {
      console.log("throw exception adminuser not part oof the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "You are not part of the organization",
      }, HttpStatus.EXPECTATION_FAILED);  
    }
    // return await this.mailService.inviteUser(user,adminUser,data,type,id)
  }
}
if(type == "company"){
  console.log("company type invitation requested");
  let company = await this.companyRepository.findOne(id)
  if(!company){
    console.log("throw exception that the copany does not exists in the db");  
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "company does not exist in the db",
    }, HttpStatus.EXPECTATION_FAILED);  
  }
  let organization = await this.organizationRepository.findOne(company.organization_id)
  if(adminUser.roles.includes(UserRole.PRODO_ADMIN)|| adminUser.accountId == organization.account_id)
  {
    console.log("we can invite the user to  the specific company because the user is super admin ");
    let tempUser = await this.tempUserService.existingInvite(data,adminUser,user,type)

    return await this.mailService.inviteUser(adminUser,user,type,data,company,tempUser.id)

  }
  else
  {
    console.log("chek for org admin");
    // return id
    if(!adminUser.companyIds.includes(id))
    {
      console.log("throw exception adminuser not part oof the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "you are not part of the company",
      }, HttpStatus.EXPECTATION_FAILED);  
    }
    for (let iterate of adminUser.companyIdRoles )
    {
      if(iterate.id == id && iterate.role == "COMPANY_ADMIN"){
        console.log("you can send the emails");
      let tempuser = await this.tempUserService.existingInvite(data,adminUser,user,type)

    return await this.mailService.inviteUser(adminUser,user,type,data,company,tempuser.id)
      }
    }
  // return await this.mailService.inviteUser(user,adminUser,data,type,id)
  }
}
if(type == "entity"){
  console.log("entity type invite requested");
  let entity = await this.entityRepository.findOne(id)
  let organization = await this.organizationRepository.findOne(entity.organization_id)
  if(!organization){
    console.log("db error that the organization does not exists for the company");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "db error , organization does not exists for the entity",
    }, HttpStatus.EXPECTATION_FAILED);  
  }
  if(!entity){
    console.log("throw excepption that the entity does not exist");
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "entity does not exist",
    }, HttpStatus.EXPECTATION_FAILED);  
  }
  if(adminUser.roles.includes(UserRole.PRODO_ADMIN)|| adminUser.accountId == organization.account_id)
  {
    console.log("we can invite the user to  the specific entity ");
    await this.tempUserService.existingInvite(data,adminUser,user,type)

    return await this.mailService.inviteUser(adminUser,user,type,data,entity)
    
  }
  else{
    console.log("chek for org admin");
    for (let iterate of adminUser.entityIdRoles ){
      if(iterate.id == id && iterate.role == "ENTITY_ADMIN"){
        console.log("you can send the emails");
      await this.tempUserService.existingInvite(data,adminUser,user,type)

    return await this.mailService.inviteUser(adminUser,user,type,data,entity)
      }
    }
    if(!adminUser.entityIds.includes(id)){
      console.log("throw exception adminuser not part oof the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "you cannot control the entity",
      }, HttpStatus.EXPECTATION_FAILED);  
      
    }
    // return await this.mailService.inviteUser(user,adminUser,data,type,id)
    
  }
  
}
else{
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Invalid type provided",
  }, HttpStatus.EXPECTATION_FAILED);
}

}


async  transferUserData(adminUser :any,user :any,data :any)
{
// we will now check whether the given organization  from the org id is in the adminuser or not if it is does it have the authority or not 
  let organization=await this.organizationRepository.findOne(data.id)
  if(!organization){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Provided organization does not exists",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  let companyIds = organization.companyIds
  let entityIds = organization.entityIds
  let check = user.orgIds.includes(organization.id)
if(check){
console.log("user is already in the irganization in question");
organization.account_id = user.accountId                 // making user the super admin of the org
for(let i of user.orgIdRoles){
if(i.id == organization.id){
  i.role == "ORG_ADMIN"
}
}
for(let i of user.companyIds){
if(companyIds.includes(i)){
  user.companyIds.splice(i,1)
}
}
for(let i of user.companyIdRoles){
if(companyIds.includes(i.id)){
  user.companyIdRoles.splice(i,1)
}
}
user.companyIds.push(...organization.companyIds)
for(let i of organization.companyIds){
user.companyIdRoles.push({id : i,role: "COMPANY_ADMIN"})
}

// for entity

for(let i of user.entityIds){
if(entityIds.includes(i)){
  user.entityIds.splice(i,1)
}
}
for(let i of user.entityIdRoles){
if(entityIds.includes(i.id)){
  user.entityIdRoles.splice(i,1)
}
}
user.entityIds.push(...organization.entityIds)
for(let i of organization.entityIds)
{
user.entityIdRoles.push({id : i,role: "ENTITY_ADMIN"})
}
/// editing the admin USer values
for(let i of adminUser.orgIds){
if(i == organization.id){
  adminUser.orgIds.splice(i,1)
}
}
for(let i of adminUser.companyIds){
if(companyIds.includes(i)){
  adminUser.companyIds.splice(i,1)
}
}
for(let i of adminUser.companyIdRoles){
if(companyIds.includes(i.id)){
  adminUser.companyIdRoles.splice(i,1)
}
}
for(let i of adminUser.entityIds){
if(entityIds.includes(i)){
  adminUser.entityIds.splice(i,1)
}
}
for(let i of adminUser.entityIdRoles){
if(companyIds.includes(i.id)){
  adminUser.entityIdRoles.splice(i,1)
}
}
await this.userRepository.save(user.id,user)
await this.userRepository.save(adminUser.id,adminUser)

}
else{
console.log("user is not in the organization in question");
organization.account_id = user.accountId  
for(let i of user.companyIds){
if(companyIds.includes(i)){
  user.companyIds.splice(i,1)
}
}
for(let i of user.companyIdRoles){
if(companyIds.includes(i.id)){
  user.companyIdRoles.splice(i,1)
}
}
user.companyIds.push(...organization.companyIds)
for(let i of organization.companyIds){
user.companyIdRoles.push({id : i,role: "COMPANY_ADMIN"})
}

// for entity

for(let i of user.entityIds){
if(entityIds.includes(i)){
  user.entityIds.splice(i,1)
}
}
for(let i of user.entityIdRoles){
if(entityIds.includes(i.id)){
  user.entityIdRoles.splice(i,1)
}
}
user.entityIds.push(...organization.entityIds)
for(let i of organization.entityIds)
{
user.entityIdRoles.push({id : i,role: "ENTITY_ADMIN"})
}

for(let i of adminUser.orgIds){
if(i == organization.id){
  adminUser.orgIds.splice(i,1)
}
}
for(let i of adminUser.companyIds){
if(companyIds.includes(i)){
  adminUser.companyIds.splice(i,1)
}
}
for(let i of adminUser.companyIdRoles){
if(companyIds.includes(i.id)){
  adminUser.companyIdRoles.splice(i,1)
}
}
for(let i of adminUser.entityIds){
if(entityIds.includes(i)){
  adminUser.entityIds.splice(i,1)
}
}
for(let i of adminUser.entityIdRoles){
if(companyIds.includes(i.id)){
  adminUser.entityIdRoles.splice(i,1)
}
}
await this.userRepository.save(user.id,user)
await this.userRepository.save(adminUser.id,adminUser)
}
return {user : user, adminUser : adminUser}
}

async inviteUserToProdo(email :any,data:any,adminUser : any){
let tempUser
let organization = await this.organizationRepository.findOne(data.id)
if(!organization){
throw new HttpException({
  status: HttpStatus.EXPECTATION_FAILED,
  error: 'EXPECTATION_FAILED',
  message: "Organization does not exists for the given id",
}, HttpStatus.EXPECTATION_FAILED);
}
else {
if(adminUser.accountId == organization.account_id){
  tempUser =await this.tempUserService.newInvitesave(data,adminUser)
  data.password = tempUser.password
  return  await this.mailService.inviteToProdo(email,adminUser,data,organization,tempUser.id)
}
for(let iterate of adminUser.orgIdRoles){
  if(iterate.id == organization.id && iterate.role == "ORG_ADMIN")
  {
    tempUser = await this.tempUserService.newInvitesave(data,adminUser)
   data.password = tempUser.password

    return  await this.mailService.inviteToProdo(email,adminUser,data,organization,tempUser.id)

  }
  if(iterate.id == organization.id && iterate.role == "ORG_EMPLOYEE"){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "You are not the admin of the organization",
    }, HttpStatus.EXPECTATION_FAILED);
  }
}
if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
  tempUser = await this.tempUserService.newInvitesave(data,adminUser)
   data.password = tempUser.password
    return  await this.mailService.inviteToProdo(email,adminUser,data,organization,tempUser.id)
}
}

return {message : "uncaught error"}
}



async acceptInviteNewUser(id :any){
let tempUser = await this.tempUserService.InviteEditNewUser(id)
if(!tempUser){
  console.log("throw exception that the invitation does not exists");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "You are not the admin of the organization",
  }, HttpStatus.EXPECTATION_FAILED);
}
let userObject = new User()
userObject.orgIds = tempUser.orgIds
userObject.orgRole = tempUser.orgRole
userObject.organization_id = tempUser.orgId
userObject.password = tempUser.password
userObject.email = tempUser.email
userObject.firstName = tempUser.name
userObject.roles = [UserRole.USER, UserRole.ADMIN, UserRole.CLIENT, UserRole.NewUser];
await this.tempUserService.statusChange(tempUser)
await this.userRepository.save(userObject)
return {statusCode : 200, message : "user successfully saved in the db"}
}

async acceptInviteExistingUser(inviteId : any,userId : any){
let user = await this.userRepository.findOne(userId)
let tempUser  = await this.tempUserService.findOne(inviteId)
if(!user || !tempUser || tempUser.status == "ACTIVE"){
  console.log("thow exception that an error has occured");
}
if(tempUser.inviteType == "organization"){
user.orgIds.push(...tempUser.orgIds)
user.orgIdRoles.push(...tempUser.orgIdRoles)
await this.tempUserService.statusChange(tempUser)
return await this.userRepository.update(user.id,user)
}
if(tempUser.inviteType == "entity"){
  user.entityIds.push(...tempUser.entityIds)
user.entityIdRoles.push(...tempUser.entityIdRoles)
await this.tempUserService.statusChange(tempUser)
return await this.userRepository.update(user.id,user)

}
if(tempUser.inviteType == "company"){
  user.companyIds.push(...tempUser.companyIds)
user.companyIdRoles.push(...tempUser.companyIdRoles)
await this.tempUserService.statusChange(tempUser)
return await this.userRepository.update(user.id,user)
}
    // return await this.tempUserService.
    return {message : "uncaught error"}
}
}


