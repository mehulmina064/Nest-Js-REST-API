import { PassportModule } from '@nestjs/passport';
import { editFileName } from './../files/file.utils';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { LocalAuthGuard } from '../authentication/local-auth.guard';
import { AuthenticationService } from '../authentication/authentication.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { CurrentUser} from './user.decorator';
import { Account, AccountType } from '../account/account.entity';
import { Organization, OrganizationDomain, OrganizationType } from '../organization/organization.entity';
import { UserRole } from './roles.constants';
import { Roles } from '../authentication/roles.decorator';
import { ObjectID, getRepository } from 'typeorm';
import { UserCreateDto } from './user.dto';
import { filterAllData, filterSingleObject } from '../common/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as CryptoJS from 'crypto-js';

import { Email } from 'aws-sdk/clients/codecommit';
import { use } from 'passport';
import { request } from 'http';
// import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthenticationService) {

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query): Promise<any> {
    return await filterAllData(this.userService,  req.user,query);
  }
   
 @UseGuards(JwtAuthGuard)
  @Get('test1')
  async test1(@Request() req:any) {
    console.log('user-1',req.user);
    return req.user
    return await this.userService.findAll()
  }
 //endpoint for update user roles of existing users
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    // console.log('user-1',req.user);
    return await this.userService.findOne(req.user.id);
  }

@Get('salesOrder-item-Delivery-Review/:package_id/:item_id')
@UseGuards(JwtAuthGuard)
async getReview(@Param('package_id') package_id: string,@Request() req,@Param('item_id') item_id: string) {
  // console.log('id',package_id);
  // console.log('id2',item_id);
  // console.log('id3',req.user.id);
  // return "hello"
    return await this.userService.getReview(item_id,req.user.id,package_id);
}
@Post('salesOrder-item-Delivery-Review')
@UseGuards(JwtAuthGuard)
async postReview(@Request() req: any,@Body() data: any) {
    data.user_id = req.user.id;
    return await this.userService.salesOrderReview(data);
}

