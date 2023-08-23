import { User } from './../users/user.entity';
// import { Body, Controller, Get, Post,UseGuards,Request } from '@nestjs/common';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';  
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'superagent';
import { SmsService} from './sms.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './../users/user.service';
import { zohoToken } from './token.entity';
import { accessSync, createReadStream } from 'fs';
import { join } from 'path';
import { In } from 'typeorm';
import { getMongoRepository, getRepository } from 'typeorm';
import { UserRole } from './../users/roles.constants';
// import { createReadStresam } from 'fs';
// import { Blob } from '@ionic-native/file/ngx';
// var schedule = require('node-schedule');
import fetch from 'node-fetch'
// const http = require("https");
// import fetch from 'node-fetch'
// import { ProductList } from './product-interface';
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
// const client = new GraphQLClient('https://pim.prodo.in/pimcore-graphql-webservices/products', {
//   headers: { Authorization: `Bearer '8f7bb0951b624784d0b08ba94a56218a'` },
// });

@Controller('sms')
export class SmsController {
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
  private readonly productService: ProductService
  ) { }

  @Post("sendOtp")
  async sendOtp(@Body() body) {
    // console.log('body',body)
    const foundUser = await this.userRepository.findOne({ contactNumber: body.mobileNo });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
    }
    let SMS = {
      authkey:'366411AamHKyDckoqf6129d4c4P1',
      template_id:'62c2c993686eff1b09630536',
      mobile:'91'
    };
    SMS.mobile=SMS.mobile+body.mobileNo
    let SmsOptions = {
  
      path:`https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
    };
    // console.log('body',SmsOptions.path)
    let res = await fetch(SmsOptions.path)
    res=await res.text()
    res=JSON.parse(res)
    // console.log('res',res)
    if(res.type==="error"){
      throw new HttpException({
        status: 400,
        error: "Bad Request",
        message: res.message
      }, HttpStatus.FORBIDDEN);
    }
    else{
      // console.log("number-",SMS)
      this.SmsService.saveData(SMS)
      throw new HttpException({
        status: 200,
        type: 'success'
        message: "OTP sent successfully"
        request_id: '32676568326c323434363631' 
      }, HttpStatus.OK);
    }
  }

  @Post("verifyOtp")
  // @UseGuards(JwtAuthGuard)
  async verifyOtp(@Body() body) {
    // console.log('body',body)
    let SMS = {
      authkey:'366411AamHKyDckoqf6129d4c4P1',
      otp:'',
      mobile:'91'
    };
    SMS.mobile=SMS.mobile+body.mobileNo
    SMS.otp=body.otp
    let SmsOptions = {
      path:`https://api.msg91.com/api/v5/otp/verify?otp=${SMS.otp}&authkey=${SMS.authkey}&mobile=${SMS.mobile}`,
    };
    console.log('sms',SmsOptions)
    let res = await fetch(SmsOptions.path)
    res=await res.text()
    res=JSON.parse(res)
    res.status=res.status
    if(res.type==="error"){
      if(res.message=="Mobile no. not found"){
        throw new HttpException({
          status: 404,
          error: res.error,
          message: "Mobile Number is not valid"
        }, HttpStatus.FORBIDDEN);
      }
      throw new HttpException({
        status: 404,
        error: res.error,
        message: res.message
      }, HttpStatus.FORBIDDEN);
    }
    else{
      throw new HttpException({
        status: 200,
        error: res.error,
        message: res.message
      }, HttpStatus.OK);
    }
  }

  @Post("resendOtp")
  async resendOtp(@Body() body) {
    // console.log('body',body)
    let SMS = {
      authkey:'366411AamHKyDckoqf6129d4c4P1',
      template_id:'62c2c993686eff1b09630536',
      mobile:'91',
    };
    SMS.mobile=SMS.mobile+body.mobileNo
    let SmsOptions = {
      path:`https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
    };
    // console.log('body',SmsOptions)
    let res = await fetch(SmsOptions.path)
    res=await res.text()
    res=JSON.parse(res)
    // console.log('res',res)
    if(res.type==="error"){
      throw new HttpException({
        status: 400,
        error: "Bad Request",
        message: res.message
      }, HttpStatus.FORBIDDEN);
    }
    else{
      throw new HttpException({
        status: 200,
        type: 'success'
        message: "OTP sent successfully"
        request_id: '32676568326c323434363631' 
      }, HttpStatus.OK);
    }
  }


  @Post("sendSms")
  async sendSms(@Body() body) {
    // console.log("hello")
    let SMS = {
      flow_id:"62c2c6b528e92365c24410b5",
      sender:"mPRODO",
      short_url: "1 (On) or 0 (Off)",
      mobile:"+91",
      name:""
      authkey:"366411AamHKyDckoqf6129d4c4P1"
    };
    SMS.mobile=SMS.mobile+body.mobileNo
    SMS.name=SMS.name+body.name

    const SmsOptions = {
      "method": "POST",
      "hostname": "api.msg91.com",
      "port": null,
      "path": "/api/v5/flow/",
      "headers": {
        "authkey": "366411AamHKyDckoqf6129d4c4P1",
        "content-type": "application/JSON"
      }
    };
    let data
    const rep = await http.request(SmsOptions, function (res) {
      const chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        // console.log(body.toString());
        data= body.toString();
        data=JSON.parse(data)
        // console.log(data) 

      });
    });
    rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
    // rep.write(`${super1}`)
     data = {
      type: 'success'
      message: "Message sent successfully" 
    };
    // console.log(data) 
    rep.end();
    return data
  }


  @Post("send-bulk-Sms")
  @UseGuards(JwtAuthGuard)
  async sendBulkSms(@Request() req) {
    // console.log(req.user)
    let SMS = {
      flow_id:"62c2c6b528e92365c24410b5",
      sender:"mPRODO",
      short_url: "1 (On) or 0 (Off)",
      recipients:[],
      authkey:"366411AamHKyDckoqf6129d4c4P1"
    };
    SMS.recipients.push({mobile:req.body.mobileNo,name:req.body.name})
    const SmsOptions = {
      "method": "POST",
      "hostname": "api.msg91.com",
      "port": null,
      "path": "/api/v5/flow/",
      "headers": {
        "authkey": "366411AamHKyDckoqf6129d4c4P1",
        "content-type": "application/JSON"
      }
    };
    let data
    const rep = await http.request(SmsOptions, function (res) {
      const chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        // console.log(body.toString());
        data= body.toString();
        data=JSON.parse(data)
        // console.log(data) 

      });
    });
    rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
    // rep.write(`${super1}`)
     data = {
      type: 'success'
      message: "Message sent successfully" 
    };
    // console.log(data) 
    rep.end();
    return data
  }

  @Get('/test')
  async test() {
    const res = await get('https://api.ipify.org/?format=json');
    return res.body.ip;
  }



  // @Post("mapProduct")
  
  @Post("mapProduct")
  async productMapByAPI(@Body() body){
    // console.log(body)
    let zohoKeys=body.zohoKeys
    let pimcoreKeys=body.pimcoreKeys
    let item=body.item
    console.log(pimcoreKeys)
    console.log(zohoKeys)
    console.log(item)
 
    let productMap={}
    for(let i=0,j=0;i<zohoKeys.length;i++){
       if(zohoKeys[i]=="D"){
        productMap[zohoKeys[i]]=item.k.g
       }
       else{
         console.log(pimcoreKeys[j])
        if(Object.keys(item).includes(pimcoreKeys[j])){
          productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
          else {
            console.log("hello")
            productMap[zohoKeys[i]]=""
          }
          j++
       }
    }
    return productMap
  }

  @Post("user-sendOtp")
  @UseGuards(JwtAuthGuard)
  async userSendOtp(@Request() req) {
    // console.log("user",req.user,req.body)
    if(!req.body.mobileNumber){
      throw new HttpException({
        status: 404,
        error: "Mobile number is required",
        message: "Mobile number is required"
      }, HttpStatus.FORBIDDEN);
    }
    let user = await this.userRepository.findOne(req.user.id);
    if (!user) {
      throw new HttpException({
        status: 404,
        error: "User not found",
        message: "User not found"
      }, HttpStatus.FORBIDDEN);
    }
    const foundUser = await this.userRepository.findOne({ contactNumber: req.body.mobileNumber });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists on this number"
      }, HttpStatus.FORBIDDEN);
    }
    user.contactNumber=req.body.mobileNumber
   
    // console.log("user",user)
    if(user.isVerified)
    {
      return {
        type: 'error',
        message: "User already verified" 
      }
    }
    else{
      let SMS = {
        authkey:'366411AamHKyDckoqf6129d4c4P1',
        template_id:'62c2c993686eff1b09630536',
        mobile:'91'
      };
      SMS.mobile=SMS.mobile+user.contactNumber
      let SmsOptions = {
    
        path:`https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
      };
      // console.log('body',SmsOptions.path)
      let res = await fetch(SmsOptions.path)
      res=await res.text()
      res=JSON.parse(res)
      // console.log('res',res)
      if(res.type==="error"){
        throw new HttpException({
          status: 400,
          error: "Bad Request",
          message: res.message
        }, HttpStatus.FORBIDDEN);
      }
      else{
        // console.log("number-",SMS)
        this.SmsService.saveData(SMS)
        // let k = await this.userRepository.save(user);
        // console.log("no-update",user)
        throw new HttpException({
          status: 200,
          type: 'success'
          message: "OTP sent successfully"
          request_id: '32676568326c323434363631' 
        }, HttpStatus.OK);
      }

    }
  }
  @Post("user-verifyOtp")
  @UseGuards(JwtAuthGuard)
  async userVerifyOtp(@Request() req) {
    // console.log("body",req.body.otp)
    if (!req.body.otp) {
      throw new HttpException({
        status: 404,
        error: "OTP is required",
        message: "OTP is required"
      }, HttpStatus.FORBIDDEN);
    }
    if(!req.body.mobileNumber){
      throw new HttpException({
        status: 404,
        error: "Mobile number is required",
        message: "Mobile number is required"
      }, HttpStatus.FORBIDDEN);
    }
    let user = await this.userRepository.findOne(req.user.id);
    if (!user) {
      throw new HttpException({
        status: 404,
        error: "User not found",
        message: "User not found"
      }, HttpStatus.FORBIDDEN);
    }
    let SMS = {
      authkey:'366411AamHKyDckoqf6129d4c4P1',
      otp:'',
      mobile:'91'
    };
    user.contactNumber=req.body.mobileNumber
    SMS.mobile=SMS.mobile+user.contactNumber
    SMS.otp=req.body.otp
    let SmsOptions = {
      path:`https://api.msg91.com/api/v5/otp/verify?otp=${SMS.otp}&authkey=${SMS.authkey}&mobile=${SMS.mobile}`,
    };
    // console.log('sms',SmsOptions)
    let res = await fetch(SmsOptions.path)
    res=await res.text()
    res=JSON.parse(res)
    res.status=res.status
    if(res.type==="error"){
      if(res.message=="Mobile no. not found"){
        throw new HttpException({
          status: 404,
          error: res.error,
          message: "Mobile Number is not valid"
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({
        status: 404,
        error: res.error,
        message: res.message
      }, HttpStatus.FORBIDDEN);
    }
    else{
      user.isVerified=true
      let SMS = {
        flow_id:"62c2c6b528e92365c24410b5",
        sender:"mPRODO",
        short_url: "1 (On) or 0 (Off)",
        mobile:"+91",
        name:""
        authkey:"366411AamHKyDckoqf6129d4c4P1"
      };
      SMS.mobile=SMS.mobile+user.contactNumber
      SMS.name=SMS.name+user.firstName
        let k = await this.userRepository.save(user);
        console.log("user -V",user)
     
      const SmsOptions = {
        "method": "POST",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "/api/v5/flow/",
        "headers": {
          "authkey": "366411AamHKyDckoqf6129d4c4P1",
          "content-type": "application/JSON"
        }
      };
      let data
      const rep = await http.request(SmsOptions, function (res) {
        const chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          const body = Buffer.concat(chunks);
          // console.log(body.toString());
          data= body.toString();
          data=JSON.parse(data)
          // console.log(data) 
  
        });
      });
      rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
      // rep.write(`${super1}`)
       data = {
        type: 'success',
        message: "Message sent successfully" 
      };
      // console.log(data) 
      rep.end();
      throw new HttpException({
        status: 200,
        error: res.error
        message: res.message
      }, HttpStatus.OK);
    }
  }
  @Post("user-resendOtp")
  @UseGuards(JwtAuthGuard)
  async userResendOtp(@Request() req) {
    // console.log("user",req.user,req.body)
    if(!req.body.mobileNumber){
      throw new HttpException({
        status: 404,
        error: "Mobile number is required",
        message: "Mobile number is required"
      }, HttpStatus.FORBIDDEN);
    }
    let user = await this.userRepository.findOne(req.user.id);
    if (!user) {
      throw new HttpException({
        status: 404,
        error: "User not found",
        message: "User not found"
      }, HttpStatus.FORBIDDEN);
    }
    user.contactNumber=req.body.mobileNumber
   
    // console.log("user",user)
    if(user.isVerified)
    {
      return {
        type: 'error',
        message: "User already verified" 
      }
    }
    else{
      let SMS = {
        authkey:'366411AamHKyDckoqf6129d4c4P1',
        template_id:'62c2c993686eff1b09630536',
        mobile:'91'
      };
      SMS.mobile=SMS.mobile+user.contactNumber
      let SmsOptions = {
    
        path:`https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
      };
      // console.log('body',SmsOptions.path)
      let res = await fetch(SmsOptions.path)
      res=await res.text()
      res=JSON.parse(res)
      // console.log('res',res)
      if(res.type==="error"){
        throw new HttpException({
          status: 400,
          error: "Bad Request",
          message: res.message
        }, HttpStatus.FORBIDDEN);
      }
      else{
        // console.log("number-",SMS)
        this.SmsService.saveData(SMS)
        // let k = await this.userRepository.save(user);
        // console.log("no-update",user)
        throw new HttpException({
          status: 200,
          type: 'success'
          message: "OTP sent successfully"
          request_id: '32676568326c323434363631' 
        }, HttpStatus.OK);
      }

    }
  }

  async productMap(zohoKeys:string[],pimcoreKeys:string[],item:any){
    // console.log('item-----------------------------------------------------------',item)
    // console.log('zohoKeys',zohoKeys.length)
    // console.log('pimcoreKeys',pimcoreKeys.length)
    let productMap={}
    let papa=item.parent.Name
    let path=item.parent.parent.fullpath
    // let pathArray=["0","1","2","3"]
    let pathArray=path.split('/')
    let l0 = pathArray[2]
    let l1 = pathArray[3]
    let l2 = pathArray[4]
    let l3 = pathArray[5]

    for(let i=0,j=0;i<zohoKeys.length;i++){
      //switch case on zohoKeys[i]
      switch(zohoKeys[i]){
        case 'Super_Category_L0':
          productMap[zohoKeys[i]]=l0
          break;
        case 'Product_Name':
          if(item.Name){                   
            productMap[zohoKeys[i]]=`${papa} (${item[pimcoreKeys[j]]})`
          }
          else
          {
              productMap[zohoKeys[i]]=''
          }

         j++
         break;
        case 'Category_L1':
          productMap[zohoKeys[i]]=l1
          break;
        case 'Sub_Category_L2':
          productMap[zohoKeys[i]]=l2
          break;
        case 'Sub_sub_Category_L3':
          productMap[zohoKeys[i]]=l3
          j++
          break;
        case 'Selling_Price':
          // console.log('value',item)
            if(item.Selling_Price){                   
                productMap[zohoKeys[i]]=item.SellingPrice.value
            }
            else
            {
                  productMap[zohoKeys[i]]=''
            }
          j++
          break;
        case 'Cost_Price':
          if(item.Cost_Price){
            productMap[zohoKeys[i]]=item.Cost_Price.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'type':
          // console.log(pimcoreKeys[j],zohoKeys[i],"hello")
          if(item.type){
            productMap[zohoKeys[i]]=item.type
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'SalesInformation':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            if(item[pimcoreKeys[j]]==null){
              productMap[zohoKeys[i]]=true
              }
              else {
               productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
              }
            }
            else {
              productMap[zohoKeys[i]]=true
            }
            j++
          break;
        case 'PurchaseInformation':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            if(item[pimcoreKeys[j]]==null){
              productMap[zohoKeys[i]]=true
              }
              else {
               productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
              }
            }
            else {
              productMap[zohoKeys[i]]=true
            }
            j++
          break;
        case 'TrackInventory':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            if(item[pimcoreKeys[j]]==null){
              productMap[zohoKeys[i]]=true
              }
              else {
               productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
              }
            }
            else {
              productMap[zohoKeys[i]]=true
            }
            j++
          break;
        case 'Display_On':
          if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]] == null){
            productMap[zohoKeys[i]]=""
          }
          else{
            productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
            }
            else {
              productMap[zohoKeys[i]]=""
            }
            j++
          break;
        case 'Manufacturers':
          if(item.Manufacturer)
          {
            productMap[zohoKeys[i]]=item.Manufacturers.Name
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Brand':
          if(item.Brand)
          {
            productMap[zohoKeys[i]]=item.Brands.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Weight':
          if(item.Weight)
          {
            productMap[zohoKeys[i]]=item.Weight.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Height':
          if(item.Height)
          {
            productMap[zohoKeys[i]]=item.Height.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Breadth':
          if(item.Breadth)
          {
            productMap[zohoKeys[i]]=item.Breadth.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Length':
          if(item.Length)
          {
            productMap[zohoKeys[i]]=item.Length.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'PIMCORE_ID':
            console.log(pimcoreKeys[j])
            console.log("hello id",item.id)
            productMap[zohoKeys[i]]=item.id
          j++
          break;
        default:
          console.log(pimcoreKeys[j],zohoKeys[i])
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null && item[pimcoreKeys[j]]==""){
            productMap[zohoKeys[i]]=""
            }
            else {
             productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            }
          }
          else {
            productMap[zohoKeys[i]]=""
          }
          j++
          break;
        }
    }
    // console.log('productMap',productMap)
    return productMap
  }

  async productMap1(zohoKeys:string[],pimcoreKeys:string[],item:any){
    // console.log('item-----------------------------------------------------------',item)
    // console.log('zohoKeys',zohoKeys.length)
    // console.log('pimcoreKeys',pimcoreKeys.length)
    let productMap={}
    let papa=item.parent.Name
    let path=item.parent.fullpath
    // let pathArray=["0","1","2","3"]
    let pathArray=path.split('/')
    let l0 = pathArray[2]
    let l1 = pathArray[3]
    let l2 = pathArray[4]
    let l3 = pathArray[5]

    for(let i=0,j=0;i<zohoKeys.length;i++){
      //switch case on zohoKeys[i]
      switch(zohoKeys[i]){
        case 'Super_Category_L0':
          productMap[zohoKeys[i]]=l0
          break;
        case 'Product_Name':
          if(item.Name){                   
            productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`
          }
          else
          {
              productMap[zohoKeys[i]]=''
          }

         j++
         break;
        case 'Category_L1':
          productMap[zohoKeys[i]]=l1
          break;
        case 'Sub_Category_L2':
          productMap[zohoKeys[i]]=l2
          break;
        case 'Sub_sub_Category_L3':
          productMap[zohoKeys[i]]=l3
          j++
          break;
        // case 'Selling_Price':
        //   // console.log('value',item)
        //     if(item.Selling_Price){                   
        //         productMap[zohoKeys[i]]=item.SellingPrice.value
        //     }
        //     else
        //     {
        //           productMap[zohoKeys[i]]=''
        //     }
        //   j++
        //   break;
        // case 'Cost_Price':
        //   if(item.Cost_Price){
        //     productMap[zohoKeys[i]]=item.Cost_Price.value
        //   }
        //   else
        //   {
        //     productMap[zohoKeys[i]]=''
        //   }
        //   j++
        //   break;
        case 'type':
          // console.log(pimcoreKeys[j],zohoKeys[i],"hello")
          if(item.type){
            productMap[zohoKeys[i]]=item.type
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'SalesInformation':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            if(item[pimcoreKeys[j]]==null){
              productMap[zohoKeys[i]]=true
              }
              else {
               productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
              }
            }
            else {
              productMap[zohoKeys[i]]=true
            }
            j++
          break;
        case 'PurchaseInformation':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            if(item[pimcoreKeys[j]]==null){
              productMap[zohoKeys[i]]=true
              }
              else {
               productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
              }
            }
            else {
              productMap[zohoKeys[i]]=true
            }
            j++
          break;
        case 'TrackInventory':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            if(item[pimcoreKeys[j]]==null){
              productMap[zohoKeys[i]]=true
              }
              else {
               productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
              }
            }
            else {
              productMap[zohoKeys[i]]=true
            }
            j++
          break;
        case 'Display_On':
          if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]] == null){
            productMap[zohoKeys[i]]=""
          }
          else{
            productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
            }
            else {
              productMap[zohoKeys[i]]=""
            }
            j++
          break;
        case 'Manufacturers':
          if(item.Manufacturer)
          {
            productMap[zohoKeys[i]]=item.Manufacturers.Name
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Brand':
          if(item.Brand)
          {
            productMap[zohoKeys[i]]=item.Brands.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Weight':
          if(item.Weight)
          {
            productMap[zohoKeys[i]]=item.Weight.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Height':
          if(item.Height)
          {
            productMap[zohoKeys[i]]=item.Height.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Breadth':
          if(item.Breadth)
          {
            productMap[zohoKeys[i]]=item.Breadth.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'Length':
          if(item.Length)
          {
            productMap[zohoKeys[i]]=item.Length.value
          }
          else
          {
            productMap[zohoKeys[i]]=''
          }
          j++
          break;
        case 'PIMCORE_ID':
            console.log(pimcoreKeys[j])
            console.log("hello id",item.id)
            productMap[zohoKeys[i]]=item.id
          j++
          break;
        default:
          console.log(pimcoreKeys[j],zohoKeys[i])
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null && item[pimcoreKeys[j]]==""){
            productMap[zohoKeys[i]]=""
            }
            else {
             productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
            }
          }
          else {
            productMap[zohoKeys[i]]=""
          }
          j++
          break;
        }
    }
    // console.log('productMap',productMap)
    return productMap
  }

