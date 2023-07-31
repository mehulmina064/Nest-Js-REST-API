import { User } from './../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'superagent';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';
import { UserRole } from './../users/roles.constants';
import { InjectRepository } from '@nestjs/typeorm';

import fetch from 'node-fetch'
var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { zohoSalesOrderService } from './zohoSalesOrder.service'


@Controller('zohoSalesOrder')
export class zohoSalesOrderController {
  constructor(  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly zohoSalesOrderService:zohoSalesOrderService,
  ) { }


  // ***************************all orders without auth************************
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('all', new DefaultValuePipe('false')) all: string = "false",
  @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('byOrganization',new DefaultValuePipe('true')) byOrganization:  string="true",
  @Query('byCompany',new DefaultValuePipe('NA')) byCompany: string="NA",
  @Query('byEntity',new DefaultValuePipe('NA')) byEntity: string="NA", 
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
 
    // isEmployee
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
      // return user
    const attrFilter = []
    if(status!="NA"){
        attrFilter.push({
          "status": status
        })
      }
      if(byOrganization!="NA"){
        if(byOrganization=="true"){
          attrFilter.push({
            "organization_id": user.organization_id
          })
        }
      }
      if(byCompany!="NA"){
        if(byCompany=="true"){
          attrFilter.push({
            "companyId": user.companyId
          })
        }
      }
      if(byEntity!="NA"){
        if(byEntity=="true"){
          attrFilter.push({
            "entityId": user.entityId
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { customerName: { $regex: search, $options: 'i' } },
              { referenceNumber: { $regex: search, $options: 'i' } },
              { companyName: { $regex: search, $options: 'i' } },
              { salesorderNumber: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { salespersonName: { $regex: search, $options: 'i' } },
              { salesorderId: { $regex: search, $options: 'i' } },
              { date: { $regex: search, $options: 'i' } },
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
                { referenceNumber: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { salesorderNumber: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { salespersonName: { $regex: search, $options: 'i' } },
                { salesorderId: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
              ]
            }
          }
      }
    //  return query
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      let query1={
        where: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { referenceNumber: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { salesorderNumber: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { salespersonName: { $regex: search, $options: 'i' } },
            { salesorderId: { $regex: search, $options: 'i' } },
            { date: { $regex: search, $options: 'i' } },
          ]
        }
      }
      if(all=="true"){
        result = await this.zohoSalesOrderService.findAll(query)  
      }
      else{
        result = await this.zohoSalesOrderService.findAll(query1)  
      }
        result.data = result.data.slice(start, end)
        return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
    }
    else{
      // return query
      result = await this.zohoSalesOrderService.findAll(query)  
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

  @UseGuards(JwtAuthGuard)
  @Get('orderHistory')
  async orderHistory(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('all', new DefaultValuePipe('false')) all: string = "false",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  @Query('byOrganization',new DefaultValuePipe('true')) byOrganization:  string="true"
  @Query('byCompany',new DefaultValuePipe('NA')) byCompany: string="NA",
  @Query('byEntity',new DefaultValuePipe('NA')) byEntity: string="NA",
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {

    // isEmployee
    limit = limit > 200 ? 200 : limit;
    // limit = limit > 500 ? 500 : limit;
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
      // return user
    const attrFilter = []
    if(status!="NA"){
        attrFilter.push({
          "status": status
        })
      }
      if(byOrganization!="NA"){
        if(byOrganization=="true"){
          attrFilter.push({
            "organization_id": user.organization_id
          })
        }
      }
      if(byCompany!="NA"){
        if(byCompany=="true"){
          attrFilter.push({
            "companyId": user.companyId
          })
        }
      }
      if(byEntity!="NA"){
        if(byEntity=="true"){
          attrFilter.push({
            "entityId": user.entityId
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { customerName: { $regex: search, $options: 'i' } },
              { referenceNumber: { $regex: search, $options: 'i' } },
              { companyName: { $regex: search, $options: 'i' } },
              { salesorderNumber: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { salespersonName: { $regex: search, $options: 'i' } },
              { salesorderId: { $regex: search, $options: 'i' } },
              { date: { $regex: search, $options: 'i' } },
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
                { referenceNumber: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { salesorderNumber: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { salespersonName: { $regex: search, $options: 'i' } },
                { salesorderId: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
              ]
            }
          }
      }
    //  return query
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      let query1={
        where: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { referenceNumber: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { salesorderNumber: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { salespersonName: { $regex: search, $options: 'i' } },
            { salesorderId: { $regex: search, $options: 'i' } },
            { date: { $regex: search, $options: 'i' } },
          ]
        }
      }
      if(all=="true"){
        result = await this.zohoSalesOrderService.findAll(query)  
      }
      else{
        result = await this.zohoSalesOrderService.findAll(query1)  
      }
        result.data = result.data.slice(start, end)
        return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
      result = await this.zohoSalesOrderService.findAll(query)  
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

  @UseGuards(JwtAuthGuard)
  @Get('notYetShipped')
  async notYetShipped(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('all', new DefaultValuePipe('false')) all: string = "false",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  @Query('byOrganization',new DefaultValuePipe('true')) byOrganization:  string="true"
  @Query('byCompany',new DefaultValuePipe('NA')) byCompany: string="NA",
  @Query('byEntity',new DefaultValuePipe('NA')) byEntity: string="NA",
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {

    // isEmployee
    limit = limit > 200 ? 200 : limit;
    // limit = limit > 500 ? 500 : limit;
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
      // return user
    const attrFilter = []
    if(status!="NA"){
        attrFilter.push({
          "status": status
        })
      }
      if(byOrganization!="NA"){
        if(byOrganization=="true"){
          attrFilter.push({
            "organization_id": user.organization_id
          })
        }
      }
      if(byCompany!="NA"){
        if(byCompany=="true"){
          attrFilter.push({
            "companyId": user.companyId
          })
        }
      }
      if(byEntity!="NA"){
        if(byEntity=="true"){
          attrFilter.push({
            "entityId": user.entityId
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { customerName: { $regex: search, $options: 'i' } },
              { referenceNumber: { $regex: search, $options: 'i' } },
              { companyName: { $regex: search, $options: 'i' } },
              { salesorderNumber: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { salespersonName: { $regex: search, $options: 'i' } },
              { salesorderId: { $regex: search, $options: 'i' } },
              { date: { $regex: search, $options: 'i' } },
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
                { referenceNumber: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { salesorderNumber: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { salespersonName: { $regex: search, $options: 'i' } },
                { salesorderId: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
              ]
            }
          }
      }
    //  return query
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      let query1={
        where: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { referenceNumber: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { salesorderNumber: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { salespersonName: { $regex: search, $options: 'i' } },
            { salesorderId: { $regex: search, $options: 'i' } },
            { date: { $regex: search, $options: 'i' } },
          ]
        }
      }
      if(all=="true"){
        result = await this.zohoSalesOrderService.findAll(query)  
      }
      else{
        result = await this.zohoSalesOrderService.findAll(query1)  
      }
      result=await this.zohoSalesOrderService.notYetShipped(result)
        result.data = result.data.slice(start, end)
        return {statusCode:200,message:"All Not Yet Shipped products",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
      result = await this.zohoSalesOrderService.findAll(query)  
      result=await this.zohoSalesOrderService.notYetShipped(result)
      result.data = result.data.slice(start, end)
      return {statusCode:200,message:"All Not Yet Shipped products",count:result.count,limit:limit,page:page,data:result.data}
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


@UseGuards(JwtAuthGuard)
@Get('bySalesOrderId/:id')
async OneSo(@Param('id') id: any,@Request() req:any){
  let user = await this.userRepository.findOne(req.user.id) 
  if(!user)
  {
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User Not Found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    if(user.roles)
      {
  if (user.roles.includes(UserRole.PRODO_ADMIN)){
    let data= await this.zohoSalesOrderService.findOne(id)
    if(data){
      return {statusCode:200,message:"Order Details",data:data}
    }
    else{
      throw new HttpException({ 
        status: HttpStatus.NOT_FOUND,
        error: 'salesorder not found',
        message: "Please check your id",
      }, HttpStatus.NOT_FOUND);
    }
  }
  else {
    let data= await this.zohoSalesOrderService.findOne(id)
    if(data){
      if(user.orgIds.includes(data.organization_id)){
        return {statusCode:200,message:"Order Details ",data:data}
      }
      else if(user.companyIds.includes(data.companyId)){
        return {statusCode:200,message:"Order Details",data:data}
      }
      else if(user.entityIds.includes(data.entityId)){
        return {statusCode:200,message:"Order Details",data:data}
      }
      else{
        throw new HttpException({ 
          status: HttpStatus.BAD_REQUEST,
          error: 'You are not authorized to check this order Details',
          message: "You are not authorized to check this order Details",
        }, HttpStatus.BAD_REQUEST);
      }
    }
    else{
      throw new HttpException({ 
        status: HttpStatus.NOT_FOUND,
        error: 'salesorder not found',
        message: "Please check your id",
      }, HttpStatus.NOT_FOUND);
    }
  
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

  @Get('salesDashboardData')
  @UseGuards(JwtAuthGuard)
  async all_data(@Request() req:any) {
    let d_data={
      orders : {
          total : 0,
          completed : 0,
          inProgress : 0,
          submitted:0,
          cancelled : 0
      },
      rfq : {
          approved : 0,
          rejected : 0,
          inProgress : 0,
          total_submitted:0,
      },
      payments : {
          total : 0,
          paid : 0,
          due : 0,

      },
      pieChart : [],
      barChart : []
}
      let orders=await this.findAll(req)
      orders= orders.data
        if(orders.length>0){
            return await this.zohoSalesOrderService.calDashboardData(d_data,orders)
        }
        else{
          return d_data 
        }
  }

@Post('syncOneOrder')
async updateSalesOrder(@Body('salesorder_id') id:any) { 
  // var id=salesorder.salesorder_id
  if(id){
    let result = await this.zohoSalesOrderService.saveFromZohoId(id)
    return {statusCode:200,message:"successfully saved data for this salesOrder",data:result}
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'SalesOrderID not found',
      message: "id not found in Request",
    }, HttpStatus.BAD_REQUEST);
  }
}

@Post('syncOneOrderByNumber')
async updSalesOrder(@Body('salesorder_number') id:any) { 
  // var id=salesorder.salesorder_id
  let so=await this.zohoSalesOrderService.ByReferenceNumber(id)
  if(so){
    let result = await this.zohoSalesOrderService.saveFromZohoId(so.salesorderId)
    return {statusCode:200,message:"successfully saved data for this salesOrder",data:result}
  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'SalesOrderID not found',
      message: "id not found in Request",
    }, HttpStatus.BAD_REQUEST);
  }
}

@Post('syncAllOrder/:start')
async updateSalesOrders(@Param('start') start: any){
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
  for(page;page>0;page++){
    let data=await this.zohoSalesOrderService.zohoAllSo(page) 
    if(data.count){
      let Orders=data.data 
    for(let i=start;i<Orders.length;i++){
    // for(let i=start;i<200;i++){

        let order=Orders[i]
        // console.log(order)
        let out = await this.zohoSalesOrderService.saveFromZohoId(order.salesorder_id,page)
        console.log("syncing order-",order.salesorder_id,"   ","no-",i ,"page-",page)
        if(out){
          result.push({salesorder_id:order.salesorder_id,response:out,statusCode:200,message:"success",number:i,page:page})
        }  
        else{
          result.push({salesorder_id:order.salesorder_id,error:"Error",statusCode:500,message:"Data invalid",number:i,page:page})
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

@Get('zohoAllSo') 
async zohoAllSo(){ 
  let page=1
  let result=[]
  for(let page =1;page>0;page++){
    let data=await this.zohoSalesOrderService.zohoAllSo(page) 
    if(data.count){
      result= result.concat(data.data)
    }
    else{
      break;
    }
  }
  return {statusCode:200,message:"All Orders From zoho",count:result.length,data:result}

}


@Get('zohoOneSo/:id')
async zohoOneSo(@Param('id') id: any){
  let data= await this.zohoSalesOrderService.InventorySalesOrderByID(id)
  return {statusCode:200,message:"Order Details from zoho mapped",data:data}
}

@Get('getAttachment/:salesOrderId')//po
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Attachment.pdf')
async getAttachment(@Param('salesOrderId') salesOrderId: any,@Response() res: any): Promise<Buffer>{
  var attachment=await this.zohoSalesOrderService.getAttachment(salesOrderId)
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

@Get('OrderSummary/:salesOrderId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf')
async OrderSummary(@Param('salesOrderId') salesOrderId: any,@Response() res: any): Promise<Buffer>{
  var OrderSummary=await this.zohoSalesOrderService.OrderSummary(salesOrderId)
  if(OrderSummary){
    OrderSummary.pipe(res)
    return res
  }
  else{
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'OrderSummary not found',
      message: "OrderSummary not found",
    }, HttpStatus.NOT_FOUND);
  }
}

@Get('salesOrderPackages/:packageIds')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Packages.pdf')
async salesOrderPackages(@Param('packageIds') packageIds: any,@Response() res: any): Promise<Buffer>{
  var salesOrderPackages=await this.zohoSalesOrderService.salesOrderPackages(packageIds)
  if(salesOrderPackages){
    salesOrderPackages.pipe(res)
    return res
  }
  else{
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'salesOrderPackages not found',
      message: "salesOrderPackages not found",
    }, HttpStatus.NOT_FOUND);
  }
}

@Get('salesOrderBill/:billId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Bill.pdf')
async salesOrderBill(@Param('billId') billId: any,@Response() res: any): Promise<Buffer>{
  var salesOrderBill=await this.zohoSalesOrderService.salesOrderBill(billId)
  if(salesOrderBill){
    salesOrderBill.pipe(res)
    return res
  }
  else{
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'salesOrderBill not found',
      message: "salesOrderBill not found",
    }, HttpStatus.NOT_FOUND);
  }
}

@Get('salesOrderInvoice/:invoiceId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Invoice.pdf')
async salesOrderInvoice(@Param('invoiceId') invoiceId: any,@Response() res: any): Promise<Buffer>{
  var salesOrderInvoice=await this.zohoSalesOrderService.salesOrderInvoice(invoiceId)
  if(salesOrderInvoice){
    salesOrderInvoice.pipe(res)
    return res
  }
  else{
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'salesOrderInvoice not found',
      message: "salesOrderInvoice not found",
    }, HttpStatus.NOT_FOUND);
  }
}

@Post('invoiceAllDetails')
async invoiceAllDetails(@Body('orderIds') orderIds:any,
@Query('purchaseOrder',new DefaultValuePipe(false)) purchaseOrder: boolean,
) { 
  if(orderIds.length>0){
    if(orderIds.length>10){
      throw new HttpException({
        status: HttpStatus.NOT_IMPLEMENTED,
        error: 'exceeds maximum number of orders No-'+String(orderIds.length),
        message: "please provide maximum number of 10 orders",
      }, HttpStatus.NOT_IMPLEMENTED);
    }
    let result = []
    const promises = orderIds.map(a => this.zohoSalesOrderService.invoiceAllDetails(a,purchaseOrder))
    const result1 = await Promise.all(promises)
     for(let i=0;i<result1.length;i++){
     result=result.concat(result1[i])
    }
    return {statusCode:200,message:"All sales order invoice details ",count:result.length,data:result}


//*for purchase data************
    //  for(let i=0;i<orderIds.length;i++){
    //   let details=await this.zohoSalesOrderService.invoiceAllDetails(orderIds[i],purchaseOrder)
    //       result = result.concat(details)
    // }
    // return {statusCode:200,message:"All sales order invoice details ",count:result.length,data:result}


  }
  else{
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'SalesOrderID not found',
      message: "id not found in Request please provide atleast one",
    }, HttpStatus.BAD_REQUEST);
  }
}
  
}