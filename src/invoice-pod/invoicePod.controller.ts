import { User } from './../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { SmsService} from './../sms/sms.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './../users/user.service';
import { zohoToken } from './../sms/token.entity';
import { Injectable, NotFoundException } from '@nestjs/common';



import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';

import fetch from 'node-fetch'

var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import console = require('console');
import { zohoSalesOrder } from './../sms/zohoSalesOrder.entity';
import {zohoSalesOrderByUser} from './../sms/zohoSalesOrderByUser.entity';
import { ProductService } from './../product/product.service';
import { invoicePodService } from './invoicePod.service';

@Controller('invoice')
export class invoicePodController {
  constructor(  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(zohoToken)
  private readonly zohoTokenRepository: Repository<zohoToken>,
  @InjectRepository(zohoSalesOrder)
  private readonly zohoSalesOrderRepository: Repository<zohoSalesOrder>,
  @InjectRepository(zohoSalesOrderByUser)
  private readonly zohoSalesOrderByUserRepository: Repository<zohoSalesOrderByUser>,
  private readonly userService: UserService,
  private readonly productService: ProductService,
  private readonly invoicePodService: invoicePodService

  
  ) { }

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
          // 'refresh_token':'1000.2866f69cdb2027d6c27493990ed71a0e.e2111ac503bb18b8f3d83ba341140a50',
          'refresh_token':'1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
          // 'client_id':'1000.HXRHTRPDNAVD7Y96GF96AECLE2A1MA',
          'client_id':'1000.IX5LZETFZ78PTGVDPZSRT5PL6COE5H',
          // 'client_secret':'babdacfca5c23a888ef95e0e18d5deb170c91b70a8',
          'client_secret':'a106415659f7c06d2406f446068c1739e81174c2b7',
  
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