@Post('setProfilePicture')
@UseGuards(JwtAuthGuard)
async setProfilePicture(@Request() req:any,@Body() data: any) {
  if(!data.profilePicture)
  {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST', 
        message: "Please provide profile picture",
      }, HttpStatus.BAD_REQUEST);
  }
    return await this.userService.setProfilePicture(data.profilePicture,req.user.id);
}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() userData: Partial<User>) {
    return await this.userService.update(req.user.id, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userbyid/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userbyemail/:email')
  async findOneByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async findOneTest(@CurrentUser() user: User) {
    if (user) {
      return await console.log(user);
    }
    return { status: 'error', message: 'User not found' };
  }
  
  @Post('add-user')
  @Roles(UserRole.ADMIN)
  async addUser(@Body() data:User){
    return this.userService.addUser(data);
  }
  
  @Post()
  save(@Body() data:UserCreateDto) {
    let user = new User();
    user.firstName = data.user.firstName;
    user.lastName = data.user.lastName;
    user.email = data.user.email;
    user.contactNumber = data.user.contactNumber;
    user.password = data.user.password;
    user.isVerified=true;
    user.roles = [UserRole.USER, UserRole.ADMIN, UserRole.CLIENT, UserRole.NewUser];
   
    let account = new Account();
    account.type = AccountType.EXTERNAL;
    let organization = new Organization();
    organization.name = data.organization.name;
    organization.type = data.organization.type;
    
    organization.domains = [OrganizationDomain.PROCUREMENT,OrganizationDomain.ECOMMERCE,OrganizationDomain.INVENTORY];
    if(organization.type === OrganizationType.LOGISTICS) {
      //if organization domain includes 'LOGISTIC' then add user role 'LOGISTICS'
      console.log('logistics',organization.type);
      user.roles.push(UserRole.LOGISTICS);
      organization.domains.push(OrganizationDomain.LOGISTICS);
    }
    if(organization.type == OrganizationType.MANUFACTURER) {
      //if organization domain includes 'LOGISTIC' then add user role 'LOGISTICS'
      user.roles.push(UserRole.MANUFACTURER,UserRole.SUPPLIER);
      organization.domains.push(OrganizationDomain.SUPPLIER,OrganizationDomain.MANUFACTURER);
    }
    
    return this.userService.save(user, account, organization);
  
}
  @Get('filter/')
  async filter(@Query() query) {
    return await this.userService.filter(query);
  }
  @Get('userroles')
  async getUserRoles() {
    return await this.userService.getUserRoles();
  }
  // Assign roles to user
  
  @Get('testRole')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: User, @Request() req) {
 
    return this.userService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password/:id')
  updatePassword(@Param('id') id: string, @Body() data: any) {
    console.log(data);
    return this.userService.updatePassword(id, data);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user); 
  }



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.userService.remove(id);
  }

  @Post('/forgotpassword')
  async forgotPassword(@Body() data: any) {
    console.log(data);
    return await this.userService.forgotPassword(data.email);
    // return await this.userService.forgotPassword(data.email,data.mobileNo);

  }
  @Post('/resetpassword')
  async resetPassword(@Body() data: any) {
    return await this.userService.resetPassword(data.email,data.otp, data.password);
    // return await this.userService.resetPassword(data.email,data.otp, data.password,data.mobileNo);

  }



  

  @UseGuards(JwtAuthGuard)
  @Post('verifyOtp')
 async verifyOtp(@Param('contactNumber') contactNumber: string, @Param('otp') otp: string) {
    return this.userService.verifyOtp(contactNumber, otp);
  }
  @UseGuards(LocalAuthGuard)
  @Get('generate-otp/:contactNumber')
  generateOtp(@Param('contactNumber') contactNumber: string) {
    return this.userService.generateOtp(contactNumber);
  }
  @UseGuards(JwtAuthGuard)
  @Post('addrole/:id')
  @Roles(UserRole.ADMIN)
  async addRole(@Param('id') id:string,@Body() data: any) {
    console.log(data.roles);
    return await this.userService.assignRoles(id,data.roles);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-user-to-organization/:id')
  @Roles(UserRole.ADMIN)
  async addUserToOrganization(@Param('id') id:string,@Body() user: User,@Request() req) {
    console.log(user);
    return await this.userService.addUserToOrganization(user,id,req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadUsers')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files',
      filename: editFileName
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  }))
  async uploadUsers(@Request() req, @UploadedFile() file) {
    return await this.userService.uploadUsers(req.user,file);
  }

 

  

  @Get('update-unimove')
  async updateUserRoles() {
    //update user roles of existing users
    const foundUsers = await getRepository(User).find({
      territory_id : [],
      organization_id : '6268d5d11e192b13a6dd09f2',
      roles : 'UnimoveStoreManager'

    });
    console.log(foundUsers);
    return await getRepository(User).remove(foundUsers);
  }
  
  @Get('get-user-count')
  @UseGuards(JwtAuthGuard)
  async getUserCount(@Request() req) {
    // return await this.userService.getUserCount(req.user.organization_id);
    return await filterAllData(this.userService,  req.user).then(userCount => {
      return userCount.length;
    })
  }

  @Get('gph')
  async getGraph(@Query() query)  {
    const task = query.pass 
    return CryptoJS.HmacSHA1(task, 'jojo').toString();
  }

  @Get('gph2')
  async getGraph2(@Query() query)  {
    const task = query.pass 
    var iv  = CryptoJS.enc.Base64.parse("jojo");
var key=CryptoJS.SHA256("Message");

var decrypteddata=decryptData(encryptedString,iv,key);
console.log(decrypteddata);//genrated decryption string:  Example1

function decryptData(encrypted,iv,key){
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        	  iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8)
}
  }

@Get('zohoTest')
async zohoTest() {
  let user=await this.userService.findByEmail('abhishek.gupta@prodo.in');
  // return this.userService.zohoWebUsers(user);
  return await this.userService.zohoWebUsersUpload();

}

@Post('Send-Mail-All-Users')
async sendMailWithTemplate(@Body() body:any){
  if(!body.templateName){
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'BAD_REQUEST',
      message: "Please Provide template Name"
    }, HttpStatus.BAD_REQUEST);
  }
  if(!body.subject){
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'BAD_REQUEST',
      message: "Please Provide subject "
    }, HttpStatus.BAD_REQUEST);
  }
  return await this.userService.sendMailWithTemplate(body.templateName,body.subject)
}

@Get('Fix-all-User-Old-Data')
async updateOldData() {
  
let allUser=await this.userService.fixAllUsers()
return allUser

}

@Get('Fix-all-User-Organizations-Data')
async updateOldOrganizationsData() {
let allUser=await this.userService.fixAllUsersOrganizations()
return allUser

}

@Post('all-User-Data-update')
async updateAllData() {
  let output=[]
let allUser=await this.userService.findAllUsers()
// return allUser
for( const user of allUser){
  output.push(await this.userService.updateData(user))
}
return output
}