@Get('zohoCrmToken')
async zohoToken(){
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


async zohoCrmProduct(item:any,token:string)
{
  let zoho1 = await fetch('https://www.zohoapis.in/crm/v2/Products', {
  method: 'POST',
  headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },    
  // body: out
  body:JSON.stringify({data: item})
});

zoho1=await zoho1.text() 
zoho1=JSON.parse(zoho1)
// console.log("zoho product post",zoho1)
console.log("zoho product post",zoho1)
// let id
if(zoho1.data[0].code=="SUCCESS"){
  return zoho1
}
else if (zoho1.data[0].code=="DUPLICATE_DATA") {
 let  id=zoho1.data[0].details.id
  console.log("id",id)
console.log("duplicate data",token)
let zoho2 = await fetch(`https://www.zohoapis.in/crm/v2/Products/${id}`, {
  method: 'PUT',
  headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },    
  // body: out
  body:JSON.stringify({data: item})
});
zoho2=await zoho2.text()
zoho2=JSON.parse(zoho2)
console.log("zoho product put",zoho2.data)
return zoho2
}
else if(zoho1.data[0].code=="INVALID_DATA"){
  console.log("invalid data",zoho1.data[0].details)
  return item
} if(zoho1.data[0].code=="INVALID_TOKEN"){
  console.log("invalid token",zoho1.data[0].details)
  return "INVALID_TOKEN"
}

}



  @Get('pimcore-product-to-zoho-crm')
  async test1() {
    console.log("hello")
    const query = `{
      getObjectFolder(id:1189){
...on object_folder{
  id
  key
  index
  childrenSortBy
  fullpath
  modificationDateDate
  children{
    ...on object_folder{
      id
      index
      creationDate
      fullpath
      key
      children{
        ... on object_folder{
          id
          index
          fullpath
          key
          children{
            ... on object_folder{
              id
              index
              fullpath
              key
              children{
                ... on object_folder{
                  id
                  index
                  fullpath
                  key
                  children{
                    __typename
                    ... on object_GeneralClass{
                            Name
                          id
                          Description
                          SKU
                          DisplayOn
                          Tags
                          HSN_Code
                          EcoFriendly
                          ReadyStock
                          GreenProduct
                          GoodsOrService
                          ProdoExclusive
                          TrackInventory
                          AdvancedInventoryTracking
                          LeadTime
                          MOQ
                          Unit
                          Fragile
                          Biodegradable
                          OneTimeUse
                          Tags
                         
                          AdvancedInventoryTracking
                          TrackInventory
                          InterStateGSTRate
                          DisplayOn
                          ProdoExclusive
                          EcoFriendly
                          WhiteLabeled
                          MadeToOrder
                          LeadTime
                          ISBN
                          EAN
                          MPN
                          TaxPreferance
                          HSNCode
                          Brand{
                            __typename
                          }
                          Weight{
                            value
                          }
                          Height{
                            value
                          }
                          Breadth{
                            value
                          }
                           Length{
                            value
                          }
                         
                          SellingPrice{
                            value
                          }
                          CostPrice{
                            value
                          }
                          Manufacturers{
                            ... on object_GeneralClass{
                              id
                              Name
                            }
                          }
                          parent{
                            __typename
                            ... on object_folder{
                                   fullpath
                                 }
                          }
                      children(objectTypes:["variant","object"]){
                        __typename
                        ... on object_GeneralClass{
                          Name
                          id
                          Description
                          SKU
                          DisplayOn
                          Tags
                          HSN_Code
                          EcoFriendly
                          ReadyStock
                          GreenProduct
                          GoodsOrService
                          ProdoExclusive
                          TrackInventory
                          AdvancedInventoryTracking
                          LeadTime
                          MOQ
                          Unit
                          Fragile
                          Biodegradable
                          OneTimeUse
                          Tags
                         
                          AdvancedInventoryTracking
                          TrackInventory
                          InterStateGSTRate
                          DisplayOn
                          ProdoExclusive
                          EcoFriendly
                          WhiteLabeled
                          MadeToOrder
                          LeadTime
                          ISBN
                          EAN
                          MPN
                          TaxPreferance
                          HSNCode
                          Brand{
                            __typename
                          }
                          Weight{
                            value
                          }
                          Height{
                            value
                          }
                          Breadth{
                            value
                          }
                           Length{
                            value
                          }
                         
                          SellingPrice{
                            value
                          }
                          CostPrice{
                            value
                          }
                          Manufacturers{
                            ... on object_GeneralClass{
                              id
                              Name
                            }
                          }
                          parent{
                            __typename
                            ... on object_GeneralClass{
                              Name
                              parent{
                                ... on object_folder{
                                  fullpath
                                }
                              }
                            }
                          }
                   
                        }
                      }
                   
                  }
                   
                  }
                 
                }
              }
            }
          }
         
        }
      }
    }
  }
}
}
  }`;
 let kill
 const ret = await fetch('https://pim.prodo.in/pimcore-graphql-webservices/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer '8f7bb0951b624784d0b08ba94a56218a'`,
    'X-API-Key' : "8f7bb0951b624784d0b08ba94a56218a"
  },
  body: JSON.stringify({query: query})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', kill=data));
  // return kill
  kill=kill.data.getObjectFolder.children 
  // return kill
  // let out=[]
  let res = []
  let token = await this.zohoToken()

  let pimcoreKeys = [
    "GoodsOrService",
    "Name",
    "SKU",
    "Unit",
    "Returnable",
    "HSNCode",
    "TaxPreferance",
    "Length",
    "Breadth",
    "Height",
    "Weight",
    "Brand",
    "Manufacurers",
    "UPC",
    "MPN",
    "EAN",
    "ISBN",
    "LeadTime",
    "MadeToOrder",
    "ReadyStock",
    "WhiteLabeled",
    "GreenProduct",
    "EcoFriendly",
    "ProdoExclusive",
    "MOQ",
    "DisplayOn",
    "Description",
    "SubSubCategory",
    "SalesInformation",
    "SellingPrice",
    "SalesAccount",
    "SalesDescription",
    "PurchaseInformation",
    "CostPrice",
    "PurchaseAccount",
    "IntraStateGSTRate",
    "InterStateGSTRate",
    "TrackInventory",
    "AdvancedInventoryTracking",
    "id",
    "Fragile",
    "Biodegradable",
    "OneTimeUse",
    "Tags",
    "ZBooksItemID",
    "ZCRMItemID"

  ]
  //sales discription and  description swap
  let zohoKeys = [
    "type",
    "Product_Name",
    "SKU_ID",
    "Unit",
    "Returnable",
    "HSNCode",
    "Taxable",
    "Length_in_cm",
    "Breadth_in_cm",
    "Height_in_cm",
    "Weight_in_gm",
    "Brand",
    "Manufacturers",
    "UPC",
    "MPN",
    "EAN",
    "ISBN",
    "LeadTime_in_days",
    "Made_to_Order",
    "Ready_Stock",
    "White_labeled",
    "Green_Product",
    "Eco_Friendly",
    "Prodo_Exclusive",
    "MOQ",
    "Display_On",
    "Description",
    "Super_Category_L0",
    "Category_L1",
    "Sub_Category_L2",
    "Sub_sub_Category_L3",
    "SalesInformation",
    "Selling_Price",
    "SalesAccount",
    "SalesDescription",
    "PurchaseInformation",
    "Cost_Price",
    "PurchaseAccount",
    "Intra_State_Tax_Rate",
    "Inter_State_GST_Rate",
    "TrackInventory",
    "AdvancedInventoryTracking",
    "PIMCORE_ID",
    "Fragile",
    "Biodegradable",
    "One_Time_Use",
    "SEO_Tags",
    "ZBooksItemID",
    "Product_id"
  ]

  for(let i=0;i<kill.length;i++)
  {
    console.log("level0",kill.length)
    if(Object.keys(kill[i]).includes("children"))
    {
      
      let child=kill[i].children//l1
      if(child.length>0)
      {
        
        console.log("level1",child.length)
        for(let j=0;j<child.length;j++)
        {
              if(Object.keys(child[j]).includes("children"))
              {
                let child2=child[j].children//l2
                if(child2.length>0)
                {
                    console.log("level2",child2.length)
                      for(let k=0;k<child2.length;k++)
                      {  
                        //  console.log("level3",child2) 
                        //  console.log("level3",child2[k])
                          if(Object.keys(child2[k]).includes("children"))
                          {
                            let child3=child2[k].children//l3
                            if(child3.length>0)
                            {
                              console.log("level3",child3.length)
                              for(let l=0;l<child3.length;l++)
                                {     
                                        
                                  if(Object.keys(child3[l]).includes("children"))
                                  {
                                      let child4=child3[l].children//l4
                                      console.log("level4",child4.length)
                                      if(child4.length>0)
                                      {
                                        for(let m=0;m<child4.length;m++)
                                          {
                                            if(Object.keys(child4[m]).includes("children"))
                                            { 
                                              let out=[]
                                              let data = await this.productMap1(zohoKeys,pimcoreKeys,child4[m])
                                              // let data=""
                                              if(data){
                                                out.push(data)
                                                let res1=await this.zohoCrmProduct(out,token)
                                                if(res1=="INVALID_TOKEN"){
                                                token=await this.zohoToken()
                                                let res1=await this.zohoCrmProduct(out,token)
                                                }
                                                res.push(res1)
                                                // res.push(data)
                                              }
                                              else{
                                                console.log("error")
                                              }
                                              let child5=child4[m].children//l5
                                              // console.log("item",child5)
                                              console.log("level--------------5",child5.length)
                                              for(let n=0;n<child5.length;n++)
                                              {
                                                              let out=[]
                                                              let data = await this.productMap(zohoKeys,pimcoreKeys,child5[n])
                                                              // let data=""
                                                              if(data){
                                                                out.push(data)
                                                                let res1=await this.zohoCrmProduct(out,token)
                                                                if(res1=="INVALID_TOKEN"){
                                                                token=await this.zohoToken()
                                                                let res1=await this.zohoCrmProduct(out,token)
                                                                }
                                                                res.push(res1)
                                                                // res.push(data)
                                                              }
                                                              else{
                                                                console.log("error")
                                                              }
                                                // out.push(child5[n])
                                              }
                                          }  
                                        }
                                      }
                                 }
                              }
                           }
                          }
                      }
                } 
        
      }
    }
  }
}
  }
return res

}


