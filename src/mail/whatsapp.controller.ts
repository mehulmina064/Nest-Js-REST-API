import { Body, Controller, Delete, Get, Param,Request, Patch, Post,UploadedFile,UseInterceptors, UseGuards, DefaultValuePipe, ParseIntPipe, Query,Header,Response,StreamableFile  } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from './../files/file.utils';
import * as xlsx from 'xlsx';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { UserRole } from './../users/roles.constants';
import { HttpResponse } from 'aws-sdk';
import fetch from 'node-fetch'



@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService,
    ) { }
    @Post("single-line-text")
    async sendText(@Body() body:any) {
        if(!body.contacts){
            return {message:"Please Provide contacts",status:400}
        }
        if(!body.text){ 
            return {message:"Please Provide Text Message",status:400}
        }
        let res=[]
        let contacts=body.contacts
        if(contacts.length>0&&body.text.length>0){
            for(let i=0;i<contacts.length;i++){
               res.push(await this.whatsappService.sendText(body.text,contacts[i]))
            }
        }
        else{
            return {message:"Please Provide contact Details",status:400}
        }
        return {Response:res,message:"Message sent"}
    }

    @Post("multi-line-text")
    async multiText(@Body() body:any) {
        if(!body.contacts){
            return {message:"Please Provide contacts",status:400}
        }
        if(!body.text){
            return {message:"Please Provide Text Message",status:400}
        }
        let res=[]
        let contacts=body.contacts
        if(contacts.length>0&&body.text.length>0){
            for(let i=0;i<contacts.length;i++){
               res.push(await this.whatsappService.sendMultiText(body.text,contacts[i]))
            }
        }
        else{
            return {message:"Please Provide contact Details",status:400}
        }
        return {Response:res,message:"Message sent"}
    }

    @Post("rfqBid")
    async rfqBidMessage(@Body() body: any) {
        let resdata="All messages sent"
        let status = 201
        if(!body.contacts){
            return {message:"Please provide contacts",status:400}
        }
        else if(!(body.contacts.length>0)){
            return {message:"Please provide at least one contact",status:400}
        }
        if(!body.rfqId){
            return {message:"Please provide rfqId",status:400}
        }
        // body.rfqId="352461"+body.rfqId
        body.templateName="rfq_bid_message1"
        let res=[]
        let contacts=body.contacts
        for(let i=0;i<contacts.length;i++){
            let ri
            if(contacts[i].name.split(/\W+/).length > 1){
            return {message:"Please provide only one word name ",status:400}
            }
            if(!contacts[i].contact){
            return {message:`Please provide contact details assosiated with ${contacts[i].name} `,status:400}
            }
            ri=await this.whatsappService.rfqBidMessage(contacts[i].name,contacts[i].contact,body.templateName,body.rfqId)
            if(ri.error&&status==201){
                resdata="error"
                status=400
            }
            res.push(ri)
        }
        return {Response:res,message:resdata,status:status}
    }

    @Post("templateMessage")
    async sendTemplateMessage(@Body() body: any) {
        let resdata="All messages sent"
        let status = 201
        if(!body.contacts){
            return {message:"Please provide contacts",status:400}
        }
        else if(!(body.contacts.length>0)){
            return {message:"Please provide at least one contact",status:400}
        }
        if(!body.templateName){
            return {message:"Please provide template name ",status:400}
        }
        let res=[]
        let contacts=body.contacts
        for(let i=0;i<contacts.length;i++){
            let ri
            if(contacts[i].name.split(/\W+/).length > 1){
            return {message:"Please provide only one word name ",status:400}
            }
            if(!contacts[i].contact){
            return {message:`Please provide contact details assosiated with ${contacts[i].name} `,status:400}
            }
            if(body.document_link){
                ri=await this.whatsappService.sendTemplateMessage(contacts[i].name,contacts[i].contact,body.templateName,body.document_link,body.document_name?body.document_name:"Document",body.image_link?body.image_link:false,body.video_link?body.video_link:false,body.form_link?body.form_link:false)
            }
            // else if(body.image_link){
            //     ri=await this.whatsappService.sendTemplateMessage(contacts[i].name,contacts[i].contact,body.templateName,body.document_link,body.document_name?body.document_name:false,body.image_link?body.image_link:false,body.video_link?body.video_link:false,body.form_link?body.form_link:false)
            // }
            // else if (body.video_link){
            //     ri=await this.whatsappService.sendTemplateMessage(contacts[i].name,contacts[i].contact,body.templateName,body.document_link,body.document_name?body.document_name:false,body.image_link?body.image_link:false,body.video_link?body.video_link:false,body.form_link?body.form_link:false)
            // } 
            // else if (body.form_link){
            //     ri=await this.whatsappService.sendTemplateMessage(contacts[i].name,contacts[i].contact,body.templateName,body.document_link,body.document_name?body.document_name:false,body.image_link?body.image_link:false,body.video_link?body.video_link:false,body.form_link?body.form_link:false)
            // } 
            else {
                ri=await this.whatsappService.sendTemplateMessage(contacts[i].name,contacts[i].contact,body.templateName,body.document_link?body.document_link:false,body.document_name?body.document_name:false,body.image_link?body.image_link:false,body.video_link?body.video_link:false,body.form_link?body.form_link:false)
            }
            if(ri.error&&status==201){
                resdata="error"
                status=400
            }
            res.push(ri)
        }
        return {Response:res,message:resdata,status:status}
    }

    @Post('send-bulk-sheet-manufactures')  /// post request for creating univeral buckets
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './files',
          filename: editFileName
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
          } else {
            cb(null, false);
          }
        }
      }))
   async sendBulkManufacture(@UploadedFile() file:any,@Body('document_link') document_link : any,@Body('document_name') document_name : any) {
        let data = xlsx.readFile(file.path);
        let sheet_name_list = data.SheetNames;
        let contacts = xlsx.utils.sheet_to_json(data.Sheets[sheet_name_list[0]]);
        contacts = await this.whatsappService.formateContacts(contacts)
        // return contacts
        if(contacts){
            contacts.document_link=document_link?document_link:""
            contacts.document_name=document_name?document_name:""
            // return contacts
            return await this.whatsappService.sendBulkManufacture(contacts)
        }
        else{
        return {message:"Please Check Data",status:400}
        }
    }
}
