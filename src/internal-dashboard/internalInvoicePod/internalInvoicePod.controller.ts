import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { SmsService} from '../../sms/sms.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../../users/user.service';
import { zohoToken } from '../../sms/token.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';





import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';

import fetch from 'node-fetch'

var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import console = require('console');
import { invoicePodService } from './internalInvoicePod.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';


@Controller('internal/InvoicePod')
export class invoicePodController {
  constructor( 
  @InjectRepository(zohoToken)
  private readonly zohoTokenRepository: Repository<zohoToken>,
  private readonly invoicePodService: invoicePodService,
  private readonly zohoEmployeeService:zohoEmployeeService,
  ) { }

  @Get()
  async find() {
    return await this.invoicePodService.findAll()
  }

  @UseGuards(IJwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  // @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  @Query('isEmployee',new DefaultValuePipe('NA')) isEmployee: string="NA",

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
      if(isEmployee!="NA"){
        if(isEmployee=="true"){
          attrFilter.push({
            "isEmployee": true
          })
        }else{
          attrFilter.push({
            "isEmployee": false
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { contactNumber: { $regex: search, $options: 'i' } },
              { designation: { $regex: search, $options: 'i' } },
              { dateOfBerth: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { zohoUserId: { $regex: search, $options: 'i' } }, 
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
                { contactNumber: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { dateOfBerth: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { zohoUserId: { $regex: search, $options: 'i' } }, 
              ]
            }
          }
      }
    //  return query
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      result = await this.zohoEmployeeService.findAll(query)  
      result.data = result.data.slice(start, end) 
      return {statusCode:200,message:"All Employees",count:result.count,limit:limit,page:page,data:result.data}
    }
    else {
      // return query
        result = await this.zohoEmployeeService.findAll(query)  
        result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Employees",count:result.count,limit:limit,page:page,data:result.data}
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

  @Get('details/:zohoInvoiceId')
  async findOne(@Param('zohoInvoiceId') id: string) {
    let checkInvoicePod = await this.invoicePodService.checkInvoicePod(id)
    if(checkInvoicePod.status==400){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: "Link Is Expired"
          }, HttpStatus.FORBIDDEN);
    }
    let token=await this.newZohoBookTokenFarji()
    // console.log(token)
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
  
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
    //   console.log(kill)
    if(kill.invoice){
    return kill.invoice
    }
    else{
        throw new NotFoundException(`Invoice with id ${id} not found`);
    }

  }

  @Post('uploadPod/:zohoInvoiceId')
  async savePod(@Param('zohoInvoiceId') id: string,@Body() body:any){
    let token=await this.newZohoBookTokenFarji()
    body.zohoInvoiceId=id
    if(!body.podType){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: "Please Provide Type Of POD "
          }, HttpStatus.FORBIDDEN);
    }
    if(!body.pod1){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: "Please Provide at least one POD "
          }, HttpStatus.FORBIDDEN);
    }
    if(!body.zohoSalesOrderId){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: " Please Provide Sales Order Id "
          }, HttpStatus.FORBIDDEN);
    }
    if(!body.podLocation){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: " Please Provide Your Current Location "
          }, HttpStatus.FORBIDDEN);
    }
    if(body.validity){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: " Validity cannot be changed "
          }, HttpStatus.FORBIDDEN);
        // return {message:" Validity cannot be changed ",status:400}
    }
    if(body.podType=="Digital"){
       return await this.invoicePodService.saveDigitalPod(body,token)
    //    return body
    }
    else if(body.podType=="Signed"){
        if(!body.signatureFile){
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Forbidden',
                message: " Please Provide Your Signature "
              }, HttpStatus.FORBIDDEN);
            // return {message:" Please Provide Your Signature ",status:400}
        }
        return await this.invoicePodService.saveSignaturePod(body,token)
        // return body
    }
    else{
        return {message:"Please Provide Correct Type Of POD ",status:400}
    }
  }

  @Post('renewPodLink/:zohoInvoiceId')
  async renewPodLink(@Param('zohoInvoiceId') id: string){
     return await this.invoicePodService.renewPodLink(id)

  }


async zohoBookTokenFarji(){//plus inventory token also
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
          // 'refresh_token':'1000..e2111ac503bb18b8f3d83ba341140a50',
          'refresh_token':'1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
          // 'client_id':'1000.',
          'client_id':'1000.',
          // 'client_secret':'',
          'client_secret':'',
  
          'grant_type': 'refresh_token' 
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
  
  
}