@Post('One-User-Data-update/:email')
async updateOneUserData(@Param('email') email : string) {
  
  let user=await this.userService.findByEmail(email);
  let update= await this.userService.updateData(user);
  // return user
  return update
 
}
  
  // NEW OGR FLOW

@UseGuards(JwtAuthGuard)
@Post('addNewOrganization')
async addNewOrganization(@Body() OrganizationData:any,@Request() req:any) {
  let user=await this.userService.findOne(req.user.id)
  if(!user){
    throw new NotFoundException(`User with id ${req.user.id} not found`);
  }
  let userRole="ORG_ADMIN"
  let accountId= String(user.accountId)
  OrganizationData=await this.userService.addNewOrganization(user,OrganizationData,userRole,accountId)
  let output={
    statusCode:200,
    message:" Successfully saved ",
    data:OrganizationData
  }
  return output
}


@Get('allUsers')                             //// universal switching for users on basis of role of the user
@UseGuards(JwtAuthGuard)
async allUsers(@Request() req:any){
  let user = await this.userService.findOne(req.user.id)
  if(!user)
  {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT_FOUND',
        message: "User Not Found",
      }, HttpStatus.NOT_FOUND);
  }
  let result
  if(user.roles)
    {
       if(user.roles.includes(UserRole.PRODO_ADMIN)) 
       {
         result=await this.userService.findAll()
         return {statusCode:200,message:" All Users ",data:result}
       }
       else 
       {
          let adminOrgs=user.orgIdRoles.filter(i => i.role=="ORG_ADMIN").map(x => x.id)
          let adminComps=user.companyIdRoles.filter(i => i.role=="COMPANY_ADMIN").map(x => x.id)
          let adminEntity=user.entityIdRoles.filter(i => i.role=="ENTITY_ADMIN").map(x => x.id)
          let orgUsers=[]
          let companyUsers=[]
          let entityUsers=[]
          if(adminOrgs.length>0)
          {
            orgUsers=await this.userService.orgUsers(adminOrgs)
          }
          if(adminComps.length>0)
          {
            companyUsers=await this.userService.companyUsers(adminComps)
          }
          if(adminEntity.length>0)
          {
            entityUsers=await this.userService.entityUsers(adminEntity)
          }

          if(orgUsers.length>0||companyUsers.length>0||entityUsers.length>0){

             result= [...orgUsers ,...companyUsers, ...entityUsers]
            //  return result
             let userIds=result.map(item => `${item.id}`)
            userIds = [... new Set(userIds)]
            // return userIds
            let out=[]
            for(let id of userIds){
                    out.push(result.find(i => i.id==id))
            }
            return {statusCode:200,message:" All Users ",data:out}
          }
          else
          {
            result=[user]
            return {statusCode:200,message:" You are Not Admin ",data:result}
          }
        }
    }
  else {
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid USer",
    }, HttpStatus.EXPECTATION_FAILED); 
  }
} 


@Get('organizationUsers')                             //// universal switching for users on basis of role of the user
@UseGuards(JwtAuthGuard)
async allOrgUsers(@Request() req){
  let user = await this.userService.findOne(req.user.id)
  if(!user)
  {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT_FOUND',
        message: "User Not Found",
      }, HttpStatus.NOT_FOUND);
  }
  let result
  // result=await this.userService.findByOrganization(user.organization_id)
  // return result
  if(user.roles)
    {
       if(user.roles.includes(UserRole.PRODO_ADMIN)) 
       {
         result=await this.userService.orgUsers([user.organization_id])
         return {statusCode:200,message:" All Users in This Organization",data:result}
       }
       else if(user.orgRole=="ORG_ADMIN")
          {
            result=await this.userService.orgUsers([user.organization_id])
            return {statusCode:200,message:" All Users in This Organization",data:result}
          }
          else
          {
            throw new HttpException({
              status: HttpStatus.FORBIDDEN,
              error: 'Forbidden',
              message: "You are not a admin",
            }, HttpStatus.FORBIDDEN);
           
          }
    }
  else {
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid USer",
    }, HttpStatus.EXPECTATION_FAILED); 
  }
}

