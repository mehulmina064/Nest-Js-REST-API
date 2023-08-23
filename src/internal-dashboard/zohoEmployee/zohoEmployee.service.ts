import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not,FindConditions } from 'typeorm';
import { zohoEmployee,ZohoEmployeeStatus,UserType,EmailId } from './zohoEmployee.entity';
import { zohoToken } from '../../sms/token.entity';
import * as CryptoJS from 'crypto-js';
import * as OTP from 'otp-generator';
import { UserRole } from './prodoRoles.constants';
// import { Otp } from './employeeOtp.entity';
import { employeeOtp } from './employeeOtp.entity';


import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { MailTriggerService } from '../../mailTrigger/mailTrigger.service';

import fetch from 'node-fetch'





@Injectable()
export class zohoEmployeeService {
  constructor(
    @InjectRepository(zohoEmployee)
    private readonly zohoEmployeeRepository: Repository<zohoEmployee>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
    private readonly mailTriggerService: MailTriggerService,
    @InjectRepository(employeeOtp)
    private readonly employeeOtpRepository: Repository<employeeOtp>,

) { }

async findAll(query?:any){
  if(query){
    console.log(query)
    let data=await this.zohoEmployeeRepository.findAndCount(query)
    return {data:data[0],count:data[1]}
  }
  else {
    let data=await this.zohoEmployeeRepository.findAndCount()
    return {data:data[0],count:data[1]}
  }
}

async findByEmail(email: string) {
  return await this.zohoEmployeeRepository.findOne({where:{ email }});
}

async findOne(id: string): Promise<zohoEmployee> {
  let user = await this.zohoEmployeeRepository.findOne(id);  
  if(user){
    // console.log(user.lastLoginAt)
  return user
 }
 else{
      return Promise.reject(new HttpException('User not found', HttpStatus.BAD_REQUEST));
 }
}

async create(zohoEmployee: zohoEmployee,zohoUser:any) { 
    const foundUser = await this.zohoEmployeeRepository.findOne({where:{ email: zohoEmployee.email }});
    if (foundUser) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
      message: "Employee already exists"
    }, HttpStatus.FORBIDDEN);
    }
    if(!zohoEmployee.profile){
      if(zohoUser.photo_url){
        zohoEmployee.profile=zohoUser.photo_url
      }
      else{
        zohoEmployee.profile="https://prodo-files-upload.s3.ap-south-1.amazonaws.com/files/profile-pic.jpeg"
      }
    }
    zohoEmployee.password = CryptoJS.HmacSHA1(zohoEmployee.password, 'jojo').toString();
    zohoEmployee.zohoUserId=zohoUser.user_id
    zohoEmployee.status=ZohoEmployeeStatus.ACTIVE
    zohoEmployee.type=UserType.ZOHO
    zohoEmployee.roles=[UserRole.USER,UserRole.EMPLOYEE]
    zohoEmployee.emailIds=zohoUser.email_ids
    zohoEmployee.createdAt=zohoUser.created_time
    zohoEmployee.isEmployee=zohoUser.is_employee
    zohoEmployee.updatedAt=new Date()
    // return zohoEmployee
    return await this.zohoEmployeeRepository.save(zohoEmployee)
}

async update(id: string | number | Date | ObjectID | FindConditions<zohoEmployee> | string[] | number[] | Date[] | ObjectID[], user: Partial<zohoEmployee>,role:any) {
  if (user.roles && user.roles.length > 0) {
    if(role.find((str) => str === 'PRODO_ADMIN')){
      let data= await this.zohoEmployeeRepository.update(id, user);
      let saveUser=await this.zohoEmployeeRepository.findOne(id);
      return saveUser;
    }
    else{
      throw new HttpException({
        status: 400,
        error: "You cannot change your own role", 
        message: "You cannot change your own role"
      }, HttpStatus.BAD_REQUEST);
    }
  }
  else{
    let userCheck=await this.zohoEmployeeRepository.findOne(id);
    if(userCheck){
      let data= await this.zohoEmployeeRepository.update(id, user);
      let saveUser=await this.zohoEmployeeRepository.findOne(id);
      return saveUser;
    }
    else{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "User not found",
        message: "User not found"
      }, HttpStatus.BAD_REQUEST);
    }
  }
}

async softRemove(id: ObjectID,userId: string) {
  const user = await this.zohoEmployeeRepository.findOne(id);
  if(user){
    user.status=ZohoEmployeeStatus.DELETED
    user.deletedAt= new Date()
    user.deletedBy= userId
    await this.zohoEmployeeRepository.update(id,user);
    return user;
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: "User not found",
      message: "User not found"
    }, HttpStatus.BAD_REQUEST);
  }
  
}

async remove(id: ObjectID) {
  const user = await this.zohoEmployeeRepository.findOne(id);
  if(user){
    await this.zohoEmployeeRepository.delete(id);
    return user;
  }
else{
  throw new HttpException({
    status: HttpStatus.BAD_REQUEST,
    error: "User not found",
    message: "User not found"
  }, HttpStatus.BAD_REQUEST);
}
  
}