@Get('zohoBookToken')
async zohoBookToken(){
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
// console.log(token)
return token
}



async zohoBookProduct(item:any,token:string)
{
  console.log("item in sync ",item.sku)
  let zoho1 = await fetch('https://books.zoho.in/api/v3/items?organization_id=60015092519', {
  method: 'POST',
   headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },   
  // body: out
  body:JSON.stringify(item) 
}); 

zoho1=await zoho1.text() 
zoho1=JSON.parse(zoho1)
// console.log(zoho1)
// return {itemSku:item.sku,message:"zoho item added",status:"success"} 
if(zoho1.message=="The item has been added."){
  // console.log("zoho item aded")
  return {itemSku:item.sku,message:"zoho item added",status:"success"}
}
else if(zoho1.code=="120124"){
  console.log("invalid data",zoho1.message)
  return {itemSku:item.sku,message:"invalid data",status:"error"}
}
else if (zoho1.code=="1001") {
  console.log("item in update",item.sku)
  // item.sku!=="5228" || item.sku!=="5229"||item.sku!=="5227"||item.sku!=="5238"||item.sku!=="5226"||item.sku!=="5231"||item.sku!=="5230"||item.sku!=="5236"||item.sku!=="5235"||item.sku!=="5233"||item.sku!=="5234" ||item.sku!=="5237"){
// Remove the IF for all Update the data
  if (item.sku !== "5236") {
return {itemSku:item.sku,status:"updated"}
}
let kill
let res = await fetch(`https://books.zoho.in/api/v3/items?organization_id=60015092519&search_text=${item.sku}`, { 
// let res=await fetch('https://books.zoho.in/api/v3/items?organization_id=60b015092519&se arch_text=3458',{
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
  // console.log("data",kill) 
  if(kill.items==undefined){
    console.log("no item found")
    return {itemSku:item.sku,message:"zoho item not found on this sku id",status:"error"} 
  }
  if(!(kill.items.length>0)){
  // return item
  return {itemSku:item.sku,message:"zoho item not found on this sku id",status:"error"} 
  }
  let id=kill.items[0].item_id
  let zoho5 = await fetch(`https://books.zoho.in/api/v3/items/${id}?organization_id=60015092519`, {
  method: 'PUT',
  headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },
  // body: out
  body:JSON.stringify(item)
  });
  zoho5=await zoho5.text() 
  zoho5=JSON.parse(zoho5)
  // console.log("zoho product put",zoho5.code,zoho5.message)
  return {itemSku:item.sku,message:zoho5.message,status:"updated"}
}
else if(zoho1.code=="1002"){
  // console.log("in put",item)
  return { itemSku:item.sku,message:zoho1.message,item:item,status:"error"}
}
else if(zoho1.code=="4"){
  // console.log("invalid data in put",zoho1.message)
  return {itemSku:item.sku,message:zoho1.message,details:"check pimcore product",item:item,status:"error"}
} if(zoho1.code=="57"||zoho1.code=="14"){
  // console.log("invalid token",zoho1.message)
  // return {itemSku:item.sku,message:zoho1.message,details:"check zoho token",status:"error"}
  return "INVALID_TOKEN"
}
else{
  // console.log("invalid data in put",zoho1.message)
  return {itemSku:item.sku,message:zoho1.message,details:"pimcore or zoho token error",status:"error"}
}

}





