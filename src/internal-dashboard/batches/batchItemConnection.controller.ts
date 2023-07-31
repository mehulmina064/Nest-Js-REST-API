import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { prodoRoles, roleStatus } from '../prodoRoles/prodoRoles.entity';
import { CreateBatchDto,UpdateBatchDto,CreateFieldDto,UpdateFieldDto,CreateBatchItemConnectionDto,UpdateBatchItemConnectionDto } from './batch.dto';


import { InjectRepository } from '@nestjs/typeorm';
import { batchItemConnectionService } from './batchItemConnection.service'
import { batchService } from './batch.service'
import { batchItemService } from '../batchItems/batchItem.service'

import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
var ObjectId = require('mongodb').ObjectID; 

import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/batchItemConnection')
export class batchItemConnectionController {
  constructor(  
  private readonly batchService:batchService,
  private readonly batchItemConnectionService:batchItemConnectionService,
  private readonly batchItemService:batchItemService,
  private readonly zohoEmployeeService:zohoEmployeeService

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
    let user = await this.zohoEmployeeService.findOne(req.user.id)
    if(!user)
    {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "User Not Found", 
        }, HttpStatus.EXPECTATION_FAILED);
      }
       let query = {
            where: {
              $or: [
                { batchId: { $regex: search, $options: 'i' } },
                { batchItemId: { $regex: search, $options: 'i' } },
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
      result = await this.batchItemConnectionService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All batch items connections",count:result.count,limit:limit,page:page,data:result.data}
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
       return this.batchItemConnectionService.findOne(id);
   }

   @Get('batchItems/:batchId')
   @UseGuards(IJwtAuthGuard)
   async userRoles(@Param('batchId') batchId: string,@Request() req:any) {
    let query = {where: { batchId: batchId}}
    // if(req.user.id==roleId||req.user.roles.includes('PRODO_ADMIN'))
    // { 
      let result = await this.batchItemConnectionService.findAll(query)    
      return {statusCode:200,message:"Test batch items",count:result.count,data:result.data}
    // }
    // else{
    //   throw new HttpException({
    //     status: HttpStatus.BAD_REQUEST,
    //     error: 'EXPECTATION_FAILED',
    //     message: 'User does not have permission to perform this action',
    //   }, HttpStatus.BAD_REQUEST);
    // }
  
   }

   @Post()
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async save(@Body() role: CreateBatchItemConnectionDto,@Request() req:any) {
    let roleCheck=await this.batchService.check(role.batchId)
    let permissionCheck=await this.batchItemService.check(role.batchItemId)
    if(roleCheck){
       if(permissionCheck){
        role.updatedBy=req.user.id;
        role.createdBy=req.user.id;
        return await this.batchItemConnectionService.save(role);  
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'EXPECTATION_FAILED',
          message: 'batchItemId is not valid',
        }, HttpStatus.BAD_REQUEST);
       }
    }
    else{
     throw new HttpException({
       status: HttpStatus.BAD_REQUEST,
       error: 'EXPECTATION_FAILED',
       message: 'batchId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Patch(':id')
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(@Param('id') id: string, @Body() role: UpdateBatchItemConnectionDto,@Request() req:any) {
    let roleCheck=await this.batchService.check(role.batchId)
    let permissionCheck=await this.batchItemService.check(role.batchItemId)
    if(roleCheck){
       if(permissionCheck){
        role.updatedBy=req.user.id;
        role.updatedAt= new Date()
        return await this.batchItemConnectionService.update(id, role);
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'EXPECTATION_FAILED',
          message: 'batchItemId is not valid',
        }, HttpStatus.BAD_REQUEST);
       }
    }
    else{
     throw new HttpException({
       status: HttpStatus.BAD_REQUEST,
       error: 'EXPECTATION_FAILED',
       message: 'batchId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Delete(':id')
   @UseGuards(IJwtAuthGuard)
   async softDelete(@Param('id') id: string,@Request() req:any) {
       return await this.batchItemConnectionService.softRemove(id,req.user.id);
    }

  
}