import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ManufactureService } from './manufacture.service';
import fetch from 'node-fetch'
import {HttpException,HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manufacture } from './manufacture.entity';


@Controller('manufacture')
export class ManufactureController {
  constructor(private readonly manufactureService: ManufactureService
    ) {}

  @Get()
  async prodoData() {
    let data =await this.manufactureService.findAll()
    if(data){
        return {message:"succes",status:200,data:data}
    }
    else{
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'NOT FOUND',
        message: "NOT FOUND"
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Get("gstVerify/:gstNo")
  async gstVerify(@Param("gstNo") gstNo: string) {

    let data = await this.manufactureService.findByGstNo(gstNo)
    // return data
    if(!data)
    {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'NOT_FOUND',
          message: "Please provide correct GST NO",
        }, HttpStatus.NOT_FOUND);
    }
    else{
      return {message:"succes",status:200,data:data.enrichment_details}
      
    }
  }

  @Get("details/:id")
  async singleManufacturer(@Param('id') id: string) {
    let data =await this.manufactureService.findOne(id)
    return data
  }
 
  @Get("zohoData")
  async zohoData() {
      let data = await this.manufactureService.zohoManufacturerData()
      if(data){
        return {message:"succes",status:200,data:data} 
      }
      else {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "EXPECTATION_FAILED"
        }, HttpStatus.EXPECTATION_FAILED);
      }
  }

  @Get("zohoData/:id")
  async zohosingleData(@Param('id') id: string) {
      let data = await this.manufactureService.singleZohoManufacturerData(id)
      if(data){
        return {message:"succes",status:200,data:data} 
      }
      else {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "EXPECTATION_FAILED"
        }, HttpStatus.EXPECTATION_FAILED);
      }
  }

  @Get("pimcoreData")
  async pimcoreData() {
      let data = await this.manufactureService.pimcoreManufacturerData()
      if(data){
        return {message:"succes",status:200,data:data}
      } 
      else {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "EXPECTATION_FAILED"
        }, HttpStatus.EXPECTATION_FAILED);
      }
  }

  @Post('singlePostToZoho')
  async saveManufacturerToZohoBooks(@Body() data:any){
    return await this.manufactureService.saveManufacturerToZohoBooks(data)
  }

  @Patch("zohoData/:id")
  async updateManufacturerToZohoBooks(@Param('id') id: string,@Body() data:any) {
    return await this.manufactureService.updateManufacturerToZohoBooks(data,id)
  }

  @Post('saveToProdo')
  async saveToProdo(){
    let data = await this.manufactureService.pimcoreManufacturerData()
    return await this.manufactureService.saveToProdo(data)
  }

  @Post('saveToZoho')
  async saveToZoho(){
    let data = await this.manufactureService.findAll()
    return await this.manufactureService.saveToZoho(data)
  }


}