async bookproductMapVar(zohoKeys:string[],pimcoreKeys:string[],item:any){
  let productMap={
    "custom_fields":[],
    "item_tax_preferences":[
      {
        "tax_specification": "inter",
        "tax_id": "",
    },
    {
        "tax_specification": "intra",
        "tax_id": "",
    }
    ],
    "package_details":{
      "length": "",
      "width": "",
      "height": "",
      "weight": "",
      "weight_unit": "g",
      "dimension_unit": "cm"
    }
  }

  let papa=item.parent.Name
  let badepapa = item.parent.parent.Name
  let path=item.parent.parent.parent.fullpath
  // let papa=item.parent.Name
  // let path=item.parent.fullpath
  // let pathArray=["0","1","2","3"]
  let pathArray=path.split('/')
  let l0 = pathArray[2]
  let l1 = pathArray[3]
  let l2 = pathArray[4]
  let l3 = pathArray[5]
  let custom_Field={
    "api_name":Any,
    "value":Any
  }
  for(let i=0,j=0;i<zohoKeys.length;i++){
    //switch case on zohoKeys[i]
    switch(zohoKeys[i]){
      // case 'category_name':
      //   productMap[zohoKeys[i]]=l0
      //   break;
      case 'cf_category_l0':
 
        // custom_Field.api_name="cf_category_l0"
        // custom_Field.value=l0
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_category_l0","value":l0})
        break
      case 'cf_sub_category_l1':
        // custom_Field.api_name="cf_sub_category_l1"
        // custom_Field.value=l1
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l1","value":l1})
        break;
      case 'cf_sub_category_l2':
        // custom_Field.api_name="cf_sub_category_l2"
        // custom_Field.value=l2
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l2","value":l2})
        break;
      case 'cf_sub_sub_category_l3':
        // custom_Field.api_name="cf_sub_sub_category_l3"
        // custom_Field.value=l3
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_sub_category_l3","value":l3})
        break;
      case 'product_type':
        productMap[zohoKeys[i]]="goods"
        j++
        break;
      // case 'unit':
      //   productMap[zohoKeys[i]]="pcs"
      //   j++
      //   break;
      case 'package_details{dimension_unit}':
        break;
      case 'package_details{weight_unit}':
        break;
      case 'is_taxable'
       productMap[zohoKeys[i]]=true
       j++
       break;
      case 'package_details{length}':
        if(item.Length)
        {
          productMap.package_details.length=item.Length.value
        }
        j++
        break;
      case 'package_details{width}':
        if(item.Breadth)
        {
          productMap.package_details.width=item.Breadth.value
        }
        j++
        break;
      case 'package_details{height}':
        if(item.Height)
        {
          productMap.package_details.height=item.Height.value
        }
        j++
        break;
      case 'package_details{weight}':
          if(item.Weight)
          {
            productMap.package_details.weight=item.Weight.value
          }
          j++
          break;      
      case 'name':
        if(item.Name){                   
          productMap[zohoKeys[i]]=`${badepapa} (${papa}) [${item[pimcoreKeys[j]]}]`
          // productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`
        }
        else
        {
            productMap[zohoKeys[i]]=''
        }
       j++
       break;
      // case 'sales_information':
      //   // custom_Field.api_name="cf_sales_information"
      //   // custom_Field.value=true
      //   // productMap.custom_fields.push(custom_Field)
      //   // productMap.custom_fields.push({"api_name":"cf_sales_information","value":true})
      //   productMap[zohoKeys[i]]=true
      //   j++
      //   break;
      case 'account_name':
        productMap[zohoKeys[i]]="Sales"
        j++
        break;
      case 'purchase_description':
        productMap[zohoKeys[i]]=true
        j++
        break;
      case 'purchase_account_name':
        productMap[zohoKeys[i]]="Cost of Goods Sold"
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]inter':
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%intra':
        productMap.item_tax_preferences[1].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%inter':
        productMap.item_tax_preferences[0].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_type}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_type}]inter':
        j++
        break;
      case 'inventory_account_name':
        productMap[zohoKeys[i]]="Finished Goods"
        j++
        break;
      // case 'cf_activitystatus':
      //   console.log("conunt")
      //   // custom_Field.api_name="cf_activitystatus"
      //   // custom_Field.value="Active"
      //   // productMap.custom_fields.push(custom_Field)
      //   productMap.custom_fields.push({"api_name":"cf_activitystatus","value":"Active"})
      //   break;
      case 'track_batch_number':
        productMap[zohoKeys[i]]=false
        break;
      case 'item_type':
        productMap[zohoKeys[i]]="inventory"
        break;
      case 'is_linked_with_zohocrm':
        productMap[zohoKeys[i]]=true
        break;

      case 'sales_rate':
        
        // console.log('value',item)
          if(item.Selling_Price){                   
              productMap[zohoKeys[i]]=item.SellingPrice.value
          }
          else
          {
                productMap[zohoKeys[i]]=''
          }
        j++
        break;
      case 'purchase_rate':
        if(item.Cost_Price){
          productMap[zohoKeys[i]]=item.Cost_Price.value
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      case 'manufacturer':
        if(item.Manufacturer)
        {
          productMap[zohoKeys[i]]=item.Manufacturers.Name
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      // case 'brand':
      //   if(item.Brand)
      //   {
      //     productMap[zohoKeys[i]]=item.Brands.value
      //   }
      //   else
      //   {
      //     productMap[zohoKeys[i]]=''
      //   }
      //   j++
      //   break;
      case 'sku':
          // console.log(pimcoreKeys[j])
          // console.log("hello id",item.id)
          productMap[zohoKeys[i]]=item.id
        j++
        break;
      case 'cf_pimcore_id':
        // custom_Field.api_name=zohoKeys[i]
        // custom_Field.value=item.id
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":item.id})
        j++
        break;
      // case 'cf_returnable_item':
      //   productMap[zohoKeys[i]]=item.Returnable
      //   j++
      //   break;
      case 'cf_ready_to_product':
        let value=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value="TRUE"
            }
            else{
              value="FALSE"
            }
          }
        }
        else {
          value=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'description':
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
            //convert item.Description to string
            let description=item[pimcoreKeys[j]]
            let description_json=JSON.stringify(description)
            let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
            description_json_without_html=description_json_without_html.replace(/\\n/g, '')
            productMap[zohoKeys[i]]=description_json_without_html
            // productMap[zohoKeys[i]]=JSON.stringify(item[pimcoreKeys[j]])

            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]].toString()
          //  productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      case 'cf_display_on':
          let k=""
         productMap.custom_fields.push({"api_name":zohoKeys[i],"value":k})
         j++
         break;
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'cf_ready_to_product':
        let v=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            v=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              v="TRUE"
            }
            else{
              v="FALSE"
            }
          }
        }
        else {
          v=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'cf_made_to_order':
        let value1=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value1=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value1="TRUE"
            }
            else{
              value1="FALSE"
            }
          }
        }
        else {
          value1=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value1})
        j++
        break;
      case 'cf_white_labeled':
        let value3=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value3=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value3="TRUE"
            }
            else{
              value3="FALSE"
            }
          }
        }
        else {
          value3=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value3})
        j++
        break;
        case 'cf_biodegradable':
          let value4=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value4=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value4="Yes"
              }
              else{
                value4="No"
              }
            }
          }
          else {
            value4=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value4})
          j++
          break;
        case 'cf_onetimeuse':
          let value5=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value5=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value5="Yes"
              }
              else{
                value5="No"
              }
            }
          }
          else {
            value5=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value5})
          j++
          break;
          

      default:
        // console.log(pimcoreKeys[j],zohoKeys[i])
        //check zohokeys[i] iss start with cf_
        // console.log("hello default",zohoKeys[i])
        if(zohoKeys[i].startsWith("cf_")){
          let value=Any
          // console.log("hello in cf case ",zohoKeys[i])
          // custom_Field.api_name=zohoKeys[i]
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value=""
            }
            else {
              value=item[pimcoreKeys[j]]
            }
          }
          else {
            value=""
          }
          // custom_Field.value=item[pimcoreKeys[j]]
          // console.log("hello in cf case ",custom_Field)
          // productMap.custom_fields.push(custom_Field)
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
          j++
        }
        else{
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
           productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      }
    }
  }
  // console.log('productMap',productMap)
  return productMap
}











