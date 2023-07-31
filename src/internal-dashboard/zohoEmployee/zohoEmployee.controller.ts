import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request,DefaultValuePipe,ParseIntPipe, UploadedFile, UseGuards, UseInterceptors,Res,Header,Response,HttpStatus, HttpException, UsePipes, ValidationPipe } from '@nestjs/common';

import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { editFileName } from '../../files/file.utils';

import { ILocalAuthGuard } from '../../authentication/internal-local-auth.guard';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUser} from './zohoEmployee.decorator';
import { zohoEmployee } from './zohoEmployee.entity';
import { CreateEmployeeDto } from './zohoEmployee.dto';
import { zohoEmployeeService } from './zohoEmployee.service'
import { diskStorage } from 'multer';
var ObjectId = require('mongodb').ObjectID; 



import fetch from 'node-fetch'
var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';

//import roles
import { userRolesService } from '../prodoRoles/userRoles.service';
import { prodoRolesService } from '../prodoRoles/prodoRoles.service';
//import teams
import { internalTeamService } from '../team/team.service'
import { userTeamService } from '../team/userTeam.service'

@Controller('internal/employee')
export class zohoEmployeeController {
  constructor(  
  private readonly zohoEmployeeService:zohoEmployeeService,
  private readonly authService: AuthenticationService,
  private readonly userRolesService: userRolesService,
  private readonly prodoRolesService: prodoRolesService,
  private readonly userTeamService: userTeamService,
  private readonly internalTeamService: internalTeamService,
  ) { }

