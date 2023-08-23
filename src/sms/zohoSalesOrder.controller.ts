import { User } from './../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'superagent';
import { SmsService} from './sms.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './../users/user.service';
import { zohoToken } from './token.entity';
import { zohoSalesOrderService } from './zohoSalesOrder.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';
import { UserRole } from './../users/roles.constants';

import fetch from 'node-fetch'

var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';

// import { GraphQLClient } from "graphql-request";
import { compile, helpers } from 'handlebars';
import { Console } from 'console';
import console = require('console');
import { Stream } from 'stream';
import { HttpResponse } from 'aws-sdk';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
import {zohoSalesOrderByUser} from './zohoSalesOrderByUser.entity';
import { ProductService } from './../product/product.service';
import { use } from 'passport';
import { Order } from 'src/orders/order.entity';
// const client = new GraphQLClient('https://pim.prodo.in/pimcore-graphql-webservices/products', {
//   headers: { Authorization: `Bearer '8f7bb0951b624784d0b08ba94a56218a'` },
// });

@Controller('zohoSalesOrder')
export class zohoSalesOrderController {
  constructor(  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(zohoToken)
  private readonly zohoTokenRepository: Repository<zohoToken>,
  @InjectRepository(zohoSalesOrder)
  private readonly zohoSalesOrderRepository: Repository<zohoSalesOrder>,
  @InjectRepository(zohoSalesOrderByUser)
  private readonly zohoSalesOrderByUserRepository: Repository<zohoSalesOrderByUser>,
  private readonly SmsService: SmsService,
  private readonly userService: UserService,
  private readonly productService: ProductService,
  private readonly zohoSalesOrderService: zohoSalesOrderService

  ) { }


@Get('AddressBySo')
async AddressBySo(){
  //
  let allSo= await this.zohoSalesOrderService.findall()
  let out=[]
  for(let so of allSo){ 
       if(!so.orderDetails.details.shipping_address.zip){
        // out.push({soRef:so.orderDetails.salesorder_number})
        out.push(so.orderDetails.salesorder_number) 
       }
  }
  return out
}

@Post('sales-order-update')
async updateSalesOrder(@Body() body) { 
  // console.log(body)
  // body=JSON.parse(body.JSONString)
  // return body
  let id = body.salesorder?(body.salesorder.salesorder_id?body.salesorder.salesorder_id:"false"):"false" 
  if(id){
    // return id
    // let currentTime = new Date();     
    // let currentTime1 = currentTime.toLocaleTimeString();
    // console.log("In",currentTime1)
  return await this.update_order(id)
  }
  else{
  return "false"
  }
}
@Post('sync-dashboard')
async updatePocDashboard(@Body() body) { 
  // console.log(body)
  // body=JSON.parse(body.JSONString)
  // return body
  let id = body.salesorder?(body.salesorder.salesorder_id?body.salesorder.salesorder_id:"false"):"false" 
  if(id){
     if(body.type=="new"){
      let mails=[]
        let so=await this.InventorySalesOrderByID(id) 
        // return so
        if(body.poc1?body.poc1:""){
          mails.push(await this.sync_data(body.poc1,so))
      }
          if(body.poc2?body.poc2:""){
          mails.push(await this.sync_data(body.poc2,so))
            
      }
          if(body.poc3?body.poc3:""){
          mails.push(await this.sync_data(body.poc3,so))
            
      }
          if(body.poc4?body.poc4:""){
          mails.push(await this.sync_data(body.poc4,so))
          
            
      }
      return mails
        
     }
     else{
      let mails=[]
      console.log("else")
      let so=await this.InventorySalesOrderByID(id)
      // return so
      if(body.poc1?body.poc1:""){
        mails.push(await this.sync_data(body.poc1,so))
    }
        if(body.poc2?body.poc2:""){
        mails.push(await this.sync_data(body.poc2,so))
          
    }
        if(body.poc3?body.poc3:""){
        mails.push(await this.sync_data(body.poc3,so))
          
    }
        if(body.poc4?body.poc4:""){
        mails.push(await this.sync_data(body.poc4,so))
          
    }
    return mails
     }
  }
  else{
  return "false"
  }
}
async saveOrder(id,sales){
    let token=await this.newTokenForReorder()
    let kill
      let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }  
    })
    .then(res=>res.json()) 
    .then(data=>
        kill=data
    );
    let orders=[]
    console.log("kill",kill)
    let salesOrder=kill.salesorders
    if(salesOrder==undefined){
      console.log("No Data saved in prodo")
      return ["no data saved in prodo"]
    }
    if(!(salesOrder.length>0)){
      return "NO_DATA saved in prodo"
    }
    for(let i=0;i<salesOrder.length;i++)
    {
      if(salesOrder[i].salesorder_id==id){
     
      salesOrder[i].details=sales
      let data={
        orderDetails:salesOrder[i],
        zohoId:id
      }
      console.log("data",data)
      let k = await this.zohoSalesOrderRepository.findOne({ zohoId: data.zohoId });
      if(k){
      console.log("find data")

        let id=data.zohoId
        await this.zohoSalesOrderRepository.update(k.id,data)
        data.status="update"
        await this.updatePocOnSalesOrder(id,data.orderDetails)

        orders.push(data)
      } 
      else{
      console.log("new data")
      let m=await this.zohoSalesOrderRepository.save(data)
      let id1=data.zohoId
      orders.push(m)
      await this.updatePocOnSalesOrder(id1,data.orderDetails)

      // orders.push(data)
      }
      // let currentTime2 = new Date();     
      // let currentTime3 = currentTime2.toLocaleTimeString();
      // console.log("after save",currentTime3)
      // let currentTime6 = new Date();     
      // let currentTime7 = currentTime6.toLocaleTimeString();
      // console.log("after full save",currentTime7)
      return orders
      } 
    }
  
  }

  
