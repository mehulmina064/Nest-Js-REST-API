import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { prodoRoles, roleStatus } from '../prodoRoles/prodoRoles.entity';
import { CreateBatchItemDto,UpdateBatchItemDto,CreateFieldDto,UpdateFieldDto,CreateBatchItemProcessDto,UpdateBatchItemProcessDto } from './batchItem.dto';


import { InjectRepository } from '@nestjs/typeorm';
import { batchItemProcessService } from './batchItemProcess.service'
import { processService } from '../process/process.service'

import { batchItemService } from '../batchItems/batchItem.service'

import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/batchItemProcess')
export class batchItemProcessController {
  constructor(  
  private readonly processService:processService,
  private readonly batchItemProcessService:batchItemProcessService,
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
    let user = req.user
   
       let query = {
            where: {
              $or: [
                { batchItemId: { $regex: search, $options: 'i' } },
                { processId: { $regex: search, $options: 'i' } },
                { assignedTo: { $regex: search, $options: 'i' } },
                { dueDate: { $regex: search, $options: 'i' } },
                { completionDate: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
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
      result = await this.batchItemProcessService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All batch items process",count:result.count,limit:limit,page:page,data:result.data}
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
       return this.batchItemProcessService.findOne(id);
   }

   @Get('batchItemProcess/:batchItemId')
   @UseGuards(IJwtAuthGuard)
   async userRoles(@Param('batchItemId') batchItemId: string,@Request() req:any) {
    let query = {where: { batchItemId: batchItemId}}
    // if(req.user.id==roleId||req.user.roles.includes('PRODO_ADMIN'))
    // { 
      let result = await this.batchItemProcessService.findAll(query)    
      return {statusCode:200,message:"Test batchItem process",count:result.count,data:result.data}
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
   async save(@Body() role: CreateBatchItemProcessDto,@Request() req:any) {
    let roleCheck=await this.processService.check(role.processId)
    let permissionCheck=await this.batchItemService.check(role.batchItemId)
    if(roleCheck){
       if(permissionCheck){
        if(permissionCheck.parentSku){
          role.updatedBy=req.user.id;
          role.createdBy=req.user.id;
          return await this.batchItemProcessService.save(role);  
        } 
        else{
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'EXPECTATION_FAILED',
            message: 'Parent SKU of Batch Item is not defined please add by BatchItem Section',
          }, HttpStatus.BAD_REQUEST); 
        }
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
       message: 'processId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Patch(':id')
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(@Param('id') id: string, @Body() role: UpdateBatchItemProcessDto,@Request() req:any) {
    let roleCheck=await this.processService.check(role.processId)
    let permissionCheck=await this.batchItemService.check(role.batchItemId)
    if(roleCheck){
       if(permissionCheck){
        role.updatedBy=req.user.id;
        role.updatedAt= new Date()
        return await this.batchItemProcessService.update(id, role);
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
       message: 'processId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Delete(':id')
   @UseGuards(IJwtAuthGuard)
   async softDelete(@Param('id') id: string,@Request() req:any) {
       return await this.batchItemProcessService.softRemove(id,req.user.id);
    }

  
}