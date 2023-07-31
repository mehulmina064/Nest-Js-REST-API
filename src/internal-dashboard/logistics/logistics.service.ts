import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { Status, logistics } from './logistics.entity';
import { CreateLogisticDto,UpdateLogisticDto } from './logistics.dto';

import { zohoToken } from '../../sms/token.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'





@Injectable()
export class logisticsService {
  constructor(
    @InjectRepository(logistics)
    private readonly logisticRepository: Repository<logistics>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
) { }

async findOne(id: string){
  let team = await this.logisticRepository.findOne(id);  
  if(team){
  return team
 }
 else{
      return Promise.reject(new HttpException('Logistic not found', HttpStatus.BAD_REQUEST));
 }
}

async save(role: logistics){
let check=await this.logisticRepository.findOne({where:{name:role.name}}); 
if(check){
  return Promise.reject(new HttpException('Logistic already exists', HttpStatus.BAD_REQUEST));
}
else{
  role.status=Status.ACTIVE
  role.fields=[]
  // return role
  return await this.logisticRepository.save(role)
}
}


async softRemove(id: string,userId:string): Promise<logistics> {
  let role = await this.logisticRepository.findOne(id);  
  if(role){
  role.deletedAt=new Date()
  role.deletedBy=userId
  role.status=Status.DELETED
  return await this.logisticRepository.save(role);
  // await this.prodoRolesRepository.delete(id);
 }
 else{
      return Promise.reject(new HttpException('Logistic not found', HttpStatus.BAD_REQUEST));
 }
} 

async hardRemove(id: string,userId:string) {
  let role = await this.logisticRepository.findOne(id);  
  if(role){
  let del= await this.logisticRepository.delete(id);
  if(del){
    return "Deleted successfully"
  }
  else{
    return Promise.reject(new HttpException('Logistic not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
  }
 }
 else{
      return Promise.reject(new HttpException('Logistic not found', HttpStatus.BAD_REQUEST));
 }
} 

async update(id: string,updateRole: Partial<logistics>): Promise<logistics> {
  let role = await this.logisticRepository.findOne(id);  
  if(role){
    let data= await this.logisticRepository.update(id, updateRole);
    let saveRole=await this.logisticRepository.findOne(id);
    return saveRole;
 }
 else{
      return Promise.reject(new HttpException('Logistic not found', HttpStatus.BAD_REQUEST));
 }
}
async findAll(query?:any){
// console.log("in findall")
  if(query){
    console.log(query)
    let data=await this.logisticRepository.findAndCount(query)
    return {data:data[0],count:data[1]}
  } 
  else {
    let data=await this.logisticRepository.findAndCount()
    return {data:data[0],count:data[1]}
  }
}

async check(id: string) {
  let check = await this.logisticRepository.findOne(id).then((res1)=>{
    return res1
  }).catch((err)=>{
    return false
  })
  return check
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



}