@Get('companyUsers')                             //// universal switching for users on basis of role of the user
@UseGuards(JwtAuthGuard)
async companyUsers(@Request() req){
  let user = await this.userService.findOne(req.user.id)
  if(!user)
  {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT_FOUND',
        message: "User Not Found",
      }, HttpStatus.NOT_FOUND);
  }
  let result
  // result=await this.userService.findByOrganization(user.organization_id)
  // return result
  if(user.roles)
    {
       if(user.roles.includes(UserRole.PRODO_ADMIN)) 
       {
         result=await this.userService.companyUsers([user.companyId])
         return {statusCode:200,message:" All Users in This Company",data:result}
       }
       else if(user.companyRole=="COMPANY_ADMIN")
          {
            result=await this.userService.companyUsers([user.companyId])
            return {statusCode:200,message:" All Users in This Company",data:result}
          }
          else
          {
            throw new HttpException({
              status: HttpStatus.FORBIDDEN,
              error: 'Forbidden',
              message: "You are not a admin",
            }, HttpStatus.FORBIDDEN);
           
          }
    }
  else {
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid USer",
    }, HttpStatus.EXPECTATION_FAILED); 
  }
}

@Get('entityUsers')                             //// universal switching for users on basis of role of the user
@UseGuards(JwtAuthGuard)
async entityUsers(@Request() req){
  let user = await this.userService.findOne(req.user.id)
  if(!user)
  {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT_FOUND',
        message: "User Not Found",
      }, HttpStatus.NOT_FOUND);
  }
  let result
  // result=await this.userService.findByOrganization(user.organization_id)
  // return result
  if(user.roles)
    {
       if(user.roles.includes(UserRole.PRODO_ADMIN)) 
       {
         result=await this.userService.entityUsers([user.entityId])
         return {statusCode:200,message:" All Users in This Entity",data:result}
       }
       else if(user.companyRole=="COMPANY_ADMIN")
          {
            result=await this.userService.entityUsers([user.entityId])
            return {statusCode:200,message:" All Users in This Entity",data:result}
          }
          else
          {
            throw new HttpException({
              status: HttpStatus.FORBIDDEN,
              error: 'Forbidden',
              message: "You are not a admin",
            }, HttpStatus.FORBIDDEN);
           
          }
    }
  else {
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid USer",
    }, HttpStatus.EXPECTATION_FAILED); 
  }
}


@Post('organizationSwitch/:id')
@UseGuards(JwtAuthGuard)
async organizationswitch(@Request() req,@Param('id') id:any){
  let user = await this.userService.findOne(req.user.id)
  console.log(req.user);
  
  console.log(user);
  
  console.log("inside the required controller");
  
  if(!user)
  {
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User Not Found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  let result
    if(user.roles)
    {
       if (user.roles.includes(UserRole.PRODO_ADMIN)) {
        user.orgRole= "ORG_ADMIN"
             user.organization_id=id
             result = await this.userService.switchupdate1(user)

         return {statusCode:200,message:"Successfully switched Organization",result: result}
       }
       else if(user.orgIds.includes(id)){
         let role=user.orgIdRoles.find(i => i.id==id)
         if(role){
             user.orgRole= role.role
             user.organization_id=id
             result = await this.userService.switchupdate1(user)
             if(result){
              return {statusCode:200,message:"Successfully switched Organization",updatedUser:user}
             }
             else{
               throw new HttpException({
                 status: HttpStatus.EXPECTATION_FAILED,
                 error: 'Error in updating the role', 
                 message: "Error in updating the role",
               }, HttpStatus.EXPECTATION_FAILED);
             }
         }
       return result
         } 
      else{
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Forbidden',
          message: "You are not in this org",
        }, HttpStatus.FORBIDDEN);
      }
    }
    else{
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid USer",
      }, HttpStatus.EXPECTATION_FAILED);
    }
}

