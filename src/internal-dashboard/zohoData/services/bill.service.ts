import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { zohoBill } from '../../../zohoBill/zohoBill.entity';
import { zohoToken } from '../../../sms/token.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'


@Injectable()
export class internalBillService {
  constructor(
    @InjectRepository(zohoBill)
    private readonly zohoBillRepository: Repository<zohoBill>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,

) { }

async findAll(query?:any){ 
    if(query){
      console.log(query)
      let data=await this.zohoBillRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    }
    else {
      let data=await this.zohoBillRepository.findAndCount()
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
          'refresh_token':'1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',//Mehul
          'client_id':'1000.IX5LZETFZ78PTGVDPZSRT5PL6COE5H',
          'client_secret':'',
          'grant_type': 'refresh_token' 
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


async InventoryByID(id:any){
    let token=await this.zohoBookToken()
    let kill
    let bill
    let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
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
      let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
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
    bill=kill.bill
    if(bill==undefined){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at inventory purchase order ',
        response:kill,
        message: "Zoho token issue contact admin Or check your id again ",
      }, HttpStatus.UNAUTHORIZED);
    }
    return bill
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


async zohoAll(page?:number){
    if(!page){
        page=1
      }
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://books.zoho.in/api/v3/bills?organization_id=60015092519&page=${page}`, {
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
    let res = await fetch(`https://books.zoho.in/api/v3/bills?organization_id=60015092519&page=${page}`, {
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
  let bills=kill.bills
  if(bills==undefined){
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

  return {count:bills.length,data:bills}
}



async saveZohoPurchaseBill(zohoBill:zohoBill){
  let find=await this.zohoBillRepository.findOne({where:{bill_id:zohoBill.bill_id}})
  if(find){
    console.log("updating old bill")
    zohoBill.createdAt=find.createdAt?find.createdAt:(zohoBill.createdAt?zohoBill.createdAt:new Date())
    zohoBill.id=find.id
    return await this.zohoBillRepository.save(zohoBill) 
    // return salesOrder
  }
  else{
    console.log("saving new bill")
    return await this.zohoBillRepository.save(zohoBill)
    // return salesOrder
  }
}


async saveFromZohoId(id:any){
    let bill = await this.InventoryByID(id)
    return await this.saveZohoPurchaseBill(bill)   
  }


async getAttachment(orderId:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://books.zoho.in/api/v3/bills/${orderId}/attachment?organization_id=60015092519`, {
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
      let res = await fetch(`https://books.zoho.in/api/v3/bills/${orderId}/attachment?organization_id=60015092519`, {
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

async Summary(id:any){
  let token=await this.zohoBookToken()
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
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
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
