import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { internalTeam, teamStatus } from './team.entity';
import { CreateTeamDto,UpdateTeamDto } from './team.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { internalTeamService } from './team.service'
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { userTeamService } from './userTeam.service';
var ObjectId = require('mongodb').ObjectID; 

import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/teams')
export class prodoRolesController {
  constructor(  
  private readonly internalTeamService:internalTeamService,
  private readonly zohoEmployeeService:zohoEmployeeService,
  private readonly userTeamService:userTeamService,

  ) { }

  //*Roles
  @UseGuards(IJwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  // @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  @Query('isDefault',new DefaultValuePipe('NA')) isDefault: string="NA",

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
      if(isDefault!="NA"){
        if(isDefault=="true"){
          attrFilter.push({
            "isDefault": true
          })
        }else{
          attrFilter.push({
            "isDefault": false
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { teamName: { $regex: search, $options: 'i' } },
              { teamDisplayName: { $regex: search, $options: 'i' } },
              { teamDescription: { $regex: search, $options: 'i' } }
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
                { teamName: { $regex: search, $options: 'i' } },
                { teamDisplayName: { $regex: search, $options: 'i' } },
                { teamDescription: { $regex: search, $options: 'i' } }
              ]
            }
          }
      }
    //  return query 
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      // console.log("error")
      // return user
      result = await this.internalTeamService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All Teams",count:result.count,limit:limit,page:page,data:result.data}
    } 
    else {
      // return query
        result = await this.internalTeamService.findAll(query)  
        result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Teams",count:result.count,limit:limit,page:page,data:result.data}
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
     let users = await this.userTeamService.findAll({where: { teamId: id}})    
     let userIds=[]
     for (let a of users.data){
      userIds.push({_id:ObjectId(a.userId)})
     }  
     let yep = await this.zohoEmployeeService.findAll({where : { $or : [...userIds]}})
     // return yep.data
       let team=await this.internalTeamService.findOne(id);
       team.users=yep.data
      return {statusCode:200,message:"Details",data:team}

   }

   @Post()
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async save(@Body() team: CreateTeamDto,@Request() req:any) {
       team.updatedBy=req.user.id;
       team.createdBy=req.user.id;
       return await this.internalTeamService.save(team);  
   }

   @Patch(':id')
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(@Param('id') id: string, @Body() team: UpdateTeamDto,@Request() req:any) {
    // return team
    if(team.status==teamStatus.DELETED){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'status must be not ' + team.status,
        message: 'User does not have permission to perform this action',
      }, HttpStatus.BAD_REQUEST);
    }
       team.updatedBy=req.user.id;
       team.updatedAt= new Date()
       return await this.internalTeamService.update(id, team);
   }

   @Delete(':id')
   @UseGuards(IJwtAuthGuard)
   async softDelete(@Param('id') id: string,@Request() req:any) {
       return await this.internalTeamService.softRemove(id,req.user.id);
    }

   @Delete('permanentDelete/:id')
   @UseGuards(IJwtAuthGuard)
   async hardDelete(@Param('id') id: string,@Request() req:any) {
       if(req.user.roles.includes('PRODO_ADMIN'))
       {
        return await this.internalTeamService.hardRemove(id,req.user.id);
       }
       else{
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: 'User does not have permission to perform this action',
        }, HttpStatus.EXPECTATION_FAILED);
       }
    }



  
}