async bookproductMap(zohoKeys:string[],pimcoreKeys:string[],item:any){
  let productMap={
    "custom_fields":[],
    "item_tax_preferences":[
      {
        "tax_specification": "inter",
        "tax_id": "",
    },
    {
        "tax_specification": "intra",
        "tax_id": "",
    }
    ],
    "package_details":{
      "length": "",
      "width": "",
      "height": "",
      "weight": "",
      "weight_unit": "g",
      "dimension_unit": "cm"
    }
  }

  let papa=item.parent.Name
  let path=item.parent.parent.fullpath
  // let papa=item.parent.Name
  // let path=item.parent.fullpath
  // let pathArray=["0","1","2","3"]
  let pathArray=path.split('/')
  let l0 = pathArray[2]
  let l1 = pathArray[3]
  let l2 = pathArray[4]
  let l3 = pathArray[5]
  let custom_Field={
    "api_name":Any,
    "value":Any
  }
  for(let i=0,j=0;i<zohoKeys.length;i++){
    //switch case on zohoKeys[i]
    switch(zohoKeys[i]){
      // case 'category_name':
      //   productMap[zohoKeys[i]]=l0
      //   break;
      case 'cf_category_l0':
 
        // custom_Field.api_name="cf_category_l0"
        // custom_Field.value=l0
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_category_l0","value":l0})
        break
      case 'cf_sub_category_l1':
        // custom_Field.api_name="cf_sub_category_l1"
        // custom_Field.value=l1
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l1","value":l1})
        break;
      case 'cf_sub_category_l2':
        // custom_Field.api_name="cf_sub_category_l2"
        // custom_Field.value=l2
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l2","value":l2})
        break;
      case 'cf_sub_sub_category_l3':
        // custom_Field.api_name="cf_sub_sub_category_l3"
        // custom_Field.value=l3
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_sub_category_l3","value":l3})
        break;
      case 'product_type':
        productMap[zohoKeys[i]]="goods"
        j++
        break;
      // case 'unit':
      //   productMap[zohoKeys[i]]="pcs"
      //   j++
      //   break;
      case 'package_details{dimension_unit}':
        break;
      case 'package_details{weight_unit}':
        break;
      case 'is_taxable'
       productMap[zohoKeys[i]]=true
       j++
       break;
      case 'package_details{length}':
        if(item.Length)
        {
          productMap.package_details.length=item.Length.value
        }
        j++
        break;
      case 'package_details{width}':
        if(item.Breadth)
        {
          productMap.package_details.width=item.Breadth.value
        }
        j++
        break;
      case 'package_details{height}':
        if(item.Height)
        {
          productMap.package_details.height=item.Height.value
        }
        j++
        break;
      case 'package_details{weight}':
          if(item.Weight)
          {
            productMap.package_details.weight=item.Weight.value
          }
          j++
          break;      
      case 'name':
        if(item.Name){                   
          productMap[zohoKeys[i]]=`${papa} (${item[pimcoreKeys[j]]})`
          // productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`

        }
        else
        {
            productMap[zohoKeys[i]]=''
        }
       j++
       break;
      // case 'sales_information':
      //   // custom_Field.api_name="cf_sales_information"
      //   // custom_Field.value=true
      //   // productMap.custom_fields.push(custom_Field)
      //   // productMap.custom_fields.push({"api_name":"cf_sales_information","value":true})
      //   productMap[zohoKeys[i]]=true
      //   j++
      //   break;
      case 'account_name':
        productMap[zohoKeys[i]]="Sales"
        j++
        break;
      case 'purchase_description':
        productMap[zohoKeys[i]]=true
        j++
        break;
      case 'purchase_account_name':
        productMap[zohoKeys[i]]="Cost of Goods Sold"
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]inter':
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%intra':
        productMap.item_tax_preferences[1].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%inter':
        productMap.item_tax_preferences[0].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_type}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_type}]inter':
        j++
        break;
      case 'inventory_account_name':
        productMap[zohoKeys[i]]="Finished Goods"
        j++
        break;
      // case 'cf_activitystatus':
      //   console.log("conunt")
      //   // custom_Field.api_name="cf_activitystatus"
      //   // custom_Field.value="Active"
      //   // productMap.custom_fields.push(custom_Field)
      //   productMap.custom_fields.push({"api_name":"cf_activitystatus","value":"Active"})
      //   break;
      case 'track_batch_number':
        productMap[zohoKeys[i]]=false
        break;
      case 'item_type':
        productMap[zohoKeys[i]]="inventory"
        break;
      case 'is_linked_with_zohocrm':
        productMap[zohoKeys[i]]=true
        break;

      case 'sales_rate':
        
        // console.log('value',item)
          if(item.Selling_Price){                   
              productMap[zohoKeys[i]]=item.SellingPrice.value
          }
          else
          {
                productMap[zohoKeys[i]]=''
          }
        j++
        break;
      case 'purchase_rate':
        if(item.Cost_Price){
          productMap[zohoKeys[i]]=item.Cost_Price.value
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      case 'manufacturer':
        if(item.Manufacturer)
        {
          productMap[zohoKeys[i]]=item.Manufacturers.Name
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      // case 'brand':
      //   if(item.Brand)
      //   {
      //     productMap[zohoKeys[i]]=item.Brands.value
      //   }
      //   else
      //   {
      //     productMap[zohoKeys[i]]=''
      //   }
      //   j++
      //   break;
      case 'sku':
          // console.log(pimcoreKeys[j])
          // console.log("hello id",item.id)
          productMap[zohoKeys[i]]=item.id
        j++
        break;
      case 'cf_pimcore_id':
        // custom_Field.api_name=zohoKeys[i]
        // custom_Field.value=item.id
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":item.id})
        j++
        break;
      // case 'cf_returnable_item':
      //   productMap[zohoKeys[i]]=item.Returnable
      //   j++
      //   break;
      case 'cf_ready_to_product':
        let value=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value="TRUE"
            }
            else{
              value="FALSE"
            }
          }
        }
        else {
          value=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'description':
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
            //convert item.Description to string
            let description=item[pimcoreKeys[j]]
            let description_json=JSON.stringify(description)
            let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
            description_json_without_html=description_json_without_html.replace(/\\n/g, '')
            productMap[zohoKeys[i]]=description_json_without_html
            // productMap[zohoKeys[i]]=JSON.stringify(item[pimcoreKeys[j]])

            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]].toString()
          //  productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      case 'cf_display_on':
          let k=""
         productMap.custom_fields.push({"api_name":zohoKeys[i],"value":k})
         j++
         break;
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'cf_ready_to_product':
        let v=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            v=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              v="TRUE"
            }
            else{
              v="FALSE"
            }
          }
        }
        else {
          v=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'cf_made_to_order':
        let value1=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value1=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value1="TRUE"
            }
            else{
              value1="FALSE"
            }
          }
        }
        else {
          value1=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value1})
        j++
        break;
      case 'cf_white_labeled':
        let value3=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value3=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value3="TRUE"
            }
            else{
              value3="FALSE"
            }
          }
        }
        else {
          value3=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value3})
        j++
        break;
        case 'cf_biodegradable':
          let value4=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value4=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value4="Yes"
              }
              else{
                value4="No"
              }
            }
          }
          else {
            value4=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value4})
          j++
          break;
        case 'cf_onetimeuse':
          let value5=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value5=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value5="Yes"
              }
              else{
                value5="No"
              }
            }
          }
          else {
            value5=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value5})
          j++
          break;
          

      default:
        // console.log(pimcoreKeys[j],zohoKeys[i])
        //check zohokeys[i] iss start with cf_
        // console.log("hello default",zohoKeys[i])
        if(zohoKeys[i].startsWith("cf_")){
          let value=Any
          // console.log("hello in cf case ",zohoKeys[i])
          // custom_Field.api_name=zohoKeys[i]
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value=""
            }
            else {
              value=item[pimcoreKeys[j]]
            }
          }
          else {
            value=""
          }
          // custom_Field.value=item[pimcoreKeys[j]]
          // console.log("hello in cf case ",custom_Field)
          // productMap.custom_fields.push(custom_Field)
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
          j++
        }
        else{
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
           productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      }
    }
  }
  // console.log('productMap',productMap)
  return productMap
}