async setProfilePicture(profilePicture:any,userId:string){
  let user=await this.zohoEmployeeRepository.findOne(userId)
  if(user){
    user.profile=profilePicture
    let m=await this.zohoEmployeeRepository.update(userId,user)
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

async updatePassword(id: string | number | Date | ObjectID | FindConditions<zohoEmployee> | string[] | number[] | Date[] | ObjectID[] | undefined, user: any) {
  user.currentPassword = CryptoJS.HmacSHA1(user.currentPassword, 'jojo').toString();
  console.log(user);
  const foundUser = await this.zohoEmployeeRepository.findOne(id);
  if (foundUser.password !== user.currentPassword) {
    return { status: 'failure', message: 'Current Password do not match' };
  }
  user.password = CryptoJS.HmacSHA1(user.newPassword, 'jojo').toString();
  user.confirmPassword = CryptoJS.HmacSHA1(user.confirmPassword, 'jojo').toString();
  if (user.password !== user.confirmPassword) {
    return { status: 'failure', message: 'Passwords do not match' };
  }
  await this.zohoEmployeeRepository.update(id, { password: user.password });
  let saveUser=await this.zohoEmployeeRepository.findOne(id);
  return saveUser;
}

async login(user:any) {
  user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
  const criteria = (user.email.indexOf('@') === -1) ? { contactNumber :user.email } : { email :user.email};
  const foundUser = await this.zohoEmployeeRepository.findOne(criteria)
  console.log('foundUser in employeeService',foundUser);
  if (foundUser) {
  const pass = foundUser.password;
    if( pass != user.password){ 
      throw new HttpException({
        status: 400,
        error: "Bad Request", 
        message: 'Wrong Password',
        // user: foundUser,
        // password: user.password 
      }, HttpStatus.BAD_REQUEST);
    }
    foundUser.lastLoginAt=new Date(); 
    console.log("date",foundUser.lastLoginAt)
    await this.zohoEmployeeRepository.update(foundUser.id,foundUser)
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

async generateOtp(contactNumber: string) {
  const otp = await OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
  await this.employeeOtpRepository.save({ contactNumber, otp });
  return { otp };
}

async generatePassword() {
  let pass = await OTP.generate(8, { upperCase: false, specialChars: false, alphabets: true });
  return pass;
}

async verifyOtp(contactNumber: any, otp: any) {
  const checkOtp = await this.employeeOtpRepository.findOne({ contactNumber, otp });
  return !!checkOtp;
}

async forgotPassword(email: string) {
  let mobile=email;
  const criteria = (email.indexOf('@') === -1) ? ( email="" ) : ( email=email );
  if(email==""){
    const foundUser = await this.zohoEmployeeRepository.findOne({where:{ contactNumber: mobile }});
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
       const foundUser = await this.zohoEmployeeRepository.findOne({where:{ email: email }});
       console.log('foundUser',foundUser);
       if (foundUser) {
         const otp = await OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
         await this.employeeOtpRepository.save({ email: foundUser.email, otp });
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
async resetPassword(email: string, otp: string, password: string) {
  let mobile=email;
  const criteria = (email.indexOf('@') === -1) ? ( email="" ) : ( email=email );
  if(email==""){
    const foundUser = await this.zohoEmployeeRepository.findOne({where:{ contactNumber: mobile }});
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
        await this.zohoEmployeeRepository.save(foundUser);
        return { status: 'success', message: 'Password reset successfully' };
      }
    }
    else {
      return { status: 'failure', message: 'User not found' };
    }

  }
  else{
         const foundUser = await this.zohoEmployeeRepository.findOne({where:{ email: email }});
         if (foundUser) {
           const checkOtp = await this.employeeOtpRepository.findOne({where:{ email: foundUser.email, otp: otp }});
           console.log('checkOtp',checkOtp);
           if (checkOtp) {
             await this.employeeOtpRepository.remove(checkOtp);
             foundUser.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
             await this.zohoEmployeeRepository.save(foundUser);
             return { status: 'success', message: 'Password reset successfully' };
           } else {
             return { status: 'failure', message: 'OTP do not match' };
           }
         } else {
           return { status: 'failure', message: 'User not found' };
         }
   }
}  

async uploadUsers(adminUser: zohoEmployee, file: any) {
  const data = xlsx.readFile(file.path);
  const sheet_name_list = data.SheetNames;
  const userData = xlsx.utils.sheet_to_json(data.Sheets[sheet_name_list[0]]);
  // console.log('userData',userData);
  // return userData;
  let users:zohoEmployee[]=[];
  for(let i=0;i<userData.length;i++){
  // userData.forEach(async user => {
    let user = userData[i];
    let newUser={
      "id":"",
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
    users.push(newUser);


    // const foundExistingUser = await this.zohoEmployeeRepository.findOne({where:{ email: newUser.email }});
    // if (foundExistingUser) {
    //   console.log('foundExistingUser');
    //   newUser.id = foundExistingUser.id;
    //   foundExistingUser.email = newUser.email.replace(/\s/g, ''); 
    //   newUser.updatedBy = String("ExcelDataSheet");
    //   foundExistingUser.updatedAt = new Date();
    //   let updatedUser = await this.zohoEmployeeRepository.update(newUser.id, foundExistingUser);
    //   updatedUser = await this.zohoEmployeeRepository.findOne(newUser.id);
    //   users.push(updatedUser);
    // } else { 
    //   newUser.createdBy = String("ExcelDataSheet");
    //   newUser.createdAt = new Date();
    //   const saveUser = await this.zohoEmployeeRepository.save(newUser);
    //   users.push(saveUser);
    // }
  }
  return { status: 'success', message: 'Users uploaded successfully', users: users };
}


async zohoBookToken(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
    if(!zohoToken){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'Token not found',
        message: "Unverified",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    let token=zohoToken.token
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
    })
    .then(res=>res.json()) 
    .then(data=>
      kill=data
    );
  // console.log("kill",kill)
    if(kill.message=='You are not authorized to perform this operation'||kill.code==57||kill.code==6041){
    // console.log("NEW_TOKEN")
    token=await this.newZohoBookToken()
    return token
    }
    return token
  }


async newZohoBookToken(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
          'refresh_token':'1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',//Mehul
          'client_id':'1000.',
          'client_secret':'',
          'grant_type': 'refresh_token' 
      })
  });
  zoho=await zoho.text()
  zoho=JSON.parse(zoho)
  let token="Zoho-oauthtoken "
  token=token+zoho.access_token
  zohoToken.token=token
  await this.zohoTokenRepository.update(zohoToken.id,zohoToken)
  return token
  }


async InventoryByID(id:any){
    let token=await this.zohoBookToken()
    let kill
    let bill
    let res = await fetch(`https://books.zoho.in/api/v3/users/${id}?organization_id=60015092519`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/users/${id}?organization_id=60015092519`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
    }
    bill=kill.user
    if(bill==undefined){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at zoho users ',
        response:kill,
        message: "Zoho token issue contact admin Or check your id again ",
      }, HttpStatus.UNAUTHORIZED);
    }
    return bill
    }

async getZohoEmployeeByEmail(email:string){
  let token=await this.zohoBookToken()
  let kill
    let bill
    let res = await fetch(`https://books.zoho.in/api/v3/users?organization_id=60015092519&email=${email}`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/users?organization_id=60015092519&email=${email}`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
    }
    bill=kill.users
    if(bill==undefined){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at zoho users ',
        response:kill,
        message: "Zoho token issue contact admin Or check your id again ",
      }, HttpStatus.UNAUTHORIZED);
    }
    if(bill.length>0){
    return bill[0]
    }
    else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'user not found',
        message: "Zoho User Not found on this email ",
      }, HttpStatus.NOT_FOUND);
    }
}