async updatePocOnSalesOrder(id,salesOrder){
    console.log("id in poc")
    // return id
    // let currentTime6 = new Date();     
    //   let currentTime7 = currentTime6.toLocaleTimeString();
    //   console.log("in poc sync",currentTime7)
    let res =[]
     let cf_1_email=salesOrder.cf_client_poc_1_email?(salesOrder.cf_client_poc_1_email==""?"NA":salesOrder.cf_client_poc_1_email):"NA"
      let cf_2_email=salesOrder.cf_client_poc_2_email?(salesOrder.cf_client_poc_2_email==""?"NA":salesOrder.cf_client_poc_2_email):"NA"
      let cf_3_email=salesOrder.cf_client_poc_3_email?(salesOrder.cf_client_poc_3_email==""?"NA":salesOrder.cf_client_poc_3_email):"NA"
      let cf_4_email=salesOrder.cf_client_poc_4_email?(salesOrder.cf_client_poc_4_email==""?"NA":salesOrder.cf_client_poc_4_email):"NA"
      if(cf_1_email!="NA"){
        let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_1_email})
        if(userdata){
          console.log("poc1")
          if(userdata.orderIds.includes(id)){
            userdata.orderIds = [...new Set(userdata.orderIds)];
            res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
          }
          else{
          userdata.orderIds.push(id)
          await this.sync_data(cf_1_email,salesOrder)
          }

        }
        else{
          let kill={
            email:cf_1_email,
            orderIds:[id]
          }
          // return kill
          res.push(await this.zohoSalesOrderByUserRepository.save(kill))
        await this.sync_data(cf_1_email,salesOrder)

        }
      }
      if(cf_2_email!="NA"){
        let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_2_email})
        if(userdata){
          console.log("poc2")
          if(userdata.orderIds.includes(id)){
            userdata.orderIds = [...new Set(userdata.orderIds)];
            res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
          }
          else{
          userdata.orderIds.push(id)
          await this.sync_data(cf_2_email,salesOrder)
          }

        }
        else{
          let kill={
            email:cf_2_email,
            orderIds:[id]
          }
          // return kill
  
          res.push(await this.zohoSalesOrderByUserRepository.save(kill))
        await this.sync_data(cf_2_email,salesOrder)

        }
      }
      if(cf_3_email!="NA"){
        let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_3_email})
        if(userdata){
          console.log("poc3")
          if(userdata.orderIds.includes(id)){
            userdata.orderIds = [...new Set(userdata.orderIds)];
            res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
          }
          else{
          userdata.orderIds.push(id)
          await this.sync_data(cf_3_email,salesOrder)
          }

        }
        else{
          let kill={
            email:cf_3_email,
            orderIds:[id]
          }
          // return kill
          res.push(await this.zohoSalesOrderByUserRepository.save(kill))
        await this.sync_data(cf_3_email,salesOrder)

        }
      }
      if(cf_4_email!="NA"){

        let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_4_email})
        if(userdata){
          // let yup=JSON.parse(userdata)
          console.log("poc4",userdata.orderIds.includes(id),userdata.orderIds,id)
          userdata.orderIds=await userdata.orderIds.toString().split(",");
          console.log("poc4-2",userdata.orderIds.includes(String(id)),userdata.orderIds)
          if(userdata.orderIds.includes(String(id))){
            // userdata.orderIds = [...new Set(userdata.orderIds)];
            // res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
          }
          else{
          userdata.orderIds.push(id)
          console.log("in else")
          // await this.sync_data(cf_4_email,salesOrder)
          }

        }
        else{
          let kill={
            email:cf_4_email,
            orderIds:[id]
          }
          // return kill
          res.push(await this.zohoSalesOrderByUserRepository.save(kill))
        await this.sync_data(cf_4_email,salesOrder)

        }
        
      }
      return res
  }

