import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { zohoPurchaseOrder } from './zohoPurchaseOrder.entity';
import { UserService } from './../users/user.service';
import { zohoToken } from './../sms/token.entity';
import { ProductService } from './../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { entitiesService } from './../entities/entities.service';
import { OrganizationService } from "./../organization/organization.service";
import { companyService } from "./../company/company.service";
import fetch from 'node-fetch'





@Injectable()
export class zohoPurchaseOrderService {
  constructor(
    @InjectRepository(zohoPurchaseOrder)
    private readonly zohoPurchaseOrderRepository: Repository<zohoPurchaseOrder>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly entitiesService: entitiesService,
    private readonly organizationService: OrganizationService,
    private readonly companyService: companyService,

) { }

async findAll(query?:any){
    if(query){
      console.log(query)
      let data=await this.zohoPurchaseOrderRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    }
    else {
      let data=await this.zohoPurchaseOrderRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }

async zohoBookToken(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
    if(!zohoToken){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'Token not found',
        message: "Unverified",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    let token=zohoToken.token
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
    token=await this.newZohoBookToken()
    return token
    }
    return token
  }


async newZohoBookToken(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
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
  await this.zohoTokenRepository.update(zohoToken.id,zohoToken)
  return token
  }


async InventoryPorByID(id:any){
    let token=await this.zohoBookToken()
    let kill
    let salesOrder
    let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
      token=await this.zohoBookToken()
      let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
    salesOrder=kill.purchaseorder
    if(salesOrder==undefined){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at inventory purchase order ',
        response:kill,
        message: "Zoho token issue contact admin Or check your id again ",
      }, HttpStatus.UNAUTHORIZED);
    }
    return salesOrder
    }



async customerDetails(id:any){
    let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
      
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
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
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
    
    let contact=kill.contact
    if(contact){
       return contact
    }
    else{
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at inventory sales order',
        message: "Zoho token issue contact admin",
      }, HttpStatus.UNAUTHORIZED);
    }

  }


async zohoAllPo(page?:number){
    if(!page){
        page=1
      }
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders?organization_id=60015092519&page=${page}`, {
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
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015092519."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders?organization_id=60015092519&page=${page}`, {
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
  let purchaseorders=kill.purchaseorders
  if(purchaseorders==undefined){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data found in zoho',
      message: "Not Found Data",
    }, HttpStatus.NOT_FOUND);
  }
//   if(!(purchaseorders.length>0)){
//     throw new HttpException({
//       status: HttpStatus.NOT_FOUND,
//       error: 'No data found in zoho',
//       message: "Not Found Data",
//     }, HttpStatus.NOT_FOUND);
//   }

  return {count:purchaseorders.length,data:purchaseorders}
}



async saveZohoPurchaseOrder(salesOrder:zohoPurchaseOrder){
  let find=await this.zohoPurchaseOrderRepository.findOne({where:{purchaseorder_id:salesOrder.purchaseorder_id}})
  if(find){
    console.log("updating old po")
    salesOrder.createdAt=find.createdAt?find.createdAt:(salesOrder.createdAt?salesOrder.createdAt:new Date())
    salesOrder.id=find.id
    return await this.zohoPurchaseOrderRepository.save(salesOrder) 
    // return salesOrder
  }
  else{
    console.log("saving new po")
    return await this.zohoPurchaseOrderRepository.save(salesOrder)
    // return salesOrder
  }
}


async saveFromZohoId(id:any){
    let so = await this.InventoryPorByID(id)
    return await this.saveZohoPurchaseOrder(so)   
  }


async getAttachment(orderId:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders/${orderId}/attachment?organization_id=60015092519`, {
      method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'*/*'
          }
        })
      .then(data=>
      kill=data.body
       );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders/${orderId}/attachment?organization_id=60015092519`, {
        method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'*/*'
          }
        })
      .then(data=>
      kill=data.body
       );
      }
    if(kill.code==5){
      throw new HttpException({ 
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'TOKEN issue',
        message: "Attachment not found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    return kill
}

async OrderSummary(id:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
      }
    if(kill.code==5){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'TOKEN issue',
        message: "summery not found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    return kill
}




}
