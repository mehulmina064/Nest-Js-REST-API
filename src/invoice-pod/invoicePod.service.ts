import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { invoicePod } from './invoicePod.entity';
import fetch from 'node-fetch'
import {HttpException,HttpStatus } from '@nestjs/common';


@Injectable()
export class invoicePodService {
  constructor(
    @InjectRepository(invoicePod)
    private readonly invoicePodRepository: Repository<invoicePod>,
) { }

async findInvoiceDetails(token:any,invoiceId:any) {
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/invoices/${invoiceId}?organization_id=60015092519`, {
  
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
    if(kill.invoice)
    {
      return kill.invoice

    }
    else{
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'No data found in zoho',
        Response:kill,
        message: "Not Found invoice on this ida",
      }, HttpStatus.NOT_FOUND);
    }
    
 }
 async  checkInvoicePod(invoiceId:any) {
    // console.log(invoiceId)
    let invoicePod=await this.invoicePodRepository.findOne({where:{zohoInvoiceId:invoiceId}})
    if(invoicePod){
        // console.log(invoicePod)
        if(invoicePod.validity>=2){
        return {message:" POD Link Expired ",status:400}
        }
        else {
        return {message:" POD Link Valid ",status:200}
        }
    }
    else {
        return {message:" POD Link Valid ",status:200}
    }
    
 }

 async saveDigitalPod(pod:any,token:any){
      let invoicePod=await this.invoicePodRepository.findOne({where:{zohoInvoiceId:pod.zohoInvoiceId}})
      if(invoicePod){
        if(invoicePod.validity>=2){
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Forbidden',
                message: " POD Link Expired "
              }, HttpStatus.FORBIDDEN);
        }
        else{
          pod.validity=invoicePod.validity+1
          await this.invoicePodRepository.update(invoicePod.id,pod)
          await this.savePodToZohoInventory(pod,token)
          return {message:"Successfully Submmited POD",status:"200"}
        }
      }
      else {
        pod.validity=1
        await this.savePodToZohoInventory(pod,token)
        return await this.invoicePodRepository.save(pod)
      }
 }

 async saveSignaturePod(pod:any,token:any){
    let invoicePod=await this.invoicePodRepository.findOne({where:{zohoInvoiceId:pod.zohoInvoiceId}})
    if(invoicePod){
      if(invoicePod.validity >= 2){
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: " POD Link Expired "
          }, HttpStatus.FORBIDDEN);
      }
      else{
        pod.validity=invoicePod.validity+1
        await this.invoicePodRepository.update(invoicePod.id,pod)
        await this.savePodToZohoInventory(pod,token)
        return {message:"Successfully Submmited POD",status:200}
      }
    }
    else {
      pod.validity=1
      await this.savePodToZohoInventory(pod,token)
      return await this.invoicePodRepository.save(pod) 
    } 
}

//save pod for invoice in zoho inventory custom module POD
async savePodToZohoInventory(pod:any,token:any){
    // console.log("in function")
    let out={
        "record_name":`POD-${pod.zohoInvoiceId}`,
        "cf_invoice_number":pod.zohoInvoiceId,
        "cf_location":pod.podLocation?pod.podLocation:"",
        "cf_pod_type":"Digital Signature with Receiver Photo",
        "cf_pod_1":pod.pod1?pod.pod1:"",
        "cf_pod_2":pod.pod2?pod.pod2:"",
        "cf_other_attachment_link_1":pod.otherAttachmentLinks[0]?pod.otherAttachmentLinks[0]:"",
        "cf_other_attachment_link_2":pod.otherAttachmentLinks[1]?pod.otherAttachmentLinks[1]:"",
        "cf_other_attachment_link_3":pod.otherAttachmentLinks[2]?pod.otherAttachmentLinks[2]:"",
        "cf_other_attachment_link_4":pod.otherAttachmentLinks[3]?pod.otherAttachmentLinks[3]:"",
        "cf_other_attachment_link_5":pod.otherAttachmentLinks[4]?pod.otherAttachmentLinks[4]:"",
    }
     if(pod.podType=="Digital"){
        out.cf_pod_type="Digital Signature with Receiver Photo"
    }
    else{
        out.cf_pod_type="Signed Invoice"
    }
    let zoho1 = await fetch('https://inventory.zoho.in/api/v1/cm_pod?organization_id=60015092519', {
        method: 'POST',
        headers:{
          'Authorization':`${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Content-Length':'904' 
        },    
        body:JSON.stringify(out)
      });
      zoho1=await zoho1.text() 
      zoho1=JSON.parse(zoho1)
    //   console.log(zoho1)
      return zoho1
}


// renewPodLink
async renewPodLink(zohoInvoiceId:any){
    let invoicePod=await this.invoicePodRepository.findOne({where:{zohoInvoiceId:zohoInvoiceId}})
    if(invoicePod){
        invoicePod.validity=0
        await this.invoicePodRepository.update(invoicePod.id,invoicePod)
        return {message:"Successfully renewed POD Link",status:200}
    }
    else{
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: " No POD Link Exist "
          }, HttpStatus.FORBIDDEN);
    }

}

//get all invoice pods for zohoSalesOrder id
async getInvoicePods(zohoInvoiceId:any){
    let invoicePod=await this.invoicePodRepository.find({where:{zohoInvoiceId:zohoInvoiceId}})
    // console.log(invoicePod,"invoice")
    if(invoicePod.length>0){
      return invoicePod
    }
    else{
      return []
    }
 }

}