async bookproductMap1(zohoKeys:string[],pimcoreKeys:string[],item:any){
  let productMap={
    "custom_fields":[],
    "item_tax_preferences":[
      {
        "tax_specification": "inter",
        "tax_id": "",
    },
    {
        "tax_specification": "intra",
        "tax_id": "",
    }
    ],
    "package_details":{
      "length": "",
      "width": "",
      "height": "",
      "weight": "",
      "weight_unit": "g",
      "dimension_unit": "cm"
    }
  }

  // let papa=item.parent.Name
  // let path=item.parent.parent.fullpath
  let papa=item.parent.Name
  let path=item.parent.fullpath
  // let pathArray=["0","1","2","3"]
  let pathArray=path.split('/')
  let l0 = pathArray[2]
  let l1 = pathArray[3]
  let l2 = pathArray[4]
  let l3 = pathArray[5]
  let custom_Field={
    "api_name":Any,
    "value":Any
  }
  for(let i=0,j=0;i<zohoKeys.length;i++){
    //switch case on zohoKeys[i]
    switch(zohoKeys[i]){
      // case 'category_name':
      //   productMap[zohoKeys[i]]=l0
      //   break;
      case 'cf_category_l0':
 
        // custom_Field.api_name="cf_category_l0"
        // custom_Field.value=l0
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_category_l0","value":l0})
        break
      case 'cf_sub_category_l1':
        // custom_Field.api_name="cf_sub_category_l1"
        // custom_Field.value=l1
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l1","value":l1})
        break;
      case 'cf_sub_category_l2':
        // custom_Field.api_name="cf_sub_category_l2"
        // custom_Field.value=l2
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l2","value":l2})
        break;
      case 'cf_sub_sub_category_l3':
        // custom_Field.api_name="cf_sub_sub_category_l3"
        // custom_Field.value=l3
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_sub_category_l3","value":l3})
        break;
      case 'product_type':
        productMap[zohoKeys[i]]="goods"
        j++
        break;
      // case 'unit':
      //   productMap[zohoKeys[i]]="pcs"
      //   j++
      //   break;
      case 'package_details{dimension_unit}':
        break;
      case 'package_details{weight_unit}':
        break;
      case 'is_taxable'
       productMap[zohoKeys[i]]=true
       j++
       break;
      case 'package_details{length}':
        if(item.Length)
        {
          productMap.package_details.length=item.Length.value
        }
        j++
        break;
      case 'package_details{width}':
        if(item.Breadth)
        {
          productMap.package_details.width=item.Breadth.value
        }
        j++
        break;
      case 'package_details{height}':
        if(item.Height)
        {
          productMap.package_details.height=item.Height.value
        }
        j++
        break;
      case 'package_details{weight}':
          if(item.Weight)
          {
            productMap.package_details.weight=item.Weight.value
          }
          j++
          break;      
      case 'name':
        if(item.Name){                   
          // productMap[zohoKeys[i]]=`${papa} (${item[pimcoreKeys[j]]})`
          productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`

        }
        else
        {
            productMap[zohoKeys[i]]=''
        }
       j++
       break;
      // case 'sales_information':
      //   // custom_Field.api_name="cf_sales_information"
      //   // custom_Field.value=true
      //   // productMap.custom_fields.push(custom_Field)
      //   // productMap.custom_fields.push({"api_name":"cf_sales_information","value":true})
      //   productMap[zohoKeys[i]]=true
      //   j++
      //   break;
      case 'account_name':
        productMap[zohoKeys[i]]="Sales"
        j++
        break;
      case 'purchase_description':
        productMap[zohoKeys[i]]=true
        j++
        break;
      case 'purchase_account_name':
        productMap[zohoKeys[i]]="Cost of Goods Sold"
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]inter':
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%intra':
        productMap.item_tax_preferences[1].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%inter':
        productMap.item_tax_preferences[0].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_type}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_type}]inter':
        j++
        break;
      case 'inventory_account_name':
        productMap[zohoKeys[i]]="Finished Goods"
        j++
        break;
      // case 'cf_activitystatus':
      //   console.log("conunt")
      //   // custom_Field.api_name="cf_activitystatus"
      //   // custom_Field.value="Active"
      //   // productMap.custom_fields.push(custom_Field)
      //   productMap.custom_fields.push({"api_name":"cf_activitystatus","value":"Active"})
      //   break;
      case 'track_batch_number':
        productMap[zohoKeys[i]]=false
        break;
      case 'item_type':
        productMap[zohoKeys[i]]="inventory"
        break;
      case 'is_linked_with_zohocrm':
        productMap[zohoKeys[i]]=true
        break;

      case 'sales_rate':
        
        // console.log('value',item)
          if(item.Selling_Price){                   
              productMap[zohoKeys[i]]=item.SellingPrice.value
          }
          else
          {
                productMap[zohoKeys[i]]=''
          }
        j++
        break;
      case 'purchase_rate':
        if(item.Cost_Price){
          productMap[zohoKeys[i]]=item.Cost_Price.value
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      case 'manufacturer':
        if(item.Manufacturer)
        {
          productMap[zohoKeys[i]]=item.Manufacturers.Name
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      // case 'brand':
      //   if(item.Brand)
      //   {
      //     productMap[zohoKeys[i]]=item.Brands.value
      //   }
      //   else
      //   {
      //     productMap[zohoKeys[i]]=''
      //   }
      //   j++
      //   break;
      case 'sku':
          // console.log(pimcoreKeys[j])
          // console.log("hello id",item.id)
          productMap[zohoKeys[i]]=item.id
        j++
        break;
      case 'cf_pimcore_id':
        // custom_Field.api_name=zohoKeys[i]
        // custom_Field.value=item.id
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":item.id})
        j++
        break;
      // case 'cf_returnable_item':
      //   productMap[zohoKeys[i]]=item.Returnable
      //   j++
      //   break;
      case 'cf_ready_to_product':
        let value=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value="TRUE"
            }
            else{
              value="FALSE"
            }
          }
        }
        else {
          value=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'cf_made_to_order':
        let value1=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value1=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value1="TRUE"
            }
            else{
              value1="FALSE"
            }
          }
        }
        else {
          value1=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value1})
        j++
        break;
      case 'cf_white_labeled':
        let value3=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value3=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value3="TRUE"
            }
            else{
              value3="FALSE"
            }
          }
        }
        else {
          value3=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value3})
        j++
        break;
      case 'cf_biodegradable':
        let value4=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value4=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value4="Yes"
            }
            else{
              value4="No"
            }
          }
        }
        else {
          value4=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value4})
        j++
        break;
      case 'cf_onetimeuse':
        let value5=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value5=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value5="Yes"
            }
            else{
              value5="No"
            }
          }
        }
        else {
          value5=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value5})
        j++
        break;


        case 'description':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
            productMap[zohoKeys[i]]=""
            }
            else {
              let description=item[pimcoreKeys[j]]
              let description_json=JSON.stringify(description)
              let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
              description_json_without_html=description_json_without_html.replace(/\\n/g, '')
              productMap[zohoKeys[i]]=description_json_without_html
            }
          }
          else {
            productMap[zohoKeys[i]]=""
          }
          j++
          break;
          case 'cf_display_on':
            let k=""
           productMap.custom_fields.push({"api_name":zohoKeys[i],"value":k})
           j++
           break;
      default:
        // console.log(pimcoreKeys[j],zohoKeys[i])
        //check zohokeys[i] iss start with cf_
        // console.log("hello default",zohoKeys[i])
        if(zohoKeys[i].startsWith("cf_")){
          let value=Any
          // console.log("hello in cf case ",zohoKeys[i])
          // custom_Field.api_name=zohoKeys[i]
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value=""
            }
            else {
              value=item[pimcoreKeys[j]]
            }
          }
          else {
            value=""
          }
          // custom_Field.value=item[pimcoreKeys[j]]
          // console.log("hello in cf case ",custom_Field)
          // productMap.custom_fields.push(custom_Field)
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
          j++
        }
        else{
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
           productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      }
    }
  }
  // console.log('productMap',productMap)
  return productMap
}


@Get('pimcore-product-to-zoho-books')
async zohoBooks() {
  console.log("Pimcore-Books-Syncing-")
  const query = `{
    getObjectFolder(id:1189){
...on object_folder{
id
key
index
childrenSortBy
fullpath
modificationDateDate
children{
  ...on object_folder{
    id
    index
    creationDate
    fullpath
    key
    children{
      ... on object_folder{
        id
        index
        fullpath
        key
        children{
          ... on object_folder{
            id
            index
            fullpath
            key
            children{
              ... on object_folder{
                id
                index
                fullpath
                key
                children{
                  __typename
                  ... on object_GeneralClass{
                          Name
                    
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Country
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        images
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                        Country
                        ClientSKUCode

                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                         ... on object_folder{
                                fullpath
                              }
                        }
                    children(objectTypes:["variant","object"]){
                      __typename
                      ... on object_GeneralClass{
                        Name
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                       
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                        
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        images
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                           Country
                    ClientSKUCode
                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                          ... on object_GeneralClass{
                            Name
                            parent{
                              ... on object_folder{
                                fullpath
                              }
                            }
                          }
                        }
                       
                      children(objectTypes:["variant","object"]){
                        __typename
                        ... on object_GeneralClass{
                          Name
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                        images
                       
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                          
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                           Country
                    ClientSKUCode
                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                          ... on object_GeneralClass{
                            Name
                            parent{
                              __typename
                              ... on object_GeneralClass{
                                Name
                                id
                                parent{
                               ... on object_folder{
                                fullpath
                              }
                                }
                              }
                  
                            }
                          }
                        }
                       
                        }
                        
                      }
                      }
                      
                      
                    }
                 
                }
                 
                }
               
              }
            }
          }
        }
       
      }
    }
  }
}
}
}
}`;
let kill
const ret = await fetch('https://pim.prodo.in/pimcore-graphql-webservices/products', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // 'Authorization': `Bearer '8f7bb0951b624784d0b08ba94a56218a'`,
  'X-API-Key' : "8f7bb0951b624784d0b08ba94a56218a"
},
body: JSON.stringify({query: query})
})
.then(r => r.json())
.then(data =>  kill=data);
// return kill
kill=kill.data.getObjectFolder.children 
// return kill
// let out=[]
let res = []
let added =0
let fail =0
let updated=0
let token = await this.zohoBookToken()


let pimcoreKeys=[
  "GoodsOrService",
  "Unit",
  "TaxPreferance",
  "Name",
  "ID",
  "Returnable",
  "HSN_Code",
  "Length",
  "Breadth",
  "Height",
  "Weight",
  "Brand",
  "Manufacurers",
  "UPC",
  "MPN",
  "EAN",
  "ISBN",
  "LeadTime",
  "MadeToOrder",
  "ReadyStock",
  "WhiteLabeled",
  "GreenProduct",
  "EcoFriendly",
  "ProdoExclusive",
  "MOQ",
  "DisplayOn",
  "SalesDescription",
  // "SalesInformation",
  "SellingPrice",
  "SalesAccount",
  "Description",
  "PurchaseInformation",
  "CostPrice",
  "PurchaseAccount",
  "Intra",
  "IntraStateGSTRate",
  "IntraType",
  "Inter",
  "InterStateGSTRate",
  "interType",
  "ID",
  // "Fragile",
  "Biodegradable",
  "OneTimeUse",
  "Tags",
  // "TrackInventory",
  "Country",
  "ClientSKUCode",
  "SKU",
  "ModelNo",
  "images"

]

let zohoKeys = [
  "product_type",//goods
  "unit",//pcs
  "package_details{dimension_unit}",//cm NP
  "package_details{weight_unit}",//g NP
  "is_taxable",//TRUE
  "name",
  "sku",
  "cf_returnable_item",
  "hsn_or_sac",
  "package_details{length}",
  "package_details{width}",
  "package_details{height}",
  "package_details{weight}",
  "brand",
  "manufacturer",
  "upc",
  "cf_mpn",
  "ean",
  "isbn",
  "cf_lead_time",
  "cf_made_to_order",
  "cf_ready_to_product",
  "cf_white_labeled",
  "cf_green_product",
  "cf_eco_friendly",
  "cf_prodo_exclusive",
  "cf_minimum_order_quantity",
  "cf_display_on",
  "cf_variant_description",
  "cf_category_l0",//NP
  "cf_sub_category_l1",//NP
  "cf_sub_category_l2",//NP
  "cf_sub_sub_category_l3",//NP
  // "cf_sales_information",//TRUE
  "sales_rate",
  "account_name",//Sales 
  "description",
  "purchase_description",//TRUE
  "purchase_rate",
  "purchase_account_name",//Cost of Goods Sold
  "item_tax_preferences [{tax_specification,tax_name}]intra",//GST12
  "item_tax_preferences [{tax_percentage}]%intra",
  "item_tax_preferences [{tax_type}]intra",//Group
  "item_tax_preferences [{tax_specification,tax_name}]inter",//IGST12
  "item_tax_preferences [{tax_percentage}]%inter",
  "item_tax_preferences [{tax_type}]inter",//Simple
  "cf_pimcore_id",
  // "cf_fragile",
  "cf_biodegradable",
  "cf_onetimeuse",
  "cf_seo_tags",
  "cf_country_of_origin",
  "cf_client_sku_code",
  "cf_prodo_sku_id",
  "cf_model_no",
  "cf_images",
  "inventory_account_name",//Finished Goods NP
  // "cf_activitystatus",//Active NP
  "track_batch_number",//TRUE NP
  "item_type",//Sales and Purchases NP
  "is_linked_with_zohocrm",//TRUE NP
  // "category_name"
]



for(let i=0;i<kill.length;i++)
{
  // console.log("level0",kill.length)
  if(Object.keys(kill[i]).includes("children"))
  {
    
    let child=kill[i].children//l1
    if(child.length>0)
    {
      
      // console.log("level1",child.length)
      for(let j=0;j<child.length;j++)
      {
            if(Object.keys(child[j]).includes("children"))
            {
              let child2=child[j].children//l2
              if(child2.length>0)
              {
                  // console.log("level2",child2.length)
                    for(let k=0;k<child2.length;k++)
                    {  
                      //  console.log("level3") 
                      //  console.log("level3",child2[k])
                        if(Object.keys(child2[k]).includes("children"))
                        {
                          let child3=child2[k].children//l3
                          if(child3.length>0)
                          {
                            // console.log("level3",child3.length)
                            for(let l=0;l<child3.length;l++)
                              {     
                                      
                                if(Object.keys(child3[l]).includes("children"))
                                {
                                    let child4=child3[l].children//l4
                                    // console.log("level4",child4)
                                    if(child4.length>0)
                                    {
                                      // console.log("level4",child4.length)
                                      for(let m=0;m<child4.length;m++)
                                      // for(let m=0;m<1;m++)
                                        {
                                          if(Object.keys(child4[m]).includes("children"))
                                          { 
                                            let out=[]
                                            // return child4[m]
                                            let data = await this.bookproductMap1(zohoKeys,pimcoreKeys,child4[m])//p-type
                                            // let data=""
                                            if(data){
                                              out.push(data)
                                              let res1=await this.zohoBookProduct(data,token)
                                              if(res1.status){
                                              if(res1.status=="updated"){
                                                updated++;
                                              }
                                              else if (res1.status=="success"){
                                                added++;
                                              }
                                              else if(res1.status=="error"){
                                                 fail++;
                                              }
                                            }
                                              if(res1=="INVALID_TOKEN"){
                                              // token=await this.zohoToken()
                                              token = await this.zohoBookToken()

                                              res1=await this.zohoBookProduct(data,token)
                                              }
                                              res.push({res:res1,level:"P-Type"})
                                              // res.push(data)
                                            }
                                            else{
                                              console.log("error")
                                            }
                                            let child5=child4[m].children//l5
                                            // console.log("item",child5)
                                            // console.log("level--------------5",child5.length)
                                            if(child5.length>0){
                                              // console.log("level5",child5.length);
                                              
                                            for(let n=0;n<child5.length;n++)
                                            {
                                                            let out=[]
                                                            let data = await this.bookproductMap(zohoKeys,pimcoreKeys,child5[n])//sub varient
                                                            // let data=""
                                                            if(data){
                                                              out.push(data)
                                                              let res1=await this.zohoBookProduct(data,token)
                                                              if(res1.status){

                                                              if(res1.status=="updated"){
                                                                updated++;
                                                              }
                                                              else if (res1.status=="success"){
                                                                added++;
                                                              }
                                                              else if(res1.status=="error"){
                                                                 fail++;
                                                              }
                                                            }
                                                              if(res1=="INVALID_TOKEN"){
                                                              token=await this.zohoToken()
                                                             res1=await this.zohoBookProduct(data,token)
                                                              }
                                                              res.push({res:res1,level:"Sub-Type"})
                                                              // res.push(data)
                                                            }
                                                            else{
                                                              console.log("error")
                                                            }
                                                            let child6=child5[n].children//l6
                                                            // console.log("item",child6)
                                                            // console.log("level--------------6",child6.length)
                                                            if(child6.length>0){
                                                            for(let o=0;o<child6.length;o++)
                                                            {
                                                                  let out=[]
                                                                  let data = await this.bookproductMapVar(zohoKeys,pimcoreKeys,child6[o])//varients
                                                                  // let data=""
                                                                  if(data){
                                                                    out.push(data)
                                                                    let res1=await this.zohoBookProduct(data,token)
                                                                    if(res1.status){ 

                                                                    if(res1.status=="updated"){
                                                                      updated++;
                                                                    }
                                                                    else if (res1.status=="success"){
                                                                      added++;
                                                                    }
                                                                    else if(res1.status=="error"){
                                                                       fail++;
                                                                    }
                                                                  }
                                                                    if(res1=="INVALID_TOKEN"){
                                                                    token=await this.zohoToken()
                                                                    res1=await this.zohoBookProduct(data,token)
                                                                    }
                                                                    res.push({res:res1,level:"Varient"})
                                                                    // res.push(data)
                                                                  }
                                                                  else{
                                                                    console.log("error")
                                                                  }
                                                            }
                                                          }
                                                                           
                                              // out.push(child5[n])
                                            }
                                          }
                                        }  
                                      }
                                    }
                               }
                            }
                         }
                        }
                    }
              } 
      
    }
  }
}
}
}
return {Products_Added:added,Products_Updated:updated,failed:fail,Response:res}
// return res
}


@Get('zohoFarjiToken')
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

@Get('newZohoFarjiToken')
async newZohoBookTokenFarji(){
  let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
  console.log("zohoToken",zohoToken)
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


@UseGuards(JwtAuthGuard)
@Get("zohoBooks-salesOrder")
async zohoBookSalesOrder(@Request() req){
  // let userEmail="kamran.khan@niyotail.com"
  // let userEmail="vishal.sharma@niyotail.com"
  let user=await this.userRepository.findOne(req.user.id)
  let userEmail=user.email
// console.log("userEmail",userEmail)
  // let token=await this.zohoBookToken()
  let token=await this.zohoBookTokenFarji()
  let kill
  // let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015092519`, {
    let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015313630`, {
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
  if(kill.code==6041){
    token=await this.zohoBookTokenFarji()
    // let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015092519`, {
    let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015313630`, {
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
  // return kill.salesorders
  // console.log("update",kill)
  }
  if(kill.message=="You are not authorized to perform this operation"){
    token=await this.zohoBookTokenFarji()
    // let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015092519`, {
    let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015313630`, {
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
  // return kill.salesorders
  }
  // return kill.salesorders
  // console.log("kill",kill)
  let orders=[]
  let salesOrder=kill.salesorders
  // console.log("salesOrder",salesOrder)
  if(salesOrder==undefined){
    // return "No Data"
    return []
    // return kill
  }
  // let salesOrder1=salesOrder.filter(item=>item.cf_client_poc_1_email==userEmail||item.cf_client_poc_1_email_unformatted==userEmail||item.cf_client_poc_2_email==userEmail||item.cf_client_poc_2_email_unformatted==userEmail)
  salesOrder=salesOrder.filter(item=>item.cf_client_poc_1==userEmail||item.cf_client_poc_1_unformatted==userEmail||item.cf_client_poc_2==userEmail||item.cf_client_poc_2_unformatted==userEmail||item.cf_client_poc_3==userEmail||item.cf_client_poc_3_unformatted==userEmail)
  if(!(salesOrder.length>0)){
    return "NO_DATA"
  }
  for(let i=0;i<salesOrder.length;i++)
  {
    let id=salesOrder[i].salesorder_id
    console.log("id",id)
    let orderDetails = await this.SalesOrderByID(id)
    // console.log("orderDetails",orderDetails)
    // orders.push({"salesOrder":salesOrder[i],"details":orderDetails})
    salesOrder[i].details=orderDetails
    orders.push(salesOrder[i])

  }
  return orders
}

@Get("zohoBooks-purchaseOrder")
async zohoBookPurchaseOrder(){
  let userEmail="kamran.khan@niyotail.com"
  // let user=await this.userRepository.findOne(req.user.id)
  // let userEmail=user.email
  let token=await this.zohoBookToken()
  let kill
  let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519`, {
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
  if(kill.message=="You are not authorized to perform this operation"){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519`, {
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
  // return kill.purchaseorders
  }
  // return kill.purchaseorders
  let orders=[]
  // console.log("kill",kill)
  let purchaseOrder=kill.purchaseorders
  // console.log("purchaseOrder",purchaseOrder)
  // purchaseOrder=purchaseOrder.filter(item=>item.cf_client_poc_1_email==userEmail||item.cf_client_poc_1_email_unformatted==userEmail||item.cf_client_poc_2_email==userEmail||item.cf_client_poc_2_email_unformatted==userEmail)

  for(let i=0;i<purchaseOrder.length;i++)
  {
    let id=purchaseOrder[i].purchaseorder_id
    let orderDetails = await this.PurchaseOrderByID(id)
    // console.log("orderDetails",orderDetails)
    purchaseOrder[i].details=orderDetails
    orders.push(purchaseOrder[i])
  }
  return orders

}


async SalesOrderByID(id){
  // let token=await this.zohoBookToken()
  let token=await this.zohoBookTokenFarji()

  let kill

  // let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
  let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015313630`, {
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
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."){
    token=await this.zohoBookTokenFarji()
    let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
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
  return kill.salesorder
  }
  return kill.salesorder
}



@Get("zohoBooks-salesOrder/:id")
async zohoBookSalesOrderByID(@Param('id') id: string) {
  let token=await this.zohoBookToken()
  let kill

  let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015313630`, {
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
  if(kill.message=="You are not authorized to perform this operation"){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015313630`, {
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
  return kill.salesorder
  }
  return kill.salesorder
}


async PurchaseOrderByID(id){
    let token=await this.zohoBookToken()
    let kill
  
    let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
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
    if(kill.message=="You are not authorized to perform this operation"){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
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
    return kill.purchaseorder
    }
    return kill.purchaseorder
}

@Get("zohoBooks-purchaseOrder/:id")
async zohoBookPurchaseOrderByID(@Param('id') id: string) {
  let token=await this.zohoBookToken()
  let kill

  let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
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
  if(kill.message=="You are not authorized to perform this operation"){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders/${id}?organization_id=60015313630`, {
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
  return kill.purchaseorder
  }
  return kill.purchaseorder
}


@Get("salesOrder-save-to-prodo")
async zohoInventorySalesOrderSave(){
  let token=await this.zohoBookTokenFarji()
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
  if(kill.code==6041){
    token=await this.zohoBookTokenFarji()
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
  console.log("update",kill)
  }
  if(kill.message=='You are not authorized to perform this operation'||kill.code==57||kill.code==6041){
    token=await this.zohoBookTokenFarji()
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
  }
  let orders=[]
  let salesOrder=kill.salesorders
  if(salesOrder==undefined){
    console.log("No Data-in main")
    return []
  }
  if(!(salesOrder.length>0)){
    return "NO_DATA"
  }
  for(let i=0;i<salesOrder.length;i++)
  {
    let id=salesOrder[i].salesorder_id
    // let currentTime = new Date();     
    // let currentTime1 = currentTime.toLocaleTimeString();
    // console.log("Time Before ",currentTime1)
    let orderDetails = await this.InventorySalesOrderByID(id)
    // let currentTime2 = new Date();
    // let currentTime3 = currentTime2.toLocaleTimeString();
    // console.log("Time After ",currentTime3)
    //difference in time
    // let timeDiff = currentTime2.getTime() - currentTime.getTime();
    // let diffInSeconds = Math.round(timeDiff / 1000);
    // console.log("Time Take for one order ",diffInSeconds)
    salesOrder[i].details=orderDetails
    let data={
      orderDetails:salesOrder[i],
      zohoId:salesOrder[i].salesorder_id
    }
    let k = await this.zohoSalesOrderRepository.findOne({ zohoId: salesOrder[i].salesorder_id });
    if(k){
      let id=k.id
      // orders.push(data)
      orders.push(await this.zohoSalesOrderRepository.update(id,data))
    }
    else{
    orders.push( await this.zohoSalesOrderRepository.save(data))
    // orders.push(data)
    }
  }
  return orders
}


@Get("salesOrder-connect-poc")
async conectPoc(){
  let token=await this.zohoBookTokenFarji()
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
  if(kill.code==6041){
    token=await this.zohoBookTokenFarji()
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
  // console.log("update",kill)
  }
  if(kill.message=='You are not authorized to perform this operation'||kill.code==57||kill.code==6041){
    token=await this.zohoBookTokenFarji() 
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
  }
  let orders=[]
  let salesOrder=kill.salesorders
  if(salesOrder==undefined){
    return []
  }
  if(!(salesOrder.length>0)){
    return "NO_DATA"
  }
  for(let i=0;i<salesOrder.length;i++)
  {
    let id=salesOrder[i].salesorder_id
    let k = await this.zohoSalesOrderRepository.findOne({ zohoId: id });
    // console.log("order",k,id)
    if(k){
      // let id=k.id
      orders.push(await this.updatePocOnSalesOrder(id,salesOrder[i]))
      // console.log("to admin",await this.addordersToAdmin(id))
    }
    else{
    orders.push( `order not found ${salesOrder[i].salesorder_id}`)
    }
  } 
  return orders
}

async addordersToAdmin(id){ 
  let order=await this.zohoSalesOrderByUserRepository.findOne('62e96b5037a104c778675a7b');
  // console.log("order",order)
  order.orderIds.push(id)
  // return order
  return await this.zohoSalesOrderByUserRepository.update('62e96b5037a104c778675a7b',order)
}

async updatePocOnSalesOrder(id,salesOrder){
  // console.log("id",id,salesOrder)
  let res =[]
   let cf_1_email=salesOrder.cf_client_poc_1_email?(salesOrder.cf_client_poc_1_email==""?"NA":salesOrder.cf_client_poc_1_email):"NA"
    let cf_2_email=salesOrder.cf_client_poc_2_email?(salesOrder.cf_client_poc_2_email==""?"NA":salesOrder.cf_client_poc_2_email):"NA"
    let cf_3_email=salesOrder.cf_client_poc_3_email?(salesOrder.cf_client_poc_3_email==""?"NA":salesOrder.cf_client_poc_3_email):"NA"
    let cf_4_email=salesOrder.cf_client_poc_4_email?(salesOrder.cf_client_poc_4_email==""?"NA":salesOrder.cf_client_poc_4_email):"NA"
    if(cf_1_email!="NA"){
      let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_1_email})
      if(userdata){
        if(userdata.orderIds.includes(id)){
          userdata.orderIds = [...new Set(userdata.orderIds)];
          res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
        else{
        userdata.orderIds.push(id)
        res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
      }
      else{ 
        let kill={
          email:cf_1_email,
          orderIds:[id]
        }
        // return kill
        res.push(await this.zohoSalesOrderByUserRepository.save(kill))
      }
    }
    if(cf_2_email!="NA"){
      let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_2_email})
      if(userdata){
        if(userdata.orderIds.includes(id)){
          userdata.orderIds = [...new Set(userdata.orderIds)];
          res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
        else{
        userdata.orderIds.push(id)
        res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
      }
      else{
        let kill={
          email:cf_2_email,
          orderIds:[id]
        }
        // return kill

        res.push(await this.zohoSalesOrderByUserRepository.save(kill))
      }
    }
    if(cf_3_email!="NA"){
      let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_3_email})
      if(userdata){
        if(userdata.orderIds.includes(id)){
          userdata.orderIds = [...new Set(userdata.orderIds)];
          res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
        else{
        userdata.orderIds.push(id)
        res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
      }
      else{
        let kill={
          email:cf_3_email,
          orderIds:[id]
        }
        // return kill
        res.push(await this.zohoSalesOrderByUserRepository.save(kill))
      }
    }
    if(cf_4_email!="NA"){
      let userdata=await this.zohoSalesOrderByUserRepository.findOne({email:cf_4_email})
      if(userdata){
        if(userdata.orderIds.includes(id)){
          userdata.orderIds = [...new Set(userdata.orderIds)];
          res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
        else{
        userdata.orderIds.push(id)
        res.push(await this.zohoSalesOrderByUserRepository.update(userdata.id,userdata))
        }
      }
      else{
        let kill={
          email:cf_4_email,
          orderIds:[id]
        }
        // return kill
        res.push(await this.zohoSalesOrderByUserRepository.save(kill))
      }
      
    }
    return res
}




@UseGuards(JwtAuthGuard)
@Get("zohoInventory-salesOrder")
async zohoInventorySalesOrder(@Request() req){
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
    let Ids=[]
    // let ui=[]
    // const query = {
    //   where: {
    //     $or: [
    //       ...attrFilter
    //     ]
    //   }
    // }
    let salesOrder_list= salesOrder_list1[0].orderIds
      for(let j=0;j<salesOrder_list.length;j++){
        // let Ac_id = ObjectID;
       let  Ac_id = salesOrder_list[j];
        // Ids.push(Ac_id)
        // console.log(salesOrder_list[j],Ac_id,typeof Ac_id)
        // let order=await this.zohoSalesOrderRepository.find()
        // let order=await this.zohoSalesOrderRepository.find({where:{"zohoId":`914673000000544103`}})
        // return order
        // let order=await this.zohoSalesOrderRepository.find({where:{_id:`ObjectId('${Ac_id}')`}})
        // let order=await this.zohoSalesOrderRepository.find({where:{id:'62e91b5c2fdf7c310ad97116'}})
        // console.log(order.length)
        // return order

        // if(order.length>0){
        //   ui.push(order[0])
        // }
        // let rt=await this.zohoSalesOrderRepository.findOne(Ac_id)
        // console.log("sales-data",rt)
        attrFilter.push({"zohoId":Ac_id})

      } 
    const query = {
      where: {
        $or: [
          ...attrFilter
        ]
      }
    }
    // const query = {
    //   where:  [
    //       ...attrFilter
    //     ]
    // }
    // console.log('query', query)
    // let ui=await getMongoRepository(zohoSalesOrder).find({ where: { id: In(Ids)} });
    // let ui=await this.zohoSalesOrderRepository.findBy({ where: { id: In(Ids)} });
  let ui = await this.zohoSalesOrderRepository.find(query);
    // console.log('ui', ui)

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

@Get('zohoInventory-salesOrder-invoice/:id')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename=Invoice.pdf')
async order_invoice(@Param('id') id: string
@Response() res1: any
): Promise<Buffer>{
  // let token=await this.zohoBookToken()
  let token=await this.zohoBookTokenFarji()
  
  let kill
  // console.log("id",id)

  // let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
  let res = await fetch(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
      'Accept':'application/pdf'
    }
  })

  .then(data=>
      kill=data.body
  );
  // console.log("file",kill)
  kill.pipe(res1)
return res1
  // let k = await createReadStream(`./src/sms/file.pdf`);
  // k.pipe(res1);
  // console.log("k",k)
  // return res1
  }

  @Get('zohoInventory-salesOrder-summary/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf')
  async order_summery(@Param('id') id: string
  @Response() res1: any
  ): Promise<Buffer>{
    let token=await this.zohoBookTokenFarji()
    let kill
    // let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
      }
    })
    .then(data=>
        kill=data.body
    );
    kill.pipe(res1)
    return res1
    }
    @Get('zohoInventory-salesOrder-package/:id')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=Package.pdf')
    async order_package(@Param('id') id: string
    @Response() res1: any
    ): Promise<Buffer>{
      let token=await this.zohoBookTokenFarji()
      let kill
      let res = await fetch(`https://inventory.zoho.in/api/v1/packages/print?organization_id=60015092519&package_ids=${id}`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
        }
      })
      .then(data=>
          kill=data.body
      );
      kill.pipe(res1)
      return res1
      }

    // https://inventory.zoho.in/api/v1/packages/print?organization_id=60015313630&package_ids=930869000000116042
    //make same endpoint for following 
   // https://books.zoho.in/api/v3/bills/${id}?organization_id=60015313630
   @Get('zohoInventory-salesOrder-bill/:id')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=Bill.pdf')
    async order_bill(@Param('id') id: string
    @Response() res1: any
    ): Promise<Buffer>{
      let token=await this.zohoBookTokenFarji()
      let kill
      let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
        }
      })
      .then(data=>
          kill=data.body
      );
      kill.pipe(res1)
      return res1
      }
      @Get('zohoInventory-salesOrder-po/:id')
      @Header('Content-Type', 'application/pdf')
      @Header('Content-Disposition', 'attachment; filename=po.pdf')
      async order_po(@Param('id') id: string
      @Response() res1: any
      ): Promise<Buffer>{
        let token=await this.zohoBookTokenFarji()
        let kill
        let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}/attachment?organization_id=60015092519`, {
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`,
            'Accept':'application/pdf'
          }
        })
        .then(data=>
            kill=data.body
        );
        kill.pipe(res1)
        return res1
        }
    @Post('zohoInventory-salesOrder-create')
    @UseGuards(JwtAuthGuard)
    async create_order(@Body() body: any,@Request() req): Promise<any>{
      let orders=body
      // return orders
      let line_items=[]
      for(let i=0;i<orders.length;i++){
        let order1=orders[i]
        line_items.push({
          "item_id":order1.item_id,
          "quantity": order1.qty,
          "rate":order1.price,
          "description":order1.description
       })
      }
      let order=orders[0].salesorder
      // console.log("order",order)
      let customer_id=orders[0].customer_id
      let salesperson_name=order.salesperson_name
      // let line_items=body.line_items
      let custom_fields=[]

      if(Object.keys(order).includes("cf_client_poc_1_email")){
        custom_fields.push({
          "api_name": "cf_client_poc_1_email",
          "value": order.cf_client_poc_1_email
        })
      }
      if(Object.keys(order).includes("cf_client_poc_2_email")){
        custom_fields.push({
          "api_name": "cf_client_poc_2_email",
          "value": order.cf_client_poc_2_email
        })
      }
      if(Object.keys(order).includes("cf_client_poc_3_email")){
        custom_fields.push({
          "api_name": "cf_client_poc_3_email",
          "value": order.cf_client_poc_3_email
        })
      }
      if(Object.keys(order).includes("cf_client_poc_4_email")){
        custom_fields.push({
          "api_name": "cf_client_poc_4_email",
          "value": order.cf_client_poc_4_email
        })
      }
      let salesOrder= 
        {
          "customer_id":customer_id,
          "salesperson_name": salesperson_name,
          "custom_fields": custom_fields,
          "notes": "Created from Prodo Website",
          "line_items": line_items
     }
      let token=await this.zohoBookTokenFarji()
      let kill
      let res = await fetch(`https://books.zoho.in/api/v3/salesorders?organization_id=60015092519`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/json'
        },
        //convert body to pARSE
        body:JSON.stringify(salesOrder)
      })
      .then(res=> res.json())
      .then(data=>
          kill=data
      );
      // console.log("res",kill)
      // return res
      if(kill.message=="Sales Order has been created."){
        let saveOrderId=kill.salesorder.salesorder_id
        // console.log(await this.saveReOrder(saveOrderId,kill.salesorder))
        return {"status":"success","message":"Order created successfully","order":kill.salesorder}
        // return HttpResponse({"status":"success","message":"Order created successfully","order":kill.salesorder})
      }
      else{
        // return {"status":"error","message":"Order not created","response":kill,statusCode:500}
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Forbidden',
          message: "Order not created"
        }, HttpStatus.INTERNAL_SERVER_ERROR);
        
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
  

  async reOrderDetails(salesOrder){
    if(salesOrder==undefined){
      console.log("No details found")
      return []
    }
      let lineItems2=salesOrder.line_items
      let k=salesOrder.packages
      let packages={}
      for(let ii=0;ii<lineItems2.length;ii++){
        lineItems2[ii].package_id=[]
        lineItems2[ii].status="Order Received"
      }
        salesOrder.line_items=lineItems2
        salesOrder.package_list=packages
        return salesOrder
  }


  async saveReOrder(id,sales){
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
    // console.log("kill",kill)
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
      let orderDetails = await this.reOrderDetails(sales)
      salesOrder[i].details=orderDetails
      let data={
        orderDetails:salesOrder[i],
        zohoId:id
      }
      let ui=await this.zohoSalesOrderRepository.save(data)
      await this.updatePocOnSalesOrder(ui.id,ui.orderDetails)
      orders.push(ui)
      } 
    }
    return orders
  }