@Post('companySwitch/:id')
@UseGuards(JwtAuthGuard)
async companySwitch(@Request() req :any,@Param('id') id :any){

  let result
  let user = await this.userService.findOne(req.user.id)
  if(user.roles)
  {
  if(user.roles.includes(UserRole.PRODO_ADMIN)){
    user.companyRole = "COMPANY_ADMIN"
    user.companyId=id
    result = await this.userService.switchupdate1(user)
    return {statusCode:200,message:"Successfully switched Company",result : result}
  }
  else if(user.companyIds.includes(id)){
    let role=user.companyIdRoles.find(i => i.id==id)
    if(role){
      // console.log(role)
        user.companyRole = role.role
        user.companyId=id
        result = await this.userService.switchupdate1(user)
        if(result){
         return {statusCode:200,message:"Successfully switched Company",updatedUser:user}
        }
        else{
          throw new HttpException({
            status: HttpStatus.EXPECTATION_FAILED,
            error: 'Error in updating the role',
            message: "Error in updating the role",
          }, HttpStatus.EXPECTATION_FAILED);
        }
      }
    
  return result
    }
    else{
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "You are not in this Company",
      }, HttpStatus.FORBIDDEN);
    }
  }
  else{
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid USer",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  }


@Post('entitySwitch/:id')
@UseGuards(JwtAuthGuard)
async entityswitch(@Request() req,@Param('id') id:any){
  console.log(id)
  let result
  let user = await this.userService.findOne(req.user.id)
  // return user
  if(user.roles)
{
  if(user.roles.includes("PRODO_ADMIN")){
    user.entityRole = "ENTITY_ADMIN"
    user.entityId=id
    // return user
    result = await this.userService.switchupdate1(user)
    return {statusCode:200,message:"Successfully switched Entity",result : result}
  }
  else if(user.entityIds.includes(id)){
    let role=user.entityIdRoles.find(i => i.id==id)
    if(role){
      // console.log(role)
        user.entityRole = role.role
        user.entityId=id
        // return user
        result = await this.userService.switchupdate1(user)
        if(result){
         return {statusCode:200,message:"Successfully switched Entity",updatedUser:user}
        }
        else{
          throw new HttpException({
            status: HttpStatus.EXPECTATION_FAILED,
            error: 'Error in updating the role',
            message: "Error in updating the role",
          }, HttpStatus.EXPECTATION_FAILED);
        }
    }
  return result
}
else{
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'Forbidden',
    message: "You are not in this entity",
  }, HttpStatus.FORBIDDEN);
}
}
else{
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Invalid USer",
  }, HttpStatus.EXPECTATION_FAILED);
}
}

/////////////////////////////// MErege


@Post('roleSwitch/:id')
@UseGuards(JwtAuthGuard)
async adminLevel(@Request() req:any,@Param('id') id:any,@Body() data : any){
let adminUser = await this.userService.findOne(req.user.id)
let user = await this.userService.findOne(id)
let type = data.type
let check 

if(!user){
  console.log("throw exception that user does not exist");
  throw new HttpException({ 
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Invalid User",
  }, HttpStatus.EXPECTATION_FAILED)
}
if(!adminUser){
  console.log("throw exception that admin uer does not exists");
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Invalid User",
  }, HttpStatus.EXPECTATION_FAILED)
}
if (adminUser.roles.includes(UserRole.PRODO_ADMIN)){
  console.log("prodo admin can do the switching but there are still some conditions to meet");
  check = "PRODO_ADMIN"
  if(type == "organization"){
      console.log("org switching is requested");
      if(user.orgIds.includes(data.id)){
        console.log("switching is ossible"); 
        await this.userService.adminLevelSwitch(type,check,user,adminUser,data)
      }
      else{
        console.log("throw exception because the user is not part of the organization");
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "Invalid User",
        }, HttpStatus.EXPECTATION_FAILED)
        
      }
  }
  if(type == "company"){
    console.log("copany switch is requested");
    if(user.companyIds.includes(data.id)){
      console.log("switching is ossible"); 
      await this.userService.adminLevelSwitch(type,check,user,adminUser,data)

    }
    else{
      console.log("throw exception because the user is not part of the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid User",
      }, HttpStatus.EXPECTATION_FAILED)
      
    }
    
  }
  if(type == "entity"){
    console.log("entity switch is requested");
    if(user.entityIds.includes(data.id)){
      console.log("switching is possible"); 
      await this.userService.adminLevelSwitch(type,check,user,adminUser,data)

    }
    else{
      console.log("throw exception because the user is not part of the organization");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid User",
      }, HttpStatus.EXPECTATION_FAILED)
      
    }
  }
}
else{
  check = "NOT_PRODO_ADMIN"
  console.log("further checks are needed and we cannot check dertails of org,comp and ent here so we transfer data to user service");
  await this.userService.adminLevelSwitch(type,check,user,adminUser,data)
}

}

@Post('userRoleSwitch/:id')
@UseGuards(JwtAuthGuard)
async userroleswichapi(@Request() req:any,@Param('id') id:any,@Body() data :any){
  let user = await this.userService.findOne(req.user.id)  
  if(user == null){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid User",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  if(data ==null){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Insufficient credentials provided",
    }, HttpStatus.EXPECTATION_FAILED)}
    await this.userService.superSwitch(user,data.type,data,id)
  return "something"
  
}