  @UseGuards(IJwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  // @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  @Query('isEmployee',new DefaultValuePipe('NA')) isEmployee: string="NA",

  ) {

    // isEmployee
    // limit = limit > 200 ? 200 : limit;
    limit = limit > 500 ? 500 : limit;
    let start= (page - 1) * limit
    let end = page * limit
 let user = req.user
    
    const attrFilter = []
    if(status!="NA"){
        attrFilter.push({
          "status": status
        })
      }
      if(isEmployee!="NA"){
        if(isEmployee=="true"){
          attrFilter.push({
            "isEmployee": true
          })
        }else{
          attrFilter.push({
            "isEmployee": false
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { contactNumber: { $regex: search, $options: 'i' } },
              { designation: { $regex: search, $options: 'i' } },
              { dateOfBerth: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { zohoUserId: { $regex: search, $options: 'i' } }, 
            ],
            $and: [
              ...attrFilter
            ] 
          }
        }
      }
      else{
        query = {
            where: {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { dateOfBerth: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { zohoUserId: { $regex: search, $options: 'i' } }, 
              ]
            }
          }
      }
    //  return query
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      result = await this.zohoEmployeeService.findAll(query)  
      result.data = result.data.slice(start, end) 
      return {statusCode:200,message:"All Employees",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
        result = await this.zohoEmployeeService.findAll(query)  
        result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Employees",count:result.count,limit:limit,page:page,data:result.data}
    }
  }
  else{
      throw new HttpException({ 
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid User",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Get('allEmployee')
  async getAllEmployees(){
    let result = await this.zohoEmployeeService.findAll()
    return {statusCode:200,message:"All Employees",count:result.count,data:result.data}
  }

  @Get('profile')
  @UseGuards(IJwtAuthGuard)
  async getProfile(@Request() req:any) {
    // console.log('user-1',req.user);
    let u= await this.zohoEmployeeService.findOne(req.user.id);
    if(u){
      return {statusCode:200,message:"Employee Profile",data:u}
      }
      else{
        throw new NotFoundException(`user not found`);
      }
  }


@Post('setProfilePicture')
@UseGuards(IJwtAuthGuard)
async setProfilePicture(@Request() req:any,@Body() data: any) {
  if(!data.profilePicture)
  {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please provide profile picture",
      }, HttpStatus.BAD_REQUEST);
  }
    return await this.zohoEmployeeService.setProfilePicture(data.profilePicture,req.user.id);
}

  @UseGuards(IJwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req:any, @Body() userData: Partial<zohoEmployee>) {
    return await this.zohoEmployeeService.update(req.user.id, userData,req.user.roles);

  }

  @UseGuards(IJwtAuthGuard)
  @Post('apiCheck')
  async apiCheck(@Request() req:any) {
    return {statusCode:200,message:"Authorized",user:req.user}
  }

  @UseGuards(IJwtAuthGuard)
  @Get('employeeById/:id')
  async findOne(@Param('id') id: string) {
    let u = await this.zohoEmployeeService.findOne(id);
    if(u){
      return {statusCode:200,message:"Employee Details",data:u}
      }
      else{
        throw new NotFoundException(`user with this id- ${id} not found`);
      }
  }

  @UseGuards(IJwtAuthGuard)
  @Get('employeeByEmail/:email')
  async findOneByEmail(@Param('email') email: string) {
    let u= await this.zohoEmployeeService.findByEmail(email);
    if(u){
    return {statusCode:200,message:"Employee Details",data:u}
    }
    else{
      throw new NotFoundException(`user with this email- ${email} not found`);
    }
  }


  @UseGuards(IJwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: zohoEmployee, @Request() req:any) {
    user.updatedBy=req.user.id;
    user.updatedAt=new Date();
    return this.zohoEmployeeService.update(id, user,req.user.roles);
  }

  @Get('zohoAllUsers')
@UseGuards(IJwtAuthGuard)
async zohoAll(){
    let page=1
    let result=[]
    for(let page =1;page>0;page++){ 
      let data=await this.zohoEmployeeService.zohoAll(page) 
      if(data.count){
        result= result.concat(data.data)
      }
      else{
        break;
      }
    }
    return {statusCode:200,message:"All Users From zoho",count:result.length,data:result}

}

  async GetData(s:string,userId:string){
    switch (s) {
      case 'role':
        let userRoles = await this.userRolesService.findAll({where: { userId: userId}})    
        let userRoleIds=[]
        if(userRoles.count){
          for (let role of userRoles.data){
            userRoleIds.push({_id:ObjectId(role.roleId)})
          }  
          let yep = await this.prodoRolesService.findAll({where : { $or : [...userRoleIds]}})
          return yep.data
        }
        else{
          return []
        }
       
        break;
      case 'team':
        let userTeams = await this.userTeamService.findAll({where: { userId: userId}})    
        let userTeamIds=[]
        if(userTeams.count){
          for (let team of userTeams.data){
            userTeamIds.push({_id:ObjectId(team.teamId)})
          }  
          let yep1 = await this.internalTeamService.findAll({where : { $or : [...userTeamIds]}})
          return yep1.data
        }
        else{
          return []
        }
       
        break;
      default:
        console.log("Not implemented");

    }
    throw new NotFoundException(`Method not found contact admin`);
  }

  @UseGuards(IJwtAuthGuard)
  @Get(':id')
  async One(@Param('id') id: string,@Request() req:any) {
   let user= await this.zohoEmployeeService.findOne(id);
    if(user){
      let arrayKey = ['role','team']
      const promises = arrayKey.map(a => this.GetData(a,req.user.id))
      const result = await Promise.all(promises)
      user.userRoles = result[0]
      user.teams = result[1]
      return {statusCode:200,message:"Employee Details",data:user}
      }
      else{
        throw new NotFoundException(`user with this id- ${id} not found`);
      }
  }


  @UseGuards(IJwtAuthGuard)
  @Patch('password/:id')
  updatePassword(@Param('id') id: string, @Body() data: any) {
    console.log(data);
    return this.zohoEmployeeService.updatePassword(id, data);
  }
  
  @UseGuards(ILocalAuthGuard)
  @Post('/login')
  async login(@Request() req:any) {
    return this.authService.Ilogin(req.user); 
  }

  @Post('signUp')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Request() req:any,@Body() zohoEmployee: CreateEmployeeDto) {
    // return zohoEmployee
    let zohoUser=await this.zohoEmployeeService.getZohoEmployeeByEmail(zohoEmployee.email)
    zohoUser=await this.zohoEmployeeService.InventoryByID(zohoUser.user_id)
    const saveUser=await this.zohoEmployeeService.create(zohoEmployee,zohoUser)
    return {statusCode:200,message:"Successfully Registered as Employee",data:saveUser}
  }

  @UseGuards(IJwtAuthGuard)
  @Delete(':id')
  softDelete(@Param('id') id:any,@Request() req:any) {
    return this.zohoEmployeeService.softRemove(id,req.user.id);
  }

  @UseGuards(IJwtAuthGuard)
  @Delete('delete/:id')
  delete(@Param('id') id:any) {
    return this.zohoEmployeeService.remove(id);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() data: any) {
    console.log(data);
    return await this.zohoEmployeeService.forgotPassword(data.email);
    // return await this.zohoEmployeeService.forgotPassword(data.email,data.mobileNo);

  }
  @Post('/resetPassword')
  async resetPassword(@Body() data: any) {
    return await this.zohoEmployeeService.resetPassword(data.email,data.otp, data.password);
    // return await this.zohoEmployeeService.resetPassword(data.email,data.otp, data.password,data.mobileNo);

  }

  @UseGuards(IJwtAuthGuard)
  @Post('verifyOtp')
 async verifyOtp(@Param('contactNumber') contactNumber: string, @Param('otp') otp: string) {
    return this.zohoEmployeeService.verifyOtp(contactNumber, otp);
  }
  @UseGuards(ILocalAuthGuard)
  @Get('generateOtp/:contactNumber')
  generateOtp(@Param('contactNumber') contactNumber: string) {
    return this.zohoEmployeeService.generateOtp(contactNumber);
  }

  @UseGuards(IJwtAuthGuard)
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
  async uploadUsers(@Request() req:any, @UploadedFile() file:any) {
    return await this.zohoEmployeeService.uploadUsers(req.user,file);
  }





@Get('zohoOneUser/:id')
async zohoOne(@Param('id') id: any){
  let data= await this.zohoEmployeeService.InventoryByID(id)
  return {statusCode:200,message:"User Details from zoho mapped",data:data}
}

  

  
}