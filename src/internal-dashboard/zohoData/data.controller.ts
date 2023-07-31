import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { prodoRolesService } from '../prodoRoles/prodoRoles.service'
import { userRolesService } from '../prodoRoles/userRoles.service'
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { getMongoRepository, getRepository } from 'typeorm';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Product } from './../../product/product.entity';

//zoho services imports
import {internalSalesOrderService} from './services/salesOrder.service'
import {internalBillService} from './services/bill.service' 
import {internalInvoiceService} from './services/invoice.service'
import {internalPurchaseOrderService} from './services/purchaseOrder.service'
import {internalProductService} from './services/product.service'
import { batchItemService } from '../batchItems/batchItem.service'

import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/zohoData')
export class zohoDataController {
  constructor(  
  private readonly prodoRolesService:prodoRolesService, 
  private readonly zohoEmployeeService:zohoEmployeeService,
  private readonly userRolesService:userRolesService,
  private readonly internalSalesOrderService:internalSalesOrderService,
  private readonly internalBillService:internalBillService,
  private readonly internalInvoiceService:internalInvoiceService,
  private readonly internalPurchaseOrderService:internalPurchaseOrderService,
  private readonly internalProductService:internalProductService,
  private readonly batchItemService:batchItemService,



  ) { }
  
//********************************************* .Invoice Endpoints. ****************************************************************
  @Get('invoice')
  @UseGuards(IJwtAuthGuard)
  async findAllInvoice(@Request() req:any,
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
 let user = req.user
    
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
              { invoice_id: { $regex: search, $options: 'i' } },
              { invoice_number: { $regex: search, $options: 'i' } },
              { customer_name: { $regex: search, $options: 'i' } },
              { place_of_supply: { $regex: search, $options: 'i' } },
              { date: { $regex: search, $options: 'i' } },
              { total: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { gst_no: { $regex: search, $options: 'i' } },
              { salesperson_name: { $regex: search, $options: 'i' } },
              { submitted_by: { $regex: search, $options: 'i' } },
              { customer_id: { $regex: search, $options: 'i' } }, 
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
                { invoice_id: { $regex: search, $options: 'i' } },
                { invoice_number: { $regex: search, $options: 'i' } },
                { customer_name: { $regex: search, $options: 'i' } },
                { place_of_supply: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
                { total: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { gst_no: { $regex: search, $options: 'i' } },
                { salesperson_name: { $regex: search, $options: 'i' } },
                { submitted_by: { $regex: search, $options: 'i' } },
                { customer_id: { $regex: search, $options: 'i' } }, 
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
                { invoice_id: { $regex: search, $options: 'i' } },
                { invoice_number: { $regex: search, $options: 'i' } },
                { customer_name: { $regex: search, $options: 'i' } },
                { place_of_supply: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
                { total: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { gst_no: { $regex: search, $options: 'i' } },
                { salesperson_name: { $regex: search, $options: 'i' } },
                { submitted_by: { $regex: search, $options: 'i' } },
                { customer_id: { $regex: search, $options: 'i' } }, 
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
                { invoice_id: { $regex: search, $options: 'i' } },
                { invoice_number: { $regex: search, $options: 'i' } },
                { customer_name: { $regex: search, $options: 'i' } },
                { place_of_supply: { $regex: search, $options: 'i' } },
                { date: { $regex: search, $options: 'i' } },
                { total: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { gst_no: { $regex: search, $options: 'i' } },
                { salesperson_name: { $regex: search, $options: 'i' } },
                { submitted_by: { $regex: search, $options: 'i' } },
                { customer_id: { $regex: search, $options: 'i' } }, 
              ],
              $and: [
                ...attrFilter1
              ]   
            }
          }
        result = await this.internalInvoiceService.findAll(query1) 
        }
      else{
        result = await this.internalInvoiceService.findAll(query1)  
      }
    result.data = result.data.slice(start, end) 

    return {statusCode:200,message:"All Invoices",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
        result = await this.internalInvoiceService.findAll(query)  
    result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Invoices",count:result.count,limit:limit,page:page,data:result.data}
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

@Get('invoice/zohoAll')
async zohoAllInvoice(){
    let page=1
    let result=[]
    for(let page =1;page>0;page++){
      let data=await this.internalInvoiceService.zohoAll(page) 
      if(data.count){
        result= result.concat(data.data)
      }
      else{
        break;
      }
    }
    return {statusCode:200,message:"All invoices From zoho",count:result.length,data:result}

}

@Get('invoice/zohoOne/:id')
async zohoOneInvoice(@Param('id') id: any){
  let data= await this.internalInvoiceService.InventoryByID(id)
  return {statusCode:200,message:"Order Details from zoho mapped",data:data}
}

@Get('invoice/getAttachment/:invoiceId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Attachment.pdf')
async getAttachmentInvoice(@Param('invoiceId') invoiceId: any,@Response() res: any): Promise<Buffer>{
  // console.log("eeorr")
    throw new HttpException({
        status: HttpStatus.NOT_IMPLEMENTED,
        error: 'NOT_IMPLEMENTED',
        message: "NOT_IMPLEMENTED",
      }, HttpStatus.NOT_IMPLEMENTED);
  var attachment=await this.internalInvoiceService.getAttachment(invoiceId)
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

@Get('invoice/Summary/:invoiceId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Summary.pdf')
async SummaryInvoice(@Param('invoiceId') invoiceId: any,@Response() res: any): Promise<Buffer>{
  var Summary=await this.internalInvoiceService.Summary(invoiceId)
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


//################################*******************************#################***~****************************************************************

//********************************************* .Bill Endpoints. ****************************************************************

@UseGuards(IJwtAuthGuard)
  @Get('bills')
  async findAllBill(@Request() req:any,
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
 let user = req.user
   
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
        result = await this.internalBillService.findAll(query1) 
        }
      else{
        result = await this.internalBillService.findAll(query1)  
      }
    result.data = result.data.slice(start, end) 

    return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
        result = await this.internalBillService.findAll(query)  
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
  

  @Get('bills/zohoAll')
  async zohoAll(){
      let page=1
      let result=[]
      for(let page =1;page>0;page++){ 
        let data=await this.internalBillService.zohoAll(page) 
        if(data.count){
          result= result.concat(data.data)
        }
        else{
          break;
        }
      }
      return {statusCode:200,message:"All Orders From zoho",count:result.length,data:result}
  
  }
  
  @Get('bills/zohoOne/:id')
  async zohoOneBill(@Param('id') id: any){
    let data= await this.internalBillService.InventoryByID(id)
    return {statusCode:200,message:"Bill Details from zoho mapped",data:data}
  }
  
  @Get('bills/getAttachment/:billId')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=Attachment.pdf')
  async getAttachmentBill(@Param('billId') purchaseOrderId: any,@Response() res: any): Promise<Buffer>{
      throw new HttpException({
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'NOT_IMPLEMENTED',
          message: "NOT_IMPLEMENTED",
        }, HttpStatus.NOT_IMPLEMENTED);
    var attachment=await this.internalBillService.getAttachment(billId)
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
  
  @Get('bills/Summary/:billId')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=Summary.pdf')
  async SummaryBill(@Param('billId') billId: any,@Response() res: any): Promise<Buffer>{
    var Summary=await this.internalBillService.Summary(billId)
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

//################################*******************************#################***~****************************************************************



//********************************************* .Purchase Order Endpoints. ****************************************************************

@UseGuards(IJwtAuthGuard)
@Get('po') 
async findAllPo(@Request() req:any,
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
   
 let user = req.user
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
      result = await this.internalPurchaseOrderService.findAll(query1) 
      }
    else{
      result = await this.internalPurchaseOrderService.findAll(query1)  
    }
  result.data = result.data.slice(start, end) 

  return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
  }
  else {
    // return query
      result = await this.internalPurchaseOrderService.findAll(query)  
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

@Get('po/bySalesOrderNumber')
async bySalesOrderNumber(@Query('id', new DefaultValuePipe(''), ) id: string = ""){
   let result = await this.internalPurchaseOrderService.findAll({where: {reference_number: id}})
  return {statusCode:200,message:"All Purchase Orders by salesOrder Number",data:result.data}
}

async GetData(item:any,batchesItems:any){
  let obj = await batchesItems.filter(o => (o.sku == item.sku));
  if(obj.length){
  item.batchDetails = obj; 
  item.occupiedQuantity = 0
  for (let i of obj){
    item.occupiedQuantity=item.occupiedQuantity+i.quantity
  }
  item.leftQuantity=item.quantity-item.occupiedQuantity
  return item
  }
  else{
    item.batchDetails = []
    item.leftQuantity=item.quantity
    item.occupiedQuantity = 0
    return item
  }
}

@Get('po/poItemDetails')
async poItemDetails(@Query('id', new DefaultValuePipe(''), ) id: string = ""){
   let result = await this.internalPurchaseOrderService.findAll({where: {purchaseorder_id: id}})
   if(result.count){
    result=result.data[0]
    let batchesItems=await this.batchItemService.findAll({where: {purchaseOrderId: id}})
    batchesItems=batchesItems.data
    const promises = result.line_items.map(a => this.GetData(a,batchesItems))
    result.line_items = await Promise.all(promises)
   return {statusCode:200,message:"Purchase Orders Full details",data:result}
   }
   else{
    //throw not found exception
    throw new HttpException({ 
      status: HttpStatus.NOT_FOUND,
      error: 'EXPECTATION_FAILED',
      message: "Purchase Order not found",
    }, HttpStatus.NOT_FOUND)
   }
  
}

@Get('po/zohoAll')
async zohoAllPo(){
    let page=1
    let result=[]
    for(let page =1;page>0;page++){
      let data=await this.internalPurchaseOrderService.zohoAllPo(page) 
      if(data.count){
        result= result.concat(data.data)
      }
      else{
        break;
      }
    }
    return {statusCode:200,message:"All Orders From zoho",count:result.length,data:result}

}

@Get('po/zohoOne/:id')
async zohoOnePo(@Param('id') id: any){
  let data= await this.internalPurchaseOrderService.InventoryPorByID(id)
  return {statusCode:200,message:"Order Details from zoho mapped",data:data}
}

@Get('po/getAttachment/:purchaseOrderId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Attachment.pdf')
async getAttachmentPo(@Param('purchaseOrderId') purchaseOrderId: any,@Response() res: any): Promise<Buffer>{
    throw new HttpException({
        status: HttpStatus.NOT_IMPLEMENTED,
        error: 'NOT_IMPLEMENTED',
        message: "NOT_IMPLEMENTED",
      }, HttpStatus.NOT_IMPLEMENTED);
  var attachment=await this.internalPurchaseOrderService.getAttachment(purchaseOrderId)
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

@Get('po/Summary/:purchaseOrderId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf')
async POrderSummary(@Param('purchaseOrderId') purchaseOrderId: any,@Response() res: any): Promise<Buffer>{
  var OrderSummary=await this.internalPurchaseOrderService.OrderSummary(purchaseOrderId)
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
//################################*******************************#################***~****************************************************************


//********************************************* .Sales Order Endpoints. ****************************************************************

@UseGuards(IJwtAuthGuard)
  @Get('so')
  async findAllSo(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  @Query('byOrganization',new DefaultValuePipe('NA')) byOrganization:  string="NA",
  @Query('byCompany',new DefaultValuePipe('NA')) byCompany: string="NA",
  @Query('byEntity',new DefaultValuePipe('NA')) byEntity: string="NA",
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {

    // isEmployee
    limit = limit > 200 ? 200 : limit;
    // limit = limit > 500 ? 500 : limit;
    let start= (page - 1) * limit
    let end = page * limit
 let user = req.user
    
      // return user
    const attrFilter = []
    if(status!="NA"){
        attrFilter.push({
          "status": status
        })
      }
      if(byOrganization!="NA"){
          attrFilter.push({
            "organization_id": byOrganization
          })
      }
      if(byCompany!="NA"){
          attrFilter.push({
            "companyId":byCompany
          })
      }
      if(byEntity!="NA"){
          attrFilter.push({
            "entityId": byEntity
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
      result = await this.internalSalesOrderService.findAll(query1)  
        result.data = result.data.slice(start, end)
        return {statusCode:200,message:"All Orders",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
      result = await this.internalSalesOrderService.findAll(query)  
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

@UseGuards(IJwtAuthGuard)
@Get('so/:id')
async OneSo(@Param('id') id: any,@Request() req:any){
  let user = req.user
 
    if(user.roles)
      {
  if (user.roles.includes(UserRole.PRODO_ADMIN)){
    let data= await this.internalSalesOrderService.findOne(id)
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
    let data= await this.internalSalesOrderService.findOne(id)
    if(data){
      // if(user.orgIds.includes(data.organization_id)){
        return {statusCode:200,message:"Order Details ",data:data}
      // }
      // else{
      //   throw new HttpException({ 
      //     status: HttpStatus.BAD_REQUEST,
      //     error: 'You are not authorized to check this order Details',
      //     message: "You are not authorized to check this order Details",
      //   }, HttpStatus.BAD_REQUEST);
      // }
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

@Get('so/zohoAll') 
async zohoAllSo(){ 
  let page=1
  let result=[]
  for(let page =1;page>0;page++){
    let data=await this.internalSalesOrderService.zohoAllSo(page) 
    if(data.count){
      result= result.concat(data.data)
    }
    else{
      break;
    }
  }
  return {statusCode:200,message:"All Orders From zoho",count:result.length,data:result}

}

@Get('so/getAttachment/:salesOrderId')//po
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Attachment.pdf')
async getAttachmentSO(@Param('salesOrderId') salesOrderId: any,@Response() res: any): Promise<Buffer>{
  var attachment=await this.internalSalesOrderService.getAttachment(salesOrderId)
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

@Get('so/Summary/:salesOrderId')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf')
async SOrderSummary(@Param('salesOrderId') salesOrderId: any,@Response() res: any): Promise<Buffer>{
  var OrderSummary=await this.internalSalesOrderService.OrderSummary(salesOrderId)
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

@Get('so/Packages/:packageIds')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Packages.pdf')
async salesOrderPackages(@Param('packageIds') packageIds: any,@Response() res: any): Promise<Buffer>{
  var salesOrderPackages=await this.internalSalesOrderService.salesOrderPackages(packageIds)
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

//################################*******************************#################***~****************************************************************

//********************************************* .Product Endpoints. ****************************************************************
  

@Get('products')
  async allProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search', new DefaultValuePipe(''), ) search: string = "",
    // @Query('category', new DefaultValuePipe(''), ParseStringPipe) category: string = "",
  ): Promise<Pagination<Product>> {
    console.log('q',page)
    limit = limit > 100 ? 100 : limit;
    if(search){
      const query = {
        where: { 
          $or: [
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            {seo:{$regex:search,$options:'i'}},
            {sku:{$regex:search,$options:'i'}},
            {zohoBooksProductId:{$regex:search,$options:'i'}}
          ]
        },
        take: 10,
      }
      const query1 = {
        where: { 
          $or: [
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            {seo:{$regex:search,$options:'i'}},
            {sku:{$regex:search,$options:'i'}},
            {zohoBooksProductId:{$regex:search,$options:'i'}}
          ]
        }
      }
    let items= await getMongoRepository(Product).find(query);
    let total=await getMongoRepository(Product).find(query1);
      let result={
        items:items,
        meta: {
          "totalItems": total.length,
          "itemCount": 10,
          "itemsPerPage": 10,
          "totalPages": total.length%10?((total.length-total.length%10)/10)+1:(total.length/10?total.length/10:1),
          "currentPage": 1
      },
      links: {
        "first": "/products?limit=10",
        "previous": "",
        "next": "/products?page=2&limit=10",
        "last": "/products?page=137&limit=10"
        }
      }
      return result
    }
    else{
    return this.internalProductService.paginate({
      page,
      limit,
      route: '/products',
    });
    }
  }
  @Get('products/filteredAll')
  async allProductsFlitered(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('category', new DefaultValuePipe(''),) category: string = "",
    @Query('search', new DefaultValuePipe(''), ) search: string = "",
    @Query( 'f-price-min', new DefaultValuePipe(0), ParseIntPipe) fPriceMin: number = 0,
    @Query( 'f-price-max', new DefaultValuePipe(1000000), ParseIntPipe) fPriceMax: number = 100000,
    @Query( 'f-type', new DefaultValuePipe(''), ) fType: string = "",
    @Query( 'f-attr', new DefaultValuePipe(''), ) fAttr: string = "",
    @Query('orderPrice', new DefaultValuePipe(1), ) order: any = 1,
    @Query('zohoBooksProduct',new DefaultValuePipe(false),) zohoBooksProduct: true,
    // "readyPsroduct": "true",
    //         "madeToOrder": "true",
    //         "whiteLabeling": "true",
    @Query('readyProduct') readyProduct: boolean,
    @Query('madeToOrder') madeToOrder: boolean, 
    @Query('whiteLabeling') whiteLabeling: boolean,
  ) {
    console.log('category', category)
    console.log('search', search)
    console.log('order', order)
    console.log('fPriceMin', fPriceMin)
    console.log('fPriceMax', fPriceMax)
    console.log('fType', fType)
    console.log('fAttr', fAttr)
    console.log('readyProduct', Boolean(readyProduct))
    console.log('madeToOrder', madeToOrder)
    console.log('whiteLabeling', whiteLabeling)
    console.log('zohoBooksProduct', zohoBooksProduct)
    limit = limit > 100 ? 100 : limit;
    const attrFilter = []
    if (readyProduct) {
      attrFilter.push({
        "readyProduct": Boolean(readyProduct)
      })
    }
    if (madeToOrder) {
      attrFilter.push({
        "madeToOrder": Boolean(madeToOrder)
      })
    }
    if (whiteLabeling) {
      attrFilter.push({
        "whiteLabeling": Boolean(whiteLabeling)
      })
    }
    if(category) {
      attrFilter.push({
        "categoryId": category
      })
    }
       
      attrFilter.push({ zohoBooksProduct: { $eq: false } })
      attrFilter.push({ isVisible:{ $eq: true } }) 
// console.log('attrFilter', ...attrFilter)
    const query = {
        where: { 
          $or: [
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            {seo:{$regex:search,$options:'i'}}
             
            
          ],
          $and: [
            { price: { $gte: fPriceMin } },
            { price: { $lte: fPriceMax } },
            // { zohoBooksProduct: { $eq: false } },
            // { isVisible:{ $eq: true } }, 
            // { isVisible:true },
            // { attributes: { $regex: fAttr, $options: 'i' } },
            ...attrFilter
            
          ],
  
        },
        order: {
          price: order, 
        },
        skip: (page - 1) * limit,
        take: limit,
      }
      // console.log('query', query, query.where.$or)
    // return getMongoRepository(Product).find(query);
    return getMongoRepository(Product).findAndCount(query);

    
  }

  @Post('products/review')
  @UseGuards(IJwtAuthGuard)
  reviewProduct(@Body() data: any,@Request() req:any) {
    data.userId=req.user.id
    return this.internalProductService.productRating(data);
  }
  @Get('products/rating/:id')
  async getRatingProduct(@Param('id') zohoId: string) {
    return await this.internalProductService.getProductRating(zohoId);
  }
  @Get('products/review/:id')
  @UseGuards(IJwtAuthGuard)
  getReviewProduct(@Param('id') id: string,@Request() req:any) {
    return this.internalProductService.getUserReview(id,req.user.id);
  }
  @Get('products/BySku/:sku')
  async getProductBySku(@Param('sku') sku: string) {
    return await this.internalProductService.getProductBySku(sku);
  }

  @Get('products/Pimcore-All-Products')
  async pimAllProducts() {
    let pimAllProducts= await this.internalProductService.pimAllProducts()
    return pimAllProducts
    //for check imagaes url of prdoucts which not have aws link
  //   let out=[]
  //   for (let i = 0; i < pimAllProducts.length; i++) {
  //     if(pimAllProducts[i].data.images){
  //     if(pimAllProducts[i].data.images.startsWith('https://ibb.co')){
  //       out.push({id:pimAllProducts[i].data.id,link:pimAllProducts[i].data.images,rasta:pimAllProducts[i].data.parent}) 
  //     }
  //   }
  //   else{
  //     out.push({id:pimAllProducts[i].data.id,link:'No link',rasta:pimAllProducts[i].data.parent})
  //   }
  // }
  //   return out
  }

  @Get('products/ByCategory/:categoryId')
    productByCategory(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
      @Param('categoryId') categoryId: string
  ): Promise<Pagination<Product>> {
    // return this.productService.findByCategory(categoryId);
    limit = limit > 100 ? 100 : limit;
    return this.internalProductService.findByCategory({
      page,
      limit,
      route: `/products/category/${categoryId}`,
    },categoryId);
  }

}