@Post("addingUsers/:id")
@UseGuards(JwtAuthGuard)
async addingUsers(@Request() req:any,@Body() data:any,@Param('id') id:any){
  let user = await this.userService.findOne(id)
  let adminUser = await this.userService.findOne(req.user.id)
  if(!user){
    console.log("throw exception that the user does not existed for the requested id");
  }
  if(!adminUser){
    console.log("throw exception that cannot tfind youin the db");
  }
  if(!data){
    console.log("throw exception that no data is provided");
  }
  let type = data.type
  await this.userService.toAddTheUser(type,data,user,adminUser)

}


@Delete('removeUser/:id')
@UseGuards(JwtAuthGuard)
async removingUser(@Request() req:any,@Body() body:any,@Param('id') id:any){
  let user = await this.userService.findOne(id)
  if(!user){
    console.log("throw exception the user already does not exists");
  }
  let adminUser = await this.userService.findOne(req.user.id)
  if(!adminUser){
    console.log("throw exception that invalid user making the request");
  }
  if(body == null){
    console.log("credentials not provided for operation");
  }
  let type = body.type
  await this.userService.toDeleteUser(user,adminUser,body,type)
}
// async deletingUser(@Request() req:any,@Body() body:any,@Param('id') id :any){
//   let user = await this.userService.findOne(id)
//   let adminUser = await this.userService.findOne(req.user.id)
//   let type = body.type
//   let deleteId = body.id
//   if(user !== null || type == null){
//     throw new HttpException({
//       status: HttpStatus.EXPECTATION_FAILED,
//       error: 'EXPECTATION_FAILED',
//       message: "Insufficient credentials provided",
//     }, HttpStatus.EXPECTATION_FAILED)
//   }
//   return await this.userService.deleteUser(user,type,deleteId,adminUser)
// }

//////////////////////////////////////////////////////////////


@Post('inviteUser/:id')
@UseGuards(JwtAuthGuard)
async inviteUser(@Request() req:any,@Body() data:any,@Param('id') id :any)
{
  let adminUser = await this.userService.findOne(req.user.id)
  let user = await this.userService.findOne(id)
  if(data == null){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "data not provided",
    }, HttpStatus.EXPECTATION_FAILED)
  }
  let type = data.type
  let inviteId = data.inviteId
  if(adminUser == null || user == null){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'EXPECTATION_FAILED',
      message: "Invalid user/user(s)",
    }, HttpStatus.EXPECTATION_FAILED)
  }  
  return await this.userService.inviteUser(user,adminUser,data,type,inviteId)

}

@Post('transferOrganization/:id')                  // 
@UseGuards(JwtAuthGuard)
async transferUserData(@Request() req:any,@Param('id') id :any,@Body() data :any)
  {
  let user = await this.userService.findOne(id)         //  transferring admin user org to user
  let adminUser = await this.userService.findOne(req.user.id)
    if(adminUser == null || user == null){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid user/user(s)",
      }, HttpStatus.EXPECTATION_FAILED)
    }
   let result = await this.userService.transferUserData(adminUser,user,data)
   return {statusCode : 200,message :"User data transfereed", data : result}
  }

@Post('inviteToProdo')
@UseGuards(JwtAuthGuard)
async invitation(@Request() req :any,@Body() body: any){
let email = body.email
let data = body
let adminUser = await this.userService.findOne(req.user.id)
if(!adminUser){
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "Requesting User is not part of the organization",
  }, HttpStatus.EXPECTATION_FAILED);
}
if(email == null){
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: "email not provided",
  }, HttpStatus.EXPECTATION_FAILED);
}
let user = await this.userService.findByEmail(email)
if(user){
  throw new HttpException({
    status: HttpStatus.EXPECTATION_FAILED,
    error: 'EXPECTATION_FAILED',
    message: " User already exists",
  }, HttpStatus.EXPECTATION_FAILED);
}
else {
  await this.userService.inviteUserToProdo(email,data,adminUser)  
}
return {message : "invitation sent", statusCode : 200}
}

@Post('acceptInviteToProdo')
async inviteAccept(@Body() data :any){
  let tempUserId = data.id
  return await this.userService.acceptInviteNewUser(tempUserId)
}

@Post('acceptInviteExistingUser')
async inviteAcceptuser(@Body() data :any){
let inviteId = data.inviteId
let userId = data.userId
return await this.userService.acceptInviteExistingUser(inviteId,userId)
}
}

