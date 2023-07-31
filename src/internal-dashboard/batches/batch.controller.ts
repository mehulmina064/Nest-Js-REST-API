import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe, ParseArrayPipe  } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
// import { IJwtAuthGuard } from '../../authentication/jwt-auth.guard';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'superagent';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { CreateBatchDto,UpdateBatchDto,CreateFieldDto,UpdateFieldDto, } from './batch.dto';

import { Status, batch } from './batch.entity';
import { InjectRepository } from '@nestjs/typeorm';

import fetch from 'node-fetch'
var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { batchService } from './batch.service'
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { batchItemService } from '../batchItems/batchItem.service'
import {internalSalesOrderService} from '../zohoData/services/salesOrder.service'


@Controller('internal/batch')
export class batchController {
  constructor(  
  private readonly batchService:batchService,
  private readonly zohoEmployeeService:zohoEmployeeService,
  private readonly batchItemService:batchItemService,
  private readonly internalSalesOrderService:internalSalesOrderService,
  ) { }

  @UseGuards(IJwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  // @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,

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

      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { salesOrderId: { $regex: search, $options: 'i' } },
              { assignedTo: { $regex: search, $options: 'i' } },
              { dueDate: { $regex: search, $options: 'i' } },
              { completionDate: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
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
                { salesOrderId: { $regex: search, $options: 'i' } },
                { assignedTo: { $regex: search, $options: 'i' } },
                { dueDate: { $regex: search, $options: 'i' } },
                { completionDate: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
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
      result = await this.batchService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All batches",count:result.count,limit:limit,page:page,data:result.data}
    } 
    else {
      // return query
        result = await this.batchService.findAll(query)  
        result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All batches",count:result.count,limit:limit,page:page,data:result.data}
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
      let batch=await this.batchService.findOne(id);
      let batchItems = await this.batchItemService.findAll({where: { batchId: String(batch.id)}})    
      batch.batchesItems=batchItems.data
      return {statusCode:200,message:"Details",data:batch}
  }

  @Post()
  @UseGuards(IJwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async save(@Body() role: CreateBatchDto,@Request() req:any) {
//   async save(@Body() role: batch,@Request() req:any) {
      role.updatedBy=req.user.id;
      role.createdBy=req.user.id;
      let check=await this.internalSalesOrderService.check(role.salesOrderId)
      if(!check){
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Please add correct sales order Id',
          message: "Please add correct sales order Id",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      let save= await this.batchService.save(role);
      if(save){
        return {statusCode:200,message:"Successfully created",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not saved',
          message: "Not saved",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

  }

  @Patch(':id')
  @UseGuards(IJwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() role: UpdateBatchDto,@Request() req:any) {
   // return role
//    if(role.status==Status.DELETED){
//      throw new HttpException({
//        status: HttpStatus.BAD_REQUEST,
//        error: 'status must be not ' + role.status,
//        message: 'User does not have permission to perform this action',
//      }, HttpStatus.BAD_REQUEST);
//    }
      role.updatedBy=req.user.id;
      role.updatedAt= new Date()
      let save= await this.batchService.update(id, role);
      if(save){
        return {statusCode:200,message:"Successfully updated",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not updated',
          message: "Not updated",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Delete(':id')
  @UseGuards(IJwtAuthGuard)
  async softDelete(@Param('id') id: string,@Request() req:any) {
      let save=await this.batchService.softRemove(id,req.user.id);
      if(save){
        return {statusCode:200,message:"Successfully Deleted",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not Deleted',
          message: "Not Deleted",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }



//*for add and edit and remove fields from the pType
@Post('addFields/:id')
@UseGuards(IJwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
async addPermissions(@Param('id') id: string,@Request() req:any,@Body(new ParseArrayPipe({ items: CreateFieldDto }))
body: CreateFieldDto[]) {
  let d=body.map(item => item.apiName)
  if(new Set(d).size !== d.length)
  {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error:'apiName name must be unique',
      message: 'apiName name must be unique',
    }, HttpStatus.BAD_REQUEST);
  }
  else{
    let save= await this.batchService.addFields(id,req.user.id,body);
    if(save){
      return {statusCode:200,message:"Successfully added fields",data:save}
    }  
    else{
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Not added fields',
        message: "Not added fields",
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Patch('editFields/:id')
@UseGuards(IJwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
async editPermissions(@Param('id') id: string,@Request() req:any,@Body(new ParseArrayPipe({ items: CreateFieldDto }))
body: CreateFieldDto[],) {
  let d=body.map(item => item.apiName)
  if(new Set(d).size !== d.length)
  {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error:'apiName name must be unique',
      message: 'apiName name must be unique',
    }, HttpStatus.BAD_REQUEST);
  }
  else{
    let save= await this.batchService.editFields(id,req.user.id,body);
    if(save){
      return {statusCode:200,message:"Successfully updated fields",data:save}
    }  
    else{
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Not updated fields',
        message: "Not updated fields",
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}

  
}