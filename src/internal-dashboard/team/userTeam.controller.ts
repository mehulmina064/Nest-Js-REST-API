import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { internalTeam, teamStatus } from './team.entity';
import { CreateUserTeamDto,UpdateUserTeamDto } from './team.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { internalTeamService } from './team.service'
import { userTeamService } from './userTeam.service'
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/UserTeams')
export class userTeamController {
  constructor(  
  private readonly internalTeamService:internalTeamService,
  private readonly zohoEmployeeService:zohoEmployeeService,
  private readonly userTeamService:userTeamService,

  ) { }

  //*UserRoles
  @UseGuards(IJwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,

  ) {

    // isEmployee
    limit = limit > 200 ? 200 : limit;
    let start= (page - 1) * limit
    let end = page * limit
    let user = req.user
   
       let query = {
            where: {
              $or: [
                { teamId: { $regex: search, $options: 'i' } },
                { userId: { $regex: search, $options: 'i' } },
              ]
            }
          }
    //  return query 
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      // console.log("error")
      // return user
      result = await this.userTeamService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All UserTeams",count:result.count,limit:limit,page:page,data:result.data}
    } 
    else {
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: 'User does not have permission to perform this action',
      }, HttpStatus.EXPECTATION_FAILED);
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

   @Get(':id')
   @UseGuards(IJwtAuthGuard)
   async findOne(@Param('id') id: string) {
       return await this.userTeamService.findOne(id);
   }

   @Get('myTeams/:userId')
   @UseGuards(IJwtAuthGuard)
   async userRoles(@Param('userId') userId: string,@Request() req:any) {
    let query = {where: { userId: userId}}
    if(req.user.id==userId||req.user.roles.includes('PRODO_ADMIN'))
    { 
      let result = await this.userTeamService.findAll(query)    
      return {statusCode:200,message:"Your Teams",count:result.count,data:result.data}
    }
    else{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'EXPECTATION_FAILED',
        message: 'User does not have permission to perform this action',
      }, HttpStatus.BAD_REQUEST);
    }
  
   }

   @Post()
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async save(@Body() team: CreateUserTeamDto,@Request() req:any) {
    let roleCheck=await this.internalTeamService.check(team.teamId)
    let userCheck=await this.zohoEmployeeService.check(team.userId)
    if(roleCheck){
       if(userCheck){
        team.updatedBy=req.user.id;
        team.createdBy=req.user.id;
        return await this.userTeamService.save(team);  
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'EXPECTATION_FAILED',
          message: 'UserId is not valid',
        }, HttpStatus.BAD_REQUEST);
       }
    }
    else{
     throw new HttpException({
       status: HttpStatus.BAD_REQUEST,
       error: 'EXPECTATION_FAILED',
       message: 'TeamId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Patch(':id')
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(@Param('id') id: string, @Body() team: UpdateUserTeamDto,@Request() req:any) {
    let roleCheck=await this.internalTeamService.check(team.teamId)
    let userCheck=await this.zohoEmployeeService.check(team.userId)
    if(roleCheck){
       if(userCheck){
        team.updatedBy=req.user.id;
        team.updatedAt= new Date()
        return await this.userTeamService.update(id, team);
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'EXPECTATION_FAILED',
          message: 'UserId is not valid',
        }, HttpStatus.BAD_REQUEST);
       }
    }
    else{
     throw new HttpException({
       status: HttpStatus.BAD_REQUEST,
       error: 'EXPECTATION_FAILED',
       message: 'TeamId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Delete(':id')
   @UseGuards(IJwtAuthGuard)
   async softDelete(@Param('id') id: string,@Request() req:any) {
       return await this.userTeamService.softRemove(id,req.user.id);
    }

  //  @Delete('permanentDelete/:id')
  //  @UseGuards(IJwtAuthGuard)
  //  async hardDelete(@Param('id') id: string,@Request() req:any) {
  //      if(req.user.roles.includes('PRODO_ADMIN'))
  //      {
  //       return this.userTeamService.hardRemove(id,req.user.id);
  //      }
  //      else{
  //       throw new HttpException({
  //         status: HttpStatus.EXPECTATION_FAILED,
  //         error: 'EXPECTATION_FAILED',
  //         message: 'User does not have permission to perform this action',
  //       }, HttpStatus.EXPECTATION_FAILED);
  //      }
  //   }




  
}