import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as CryptoJS from 'crypto-js';

import { Tempuser } from './tempuser.entity';
import { UserRole } from '../users/roles.constants';


@Injectable()
export class TempuserService {
  constructor(
    @InjectRepository(Tempuser)
    private readonly tempUserRepository: Repository<Tempuser>,)
 {} 

  async findAll() {
    let invites = await this.tempUserRepository.find()
    if(!invites){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "ivite does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    else if (invites){
      return {statusCode : 200,message : "All the invites",invites :invites}
    }
    return {statusCode : 400,message : "Uncaught Error"}
  }
  

  
async findUserInvites(user :any){
let invites = await this.tempUserRepository.find({userId : `${user.id}`})
if(!invites){
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "ivite does not exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
else if (invites){
  return {statusCode : 200,message : "All the invites for the user",invites :invites}
}
return {statusCode : 400,message : "Uncaught Error"}
}


  async newInvitesave(data:any,adminuser :any){
let tempObject = new Tempuser()
tempObject.orgRole = data.role
tempObject.orgId = data.id
tempObject.orgIds.push(data.id)
tempObject.orgIdRoles.push({id : data.id,role : data.role})
tempObject.name = data.name
tempObject.email = data.email
tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
tempObject.status = "INACTIVE"
tempObject.sentByid = adminuser.id
return await this.tempUserRepository.save(tempObject)
  }

  async InviteEditNewUser(id :any){
    let tempUser =  await this.tempUserRepository.findOne(id)
    if(!tempUser || tempUser.status == "ACTIVE"){
      console.log("throw exception that the "); 
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "invittation does not exist or there is no need for the invite",
      }, HttpStatus.EXPECTATION_FAILED);  
    }
    tempUser.status = "ACTIVE"
    await this.tempUserRepository.update(tempUser.id,tempUser)
    return tempUser
  }

 async findOne(id: any) {
    return await this.tempUserRepository.findOne(String(id));
  }

  

  async remove(id: any,user :any) {
    let inviteDetails = await this.tempUserRepository.findOne(id)
    if(!inviteDetails || inviteDetails.status == "ACTIVE"){
      console.log("throw exception that the invite does not exists");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invite Does Not Exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    if (inviteDetails.sentByid == user.id){
      console.log("now only deletion of invite is possible");
      await this.tempUserRepository.delete(inviteDetails.id)
    return {statusCode : 200,message : "Invite Deleted Successfully"}

    }
    if(user.roles.includes(UserRole.PRODO_ADMIN)){
      console.log("he can too delete any invites");
      await this.tempUserRepository.delete(inviteDetails.id)
    return {statusCode : 200,message : "Invite Deleted Successfully"}
    }
    return {message : "uncaught error"}
  }

  async existingInvite(data :any,adminUser :any,user :any,type :any){

    if(type == "organization"){   
      let tempObject = new Tempuser()
      tempObject.inviteType = "organization"
      tempObject.userId = user.id
      tempObject.orgId = data.id
      tempObject.orgIds.push(data.id)
      tempObject.orgIdRoles.push({id : data.id,role : data.role})
      tempObject.name = data.name
      tempObject.email = data.email
      tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
      tempObject.status = "INACTIVE"
      tempObject.sentByid = adminUser.id
     return await this.tempUserRepository.save(tempObject)
     
    }
    if(type == "company"){
      let tempObject = new Tempuser()
      tempObject.userId = user.id
      tempObject.companyRole = data.role
      tempObject.companyId = data.id
      tempObject.companyIds.push(data.id)
      tempObject.companyIdRoles.push({id : data.id,role : data.role})
      tempObject.name = data.name
      tempObject.email = data.email
      tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
      tempObject.status = "INACTIVE"
      tempObject.sentByid = adminUser.id
      
      return await this.tempUserRepository.save(tempObject)
    }
    if(type == "entity"){
      let tempObject = new Tempuser()
      tempObject.inviteType = "entity"
      tempObject.userId = user.id
      tempObject.entityRole = data.role
      tempObject.entityId = data.id
      tempObject.entityIds.push(data.id)
      tempObject.entityIdRoles.push({id : data.id,role : data.role})
      tempObject.name = data.name
      tempObject.email = data.email
      tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
      tempObject.status = "INACTIVE"
      tempObject.sentByid = adminUser.id
      return await this.tempUserRepository.save(tempObject)
    }
    else{
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid Type Requested",
      }, HttpStatus.EXPECTATION_FAILED);
    }
return {message : "uncaught Error"}
  }

  async statusChange(tempUser : any){
    if(tempUser.status == "ACTIVE"){
      tempUser.status = "INACTIVE"

    }
    if(tempUser.status == "INACTIVE"){
      tempUser.status = "ACTIVE"
    }
    await this.tempUserRepository.update(tempUser.id,tempUser)
  }
}