async sync_data(email,salesOrder){
  // let currentTime6 = new Date();     
  //     let currentTime7 = currentTime6.toLocaleTimeString();
      console.log("in sync data email",email)
    let user=await this.userService.findByEmail(email)
    // console.log(user)
    if(user){
        // return user
        return await this.sync_dashboard(user,salesOrder)
    }
    else
     return false
}
async update_order(id){
    let so=await this.InventorySalesOrderByID(id)
    // console.log("so",so)
    // return so
    // let currentTime = new Date();     
    // let currentTime1 = currentTime.toLocaleTimeString();
    // console.log("after update",currentTime1) 
    return await this.saveOrder(id,so)
}

async sync_dashboard(user,salesOrder) {
  // let currentTime6 = new Date();     
  // let currentTime7 = currentTime6.toLocaleTimeString();
  // console.log("in sync dashboard data",currentTime7)
    let req={
        user:user
      }
    let k = await this.userService.userdashboardData(req.user)
  // console.log("User dashboard data",k)

    if(k=="NA"){
      //  let orders=await this.zohoInventorySalesOrder(req)
       let orders=[salesOrder]
    //    console.log("orders",orders)
       let res=await this.userService.calDashboardData(req.user,orders)
       console.log("res dashboard data",res)
       return res
    }
    else{
        // let orders=await this.zohoInventorySalesOrder(req)
        //    console.log("orders",orders)
       let orders=[salesOrder]

           let res=await this.userService.calDashboardData(req.user,orders)
           console.log("res dashboard data",res)
           return res
        // console.log(k)
    }
//     let out=[]
//         let req={
//           user:user
//         }
//       let orders=await this.zohoInventorySalesOrder(req)
//     //   console.log(orders)
//       out.push(await this.userService.calDashboardData1(req.user,orders))
//       return out
  }

async zohoInventorySalesOrder(@Request() req){
  // let currentTime6 = new Date();     
  // let currentTime7 = currentTime6.toLocaleTimeString();
  // console.log("in sales order all ",currentTime7)
    // let userEmail="kamran.khan@niyotail.com"
    // console.log("req",req)
    if(req.user.roles.includes('PRODO_ADMIN')){
      let p= await this.zohoSalesOrderRepository.find()
      //loop on p and make array of p.orderDetails
      let orders=[]
      for(let i=0;i<p.length;i++){
        let order=p[i]
        let orderDetails=order.orderDetails
        orders.push(orderDetails)
      }
      return orders
    }
    let user=await this.userRepository.findOne(req.user.id)
    let userEmail=user.email
    let salesOrder_list1=await this.zohoSalesOrderByUserRepository.find({email:userEmail})
    if(salesOrder_list1[0]){
      const attrFilter = []
      let salesOrder_list= salesOrder_list1[0].orderIds
        for(let j=0;j<salesOrder_list.length;j++){
          attrFilter.push({_id:salesOrder_list[j]})
        }
      const query = {
        where: {
          $or: [
            ...attrFilter
          ]
        }
      }
      // console.log('query', query)
    let ui = await getMongoRepository(zohoSalesOrder).find(query);
    let orders=[]
      for(let i=0;i<ui.length;i++){
        let order=ui[i]
        let orderDetails=order.orderDetails
        orders.push(orderDetails)
      }
      return orders
    }
    else{
      return []
    }
  
  }
async newTokenForReorder(){
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({

      })
  });
  zoho=await zoho.text()
  zoho=JSON.parse(zoho)
  let token="Zoho-oauthtoken "
  token=token+zoho.access_token
  return token
  }


