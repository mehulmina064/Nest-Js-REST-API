import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { prodoRoles, roleStatus } from '../prodoRoles/prodoRoles.entity';
import { CreateTestProcessDto,UpdateTestProcessDto } from './test.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { testProcessService } from '../processTest/testProcess.service'
import { processService } from '../process/process.service'
import { TestService } from './test.service'

import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/testProcess')
export class testProcessController {
  constructor(  
  private readonly processService:processService,
  private readonly testProcessService:testProcessService,
  private readonly TestService:TestService,
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
                { testId: { $regex: search, $options: 'i' } },
                { processId: { $regex: search, $options: 'i' } },
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
      result = await this.testProcessService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All Test Process",count:result.count,limit:limit,page:page,data:result.data}
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
       return this.testProcessService.findOne(id);
   }

   @Get('processTest/:processId')
   @UseGuards(IJwtAuthGuard)
   async userRoles(@Param('processId') processId: string,@Request() req:any) {
    let query = {where: { processId: processId}}
    // if(req.user.id==roleId||req.user.roles.includes('PRODO_ADMIN'))
    // { 
      let result = await this.testProcessService.findAll(query)    
      return {statusCode:200,message:"Test Process",count:result.count,data:result.data}
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
   async save(@Body() role: CreateTestProcessDto,@Request() req:any) {
    let roleCheck=await this.processService.check(role.processId)
    let permissionCheck=await this.TestService.check(role.testId)
    if(roleCheck){
       if(permissionCheck){
        role.updatedBy=req.user.id;
        role.createdBy=req.user.id;
        return await this.testProcessService.save(role);  
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'EXPECTATION_FAILED',
          message: 'TestId is not valid',
        }, HttpStatus.BAD_REQUEST);
       }
    }
    else{
     throw new HttpException({
       status: HttpStatus.BAD_REQUEST,
       error: 'EXPECTATION_FAILED',
       message: 'ProcessId is not valid',
     }, HttpStatus.BAD_REQUEST);
    }
   }

   @Patch(':id')
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(@Param('id') id: string, @Body() role: UpdateTestProcessDto,@Request() req:any) {
    let roleCheck=await this.processService.check(role.processId)
    let permissionCheck=await this.TestService.check(role.testId)
    if(roleCheck){
       if(permissionCheck){
        role.updatedBy=req.user.id;
        role.updatedAt= new Date()
        return await this.testProcessService.update(id, role);
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'EXPECTATION_FAILED',
          message: 'TestId is not valid',
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
       return await this.testProcessService.softRemove(id,req.user.id);
    }

  //  @Delete('permanentDelete/:id')
  //  @UseGuards(IJwtAuthGuard)
  //  async hardDelete(@Param('id') id: string,@Request() req:any) {
  //      if(req.user.roles.includes('PRODO_ADMIN'))
  //      {
  //       return this.userRolesService.hardRemove(id,req.user.id);
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