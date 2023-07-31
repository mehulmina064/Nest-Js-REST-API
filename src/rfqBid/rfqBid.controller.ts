import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { rfqBidService } from './rfqBid.service';
import {HttpException,HttpStatus } from '@nestjs/common'; 
import {  NotFoundException } from '@nestjs/common';

@Controller('rfqBid')
export class rfqBidController {
  constructor(private readonly rfqBidService: rfqBidService) {}
 
  
  @Get()
  async getAll() { 
    return await this.rfqBidService.getAll()
  }
  @Get('manufacturers')
  async getManufacturersSheetDetails() { 
    return await this.rfqBidService.getManufacturersDetails()
  }

  @Post('Send-Mail-Manufacturers-Survey')
  async sendMailManufacturersSurvery(){
    return await this.rfqBidService.sendMailManufacturersSurvery()
  }

  @Post('Send-Mail-Manufacturers')
  async sendMailManufacturersWithTemplate(@Body() body:any){
    if(!body.templateName){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide template Name"
      }, HttpStatus.BAD_REQUEST);
    }
    if(!body.subject){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide subject "
      }, HttpStatus.BAD_REQUEST);
    }
    return await this.rfqBidService.sendMailManufacturersWithTemplate(body.templateName,body.subject)
  }


  @Post('Send-Whatsapp-Manufacturers')
  async sendWhatsappMessaageManufacturersWithTemplate(@Body() body:any){
    if(!body.templateName){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide template Name"
      }, HttpStatus.BAD_REQUEST);
    }
    if(!body.image_link){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide image_link "
      }, HttpStatus.BAD_REQUEST);
    }
    return await this.rfqBidService.sendWhatsappMessaageManufacturersWithTemplate(body.templateName,body.image_link)
  }

  @Get('allRfqs')
  async getAllRfqDetails(){
    return await this.rfqBidService.getAllRfqDetails()
  }
  @Get('crmAllRfqBids')
  async getAllRfqBidsDetails(){
    return await this.rfqBidService.getAllRfqBidsDetails()
  }



  @Get('crmOneRfqBid')
  async getOneRfqBidsDetails(@Body('id') id : string){
    return await this.rfqBidService.getOneRfqBidsDetails(id)
  }

  @Post('getAnySheet')
  async getAnySheetDetails(@Body('id') id : string,@Body('range') range: string) {
    if(id&&range){
        return await this.rfqBidService.getAnySheetDetails(id,range);
    } 
    else{
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'BAD_REQUEST',
            message: "Please Provide Correct Data of id,range"
          }, HttpStatus.BAD_REQUEST);
    }
  }



  @Get('rfq/:id')
  async RfqDetails(@Param('id') id: string) {
    id="352461"+id
    return await this.rfqBidService.RfqDetails(id)
   }

  @Get(':id')
  async getRfqDetails(@Param('id') id: string) {
    id="352461"+id 
    return await this.rfqBidService.RfqDetails(id)
  }

  @Post(':id')
  async getRfqBidDetails(@Param('id') id: string,@Body() data: any) {
    id="352461"+id 
    let rfq= await this.rfqBidService.RfqDetails(id)
    if(rfq&&data.manufacturePhone&&data.manufactureGstNo&&data.lineItems.length>0){
      delete rfq['message']
      delete rfq['statusCode'] 
      data.rfqId=id
      let sheetSave=await this.rfqBidService.sheetBidSave(rfq,data)
      // return sheetSave
      let formSave=await this.rfqBidService.saveRfqBid(data)
      // return formSave
      return {FormData:formSave,rfqDetails:rfq.data,sheetSaveDetails:sheetSave,statusCode:200,message:"succes"} 
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Fill the at least One Item detail"
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('rfqSheet/:id') 
  async getRfqSheetDetails(@Param('id') id: string) {
   let range="RFQ (BD)"
    return await this.rfqBidService.getRfqSheetDetails(id,range);
  }

  @Post('rfqSendMail/:id')
  async rfqSendToManufacturers(@Param('id') id: string) {
    let rId=id
    id="352461"+id 
    let k= await this.rfqBidService.RfqDetails(id)
    if(k){
    let data= await this.rfqBidService.rfqSendToManufacturers(k.data.lineItems);
    // return data
    let out=[]
    for (const itemData of data) {
    // out.push(itemData)
    out.push({email:await this.rfqBidService.sendMail(itemData,rId)})
    out.push({wahtsapp:await this.rfqBidService.sendWhatsappBid(rId)})
    }
     return out
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Fill the at least One Item detail"
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('whatsapp/Instruction')
  async rfqSendWhstappInstruction(){
    return await this.rfqBidService.sendWhatsappInstruction()
  }

  


}