@Get("sync-pimcore-zohoBooks") 
async schedule() {
  await this.zohoBooks()
  console.log("items updated"); 
setTimeout(async () => {
  this.schedule()
  }, 7200000);  
}

@Get('dashboard-data')
@UseGuards(JwtAuthGuard)
async all_data(@Request() req) {
  let k = await this.userService.userdashboardData(req.user)
  if(k=="NA"){
     let orders=await this.zohoInventorySalesOrder(req)
    //  console.log("orders",orders)
     let res=await this.userService.calDashboardData(req.user,orders)
     return res.data
  }
  else{
    return k
  }
}

@Get('sync-dashboard-data')
async all_data1() {
  // return "hello"
  let out=[]
    let k = await this.userService.allDashboardData()
    // return k
    for(let i=0;i<k.length;i++){ 
      let id=k[i].userId.toString()  
      let user= await this.userService.findOne(id)
      // console.log("user",id,user)
      let req={
        user:user  
      }
    let orders=await this.zohoInventorySalesOrder(req)
    console.log("orders")
    out.push(await this.userService.calDashboardData(req.user,orders))
  console.log("hello sync3 out")

    }
    return out  
}
@Post('sales-order-update')
async updateSalesOrder(@Body() body) { 
  let currentTime = new Date();     
  let currentTime1 = currentTime.toLocaleTimeString();
  console.log("currentTime",currentTime1)
  // return body
  let id = body.salesorder?(body.salesorder.salesorder_id?body.salesorder.salesorder_id:"false"):"false"
  return id
}

}