async zohoBookTokenFarji(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
  let token=zohoToken.token
  // console.log("oldtoken",token)
  let kill
  let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json()) 
  .then(data=>
      kill=data
  );
  // console.log("kill",kill)
  if(kill.message=='You are not authorized to perform this operation'||kill.code==57||kill.code==6041){
    // console.log("NEW_TOKEN")
  token=await this.newZohoBookTokenFarji()
  return token
  }
  return token
  }
  
  async newZohoBookTokenFarji(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
    // console.log("zohoToken",zohoToken)
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
     
      })
  });
  zoho=await zoho.text()
  zoho=JSON.parse(zoho)
  let token="Zoho-oauthtoken "
  token=token+zoho.access_token
  zohoToken.token=token
  let kill=await this.zohoTokenRepository.save(zohoToken)
  // console.log("kill",kill)
  return token
  }
  
  async InventorySalesOrderByID(id){
      // let token=await this.zohoBookToken()
      let token=await this.zohoBookTokenFarji()
    
      let kill
    
      // let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
      // let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015968384`, {
      let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
    
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
      // console.log('kill', kill)
      if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
        token=await this.zohoBookTokenFarji()
        // let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015968384`, {
        let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
    
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`,
          }
        })
        .then(res=>res.json())
        .then(data=>
            kill=data
        );
        let salesOrder1=kill.salesorder
        // console.log("salesOrder",salesOrder)
        // console.log("with error",kill.salesorder)
        if(salesOrder1==undefined){
          console("No Data-in error",kill)
          return []
        }
        let lineItems=salesOrder1.line_items
        let k1=salesOrder1.packages
        let packages1={}
        for(let ii=0;ii<lineItems.length;ii++){
          lineItems[ii].package_id=[]
        }
        lineItems=await this.itemStatus(lineItems,salesOrder1)
        if(k1.length>0){
        for(let j=0;j<k1.length;j++){
        let data=await this.packageDetails(k1[j].package_id)
        packages1[k1[j].package_id]=data
          for(let k=0;k<lineItems.length;k++){
            let p_id =await this.itemDetails(lineItems[k],data)
            if(p_id=="NA"){
            }
            else{
              lineItems[k].package_id.push(p_id)
            }
          }
        }
        salesOrder1.package_list=packages1
        console.log("items in  error")
    
        lineItems=await this.setItemPrice(lineItems,salesOrder1.date)
        lineItems=await this.calShipment(lineItems,packages)
        salesOrder1.line_items=lineItems
        return salesOrder1
        }
        else{
        // console.log("items",lineItems)
        console.log("items in  error")
    
          lineItems=await this.setItemPrice(lineItems,salesOrder1.date)
          lineItems=await this.calShipment(lineItems,packages)
          salesOrder1.line_items=lineItems
          salesOrder.package_list=packages
          return salesOrder
        }
      }
      
      // console.log("without error",kill.salesorder)
      // console.log("items in  no error")
    
      let salesOrder=kill.salesorder
      if(salesOrder==undefined){
        console.log("No Data-without",kill,id)
        return []
      }
        let lineItems2=salesOrder.line_items
        let k=salesOrder.packages
        let packages={}
        for(let ii=0;ii<lineItems2.length;ii++){
          lineItems2[ii].package_id=[]
        }
        lineItems2=await this.itemStatus(lineItems2,salesOrder)
        if(k.length>0){
        for(let j=0;j<k.length;j++){
        let data1=await this.packageDetails(k[j].package_id)
        packages[k[j].package_id]=data1
          for(let k=0;k<lineItems2.length;k++){
            let p_id =await this.itemDetails(lineItems2[k],data1)
            if(p_id=="NA"){
            }
            else{
              lineItems2[k].package_id.push(p_id)
            }
          }
        }
        salesOrder.package_list=packages
        // console.log("items",lineItems2)
        lineItems2=await this.setItemPrice(lineItems2,salesOrder.date)
        lineItems2=await this.calShipment(lineItems2,packages)
        salesOrder.line_items=lineItems2
        return salesOrder
        }
        else{
        // console.log("items",lineItems2)
        lineItems2=await this.setItemPrice(lineItems2,salesOrder.date)
        lineItems2=await this.calShipment(lineItems2,packages)
          salesOrder.line_items=lineItems2
          salesOrder.package_list=packages
          return salesOrder
        }
    }
    
    async setItemPrice(lineItems,date){
      // console.log("lineItems",lineItems)
      for(let i=0;i<lineItems.length;i++){
        let sku=lineItems[i].sku
        if (sku.startsWith('.')) {
          sku = sku.substring(1)
        }
        let item=await this.productService.getProductBySku(sku)
        if(item){
          let item_date=item.date
        
          let item_date_arr=item_date.split("-")
          let item_date_year=item_date_arr[0]
          let item_date_month=item_date_arr[1]
          let item_date_day=item_date_arr[2]
          let item_date_date=new Date(item_date_year,item_date_month,item_date_day)
          let date_arr=date.split("-")
          let date_year=date_arr[0]
          let date_month=date_arr[1]
          let date_day=date_arr[2] 
          let date_date=new Date(date_year,date_month,date_day)
          // console.log("item_date_date",item_date_date)
          // console.log("date_date",date_date)
          if(item_date_date>date_date){
            lineItems[i].prodo_price=item.price
            lineItems[i].prodo_images=item.productImages
          }
          else{
            item.price=await this.productService.currentPriceUpdate(item,date,lineItems[i].rate)
            lineItems[i].prodo_pricee=item.price
            lineItems[i].prodo_images=item.productImages
          }
        }
        else{
          // console.log("No Data-in item",sku)
          lineItems[i].prodo_pricee=lineItems[i].rate
          lineItems[i].prodo_images=[]
        } 
      }
      // console.log("lineItems-2",lineItems)
      return lineItems
    }
    async itemDetails(lineItem,data){
      let itemDetails = "NA"
      let item_id=lineItem.item_id
      let line_items=data.line_items 
      for(let i=0;i<line_items.length;i++){
        if(line_items[i].item_id==item_id){
          itemDetails=data.package_id
        }
      }
      return itemDetails
    }
    
    async calShipment(lineItems,packages){ 
      // console.log("lineItems",lineItems)
      for(let i=0;i<lineItems.length;i++){
        if(lineItems[i].package_id.length>0){
          lineItems[i].shipment_status=[{status:"In Production",date:new Date(),quantity:lineItems[i].quantity,package_id:""}]
          for(let j=0;j<lineItems[i].package_id.length;j++){
            let package_id1=lineItems[i].package_id[j]
            let pkg=packages[package_id1]
            for(let k=0;k<pkg.line_items.length;k++){
              if(pkg.line_items[k].item_id==lineItems[i].item_id){
                if(pkg.status=="delivered"){
                  lineItems[i].shipment_status.push({status:"Delivered",date:pkg.shipment_delivered_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
                else if(pkg.status=="not_shipped"){
                  lineItems[i].shipment_status.push({status:"In Production",date:pkg.date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
                else if(pkg.status=="shipped"){
                  lineItems[i].shipment_status.push({status:"Shipped",date:pkg.shipping_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
                else {
                  lineItems[i].shipment_status.push({status:"Quality Check",date:pkg.shipping_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
              }
            }
          } 
        }
        else{
          lineItems[i].shipment_status=[{status:"In Production",date:new Date(),quantity:lineItems[i].quantity,package_id:""}]
        }
      }
      return lineItems
    }
    
    async itemStatus(lineItems,salesOrder){
      if(salesOrder.status=="draft"){
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Order Received"
        }
      }
    else if(salesOrder.status=="partially_shipped"){
      if(salesOrder.current_sub_status=="closed"){
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Delivered"
        }
      }
      else{
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status= await this.calculateStatus(lineItems[i])
        }
      }
    }
    else if(salesOrder.status=="fulfilled"){
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].status="Delivered"
      }
    }
    else if(salesOrder.status=="confirmed"){
      if(salesOrder.current_sub_status=="closed"){
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Delivered"
        }
      }
      else{
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Order Accepted"
        }
      }
    }
    else if(salesOrder.status=="shipped"){
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].status="In Transit"
      }
    }
    else{
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].status="NA"
      }
    }
    return lineItems
    }
    
    async calculateStatus(lineItem){
      let invoiced=lineItem.quantity_invoiced
      let shipped=lineItem.quantity_shipped
      let packed=lineItem.quantity_packed
      let backordered=lineItem.quantity_backordered
      let dropshipped=lineItem.quantity_dropshipped
      let cancelled=lineItem.quantity_cancelled
      let quantity=lineItem.quantity
      if(packed==quantity){
        if(shipped==quantity){
          if(invoiced==quantity){
            return "Delivered"
          }
          else{
            return "In Transit[Fully Shipped]"
          }
        }
        return " In Transit[Fully packed]"
      }
      else if(packed>0){
        if(shipped<packed){
          if(shipped>0){
            return "In Transit[Partially Shipped]"
          }
          else{
            return "In Transit[Partially Packed]"
          }
        }
        return "In Transit[Partially Packed]"
      }
      else{
        return "Quality Check"
      }
    
    }
    
    async packageDetails(id){
      // let token=await this.zohoBookToken()
      let token=await this.zohoBookTokenFarji()
      let kill
      // let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015968384`, {
      let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
    
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
      if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
        token=await this.newZohoBookTokenFarji()
        // let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015968384`, {
        let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
    
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`,
          }
        })
        .then(res=>res.json())
        .then(data=>
            kill=data
        );
        // console.log("kill-not",kill)
        return kill.package
      }
      // console.log("kill-shi",kill)
    
      return kill.package
    
    }
  
}