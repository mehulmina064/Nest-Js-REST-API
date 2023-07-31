import { User } from '../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'superagent';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';
import { UserRole } from '../users/roles.constants';
import { InjectRepository } from '@nestjs/typeorm';

import fetch from 'node-fetch'
var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { zohoBillService } from './zohoBill.service'


@Controller('zohoBill')
export class zohoBillController {
  constructor(  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly zohoBillService:zohoBillService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
//   @Query('byOrganization',new DefaultValuePipe(true)) byOrganization: boolean,
//   @Query('byCompany') byCompany: boolean,
//   @Query('byEntity') byEntity: boolean,
  @Query('status', new DefaultValuePipe(''),) status: string = "",
  // @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,

  ) {
    // limit = limit > 200 ? 200 : limit;
    limit = limit > 500 ? 500 : limit;
    let start= (page - 1) * limit
    let end = page * limit
    let user = await this.userRepository.findOne(req.user.id)
    if(!user)
    {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "User Not Found",
        }, HttpStatus.EXPECTATION_FAILED);
      }
      // console.log(user)
    const attrFilter = []
      if(status){
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
              { description: { $regex: search, $options: 'i' } },
              { customerName: { $regex: search, $options: 'i' } },
              { purchaseorder_number: { $regex: search, $options: 'i' } },
              { date: { $regex: search, $options: 'i' } },
              { reference_number: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { order_status: { $regex: search, $options: 'i' } },
              { received_status: { $regex: search, $options: 'i' } },
              { billed_status: { $regex: search, $options: 'i' } },
              { vendor_name: { $regex: search, $options: 'i' } }, 
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
                { description: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { purchaseorder_number: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
                { reference_number: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { order_status: { $regex: search, $options: 'i' } },
                { received_status: { $regex: search, $options: 'i' } },
                { billed_status: { $regex: search, $options: 'i' } },
                { vendor_name: { $regex: search, $options: 'i' } }, 
              ]
            }
          }
      }
    //  return query
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      let query1 = {
        where: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { purchaseorder_number: { $regex: search, $options: 'i' } },
            { date: { $regex: search, $options: 'i' } },
            { reference_number: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { order_status: { $regex: search, $options: 'i' } },
            { received_status: { $regex: search, $options: 'i' } },
            { billed_status: { $regex: search, $options: 'i' } },
            { vendor_name: { $regex: search, $options: 'i' } }, 
          ]
        }
      }
      let attrFilter1=[]

        if(status){
            attrFilter1.push({
              "status": status
            })
          let query1 = {
            where: {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { purchaseorder_number: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
                { reference_number: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { order_status: { $regex: search, $options: 'i' } },
                { received_status: { $regex: search, $options: 'i' } },
                { billed_status: { $regex: search, $options: 'i' } },
                { vendor_name: { $regex: search, $options: 'i' } }, 
              ],
              $and: [
                ...attrFilter1
              ]   
            }
          }
        result = await this.zohoBillService.findAll(query1) 
        }
      else{
        result = await this.zohoBillService.findAll(query1)  
      }
    result.data = result.data.slice(start, end) 

    return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
        result = await this.zohoBillService.findAll(query)  
    result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
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

@Post('syncOneBill')
async updateOne(@Body('bill_id') id:any) { 
  // var id=purchaseorder.purchaseorder_id
  if(id){
    let result = await this.zohoBillService.saveFromZohoId(id)
    return {statusCode:200,message:"successfully saved data for this bill",data:result}
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'Bill Id not found',
      message: "id not found in Request",
    }, HttpStatus.BAD_REQUEST);
  }
}

@Post('syncAllBill/:start')
async updateAll(@Param('start') start: any){
  let result=[]
  let page=1
  if(start>200){
    if(start%200){
      page=((start-start%200)/200)+1
      start=start%200
    }
    else{
      page=start/200
      }
  } 
  console.log(page)
  for(page;page>0;page++){
    let data=await this.zohoBillService.zohoAll(page)
    if(data.count){ 
      let Orders=data.data
    for(let i=start;i<Orders.length;i++){
    // for(let i=start;i<100;i++){
        let order=Orders[i]
        let out = await this.zohoBillService.saveFromZohoId(order.bill_id)
        console.log("syncing Bill-",order.bill_id,"   ","no-",i ,"page-",page)
        if(out){
            result.push({bill_id:order.bill_id,response:out,statusCode:200,message:"success",number:i})
          }  
          else{
            result.push({bill_id:order.bill_id,error:"Error",statusCode:500,message:"Data invalid",number:i})
          }
      }
      start=0
    }
    else{
      break; 
    }
  }
  return result
}

@Get('zohoAllBill')
async zohoAll(){
    let page=1
    let result=[]
    for(let page =1;page>0;page++){ 
      let data=await this.zohoBillService.zohoAll(page) 
      if(data.count){
        result= result.concat(data.data)
      }
      else{
        break;
      }
    }
    return {statusCode:200,message:"All Orders From zoho",count:result.length,data:result}

}

@Get('zohoOneBill/:id')
async zohoOne(@Param('id') id: any){
  let data= await this.zohoBillService.InventoryByID(id)
  return {statusCode:200,message:"Order Details from zoho mapped",data:data}
}

@Get('getAttachment/:billId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Attachment.pdf')
async getAttachment(@Param('billId') purchaseOrderId: any,@Response() res: any): Promise<Buffer>{
    throw new HttpException({
        status: HttpStatus.NOT_IMPLEMENTED,
        error: 'NOT_IMPLEMENTED',
        message: "NOT_IMPLEMENTED",
      }, HttpStatus.NOT_IMPLEMENTED);
  var attachment=await this.zohoBillService.getAttachment(billId)
  if(attachment){
    attachment.pipe(res)
    return res
  }
  else{
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'Attachment not found',
      message: "Attachment not found",
    }, HttpStatus.NOT_FOUND);
  }
}

@Get('BillSummary/:billId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Summary.pdf')
async Summary(@Param('billId') billId: any,@Response() res: any): Promise<Buffer>{
  var Summary=await this.zohoBillService.Summary(billId)
  if(Summary){
    Summary.pipe(res)
    return res
  }
  else{
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'Summary not found',
      message: "Summary not found",
    }, HttpStatus.NOT_FOUND);
  }
}

  
}