async customerDetails(id:any){
    let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
      
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
    }
    
    let contact=kill.contact
    if(contact){
       return contact
    }
    else{
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at inventory sales order',
        message: "Zoho token issue contact admin",
      }, HttpStatus.UNAUTHORIZED);
    }

  }


async zohoAll(page?:number){
    if(!page){
        page=1
      }
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://books.zoho.in/api/v3/users?organization_id=60015092519&page=${page}`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json())  
  .then(data=>
      kill=data
  );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015092519."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/users?organization_id=60015092519&page=${page}`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
  }
  let users=kill.users
  if(users==undefined){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data found in zoho',
      message: "Not Found Data",
    }, HttpStatus.NOT_FOUND);
  }
  return {count:users.length,data:users}
}



async saveZohoUser(zohoEmployee:any){
  let find=await this.zohoEmployeeRepository.findOne({where:{zohoUserId:zohoEmployee.user_id}})
  if(find){
    console.log("updating old Employee")
    zohoEmployee.createdAt=find.createdAt?find.createdAt:(zohoEmployee.createdAt?zohoEmployee.createdAt:new Date())
    zohoEmployee.id=find.id
    // return await this.zohoEmployeeRepository.save(zohoEmployee) 
    return zohoEmployee
  }
  else{
    console.log("saving new Employee")
    // return await this.zohoEmployeeRepository.save(zohoEmployee)
    return zohoEmployee
  }
}


async saveFromZohoId(id:any){
    let user = await this.InventoryByID(id)
    return await this.saveZohoUser(user)   
  }


async getAttachment(orderId:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://books.zoho.in/api/v3/bills/${orderId}/attachment?organization_id=60015092519`, {
      method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'*/*'
          }
        })
      .then(data=>
      kill=data.body
       );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/bills/${orderId}/attachment?organization_id=60015092519`, {
        method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'*/*'
          }
        })
      .then(data=>
      kill=data.body
       );
      }
    if(kill.code==5){
      throw new HttpException({ 
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'TOKEN issue',
        message: "Attachment not found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    return kill
}

async Summary(id:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
      method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
          }
        })
      .then(data=>
      kill=data.body
       );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
        method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
          }
        })
      .then(data=>
      kill=data.body
       );
      }
    if(kill.code==5){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'TOKEN issue',
        message: "summery not found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    return kill
}

async check(id: string){
  let check = await this.zohoEmployeeRepository.findOne(id).then((res1)=>{
    return res1
  }).catch((err)=>{
    return false
  })
  return check
}




}
