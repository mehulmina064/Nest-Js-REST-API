import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { Status, productPType } from './pType.entity';
import { CreatePTypeDto,UpdatePTypeDto,CreateFieldDto,UpdateFieldDto } from './pType.dto';
import { zohoToken } from '../../sms/token.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'





@Injectable()
export class pTypeService {
  constructor(
    @InjectRepository(productPType)
    private readonly productPTypeRepository: Repository<productPType>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
) { }

async findOne(id: string){
  let team = await this.productPTypeRepository.findOne(id);  
  if(team){
  return team
 }
 else{
      return Promise.reject(new HttpException('PType not found', HttpStatus.BAD_REQUEST));
 }
}

async save(role: productPType){
let check=await this.productPTypeRepository.findOne({where:{name:role.name}});
if(check){
  return Promise.reject(new HttpException('PType already exists', HttpStatus.BAD_REQUEST));
}
else{
  role.status=Status.ACTIVE
  role.fields=[]
  // return role
  return await this.productPTypeRepository.save(role)
}
}


async softRemove(id: string,userId:string): Promise<productPType> {
  let role = await this.productPTypeRepository.findOne(id);  
  if(role){
  role.deletedAt=new Date()
  role.deletedBy=userId
  role.status=Status.DELETED
  return await this.productPTypeRepository.save(role);
  // await this.prodoRolesRepository.delete(id);
 }
 else{
      return Promise.reject(new HttpException('PType not found', HttpStatus.BAD_REQUEST));
 }
} 

async hardRemove(id: string,userId:string) {
  let role = await this.productPTypeRepository.findOne(id);  
  if(role){
  let del= await this.productPTypeRepository.delete(id);
  if(del){
    return "Deleted successfully"
  }
  else{
    return Promise.reject(new HttpException('PType not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
  }
 }
 else{
      return Promise.reject(new HttpException('PType not found', HttpStatus.BAD_REQUEST));
 }
} 

async update(id: string,updateRole: Partial<productPType>): Promise<productPType> {
  let role = await this.productPTypeRepository.findOne(id);  
  if(role){
    let data= await this.productPTypeRepository.update(id, updateRole);
    let saveRole=await this.productPTypeRepository.findOne(id);
    return saveRole;
 }
 else{
      return Promise.reject(new HttpException('PType not found', HttpStatus.BAD_REQUEST));
 }
}
async findAll(query?:any){
// console.log("in findall")
  if(query){
    console.log(query)
    let data=await this.productPTypeRepository.findAndCount(query)
    return {data:data[0],count:data[1]}
  } 
  else {
    let data=await this.productPTypeRepository.findAndCount()
    return {data:data[0],count:data[1]}
  }
}

async check(id: string){
  let check = await this.productPTypeRepository.findOne(id).then((res1)=>{
    return res1
  }).catch((err)=>{
    return false
  })
  return check
}

//*add Fields in PType

async addFields(id:string,userId:string,fields:any){
  let PG = await this.productPTypeRepository.findOne(id);
  if(PG){//permission group
    for(let i=0;i<fields.length;i++){
      let perm=fields[i]
       let obj = PG.fields.find(o => o.apiName === perm.apiName);
       if(!obj){
         perm.createdAt=new Date()
         perm.updatedAt=new Date()
         PG.fields.push(perm)
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error:'This Field already in PType'+perm.moduleName,
          message: 'This Field already in PType'+",Please update from the editField",
        }, HttpStatus.BAD_REQUEST);
       }
    }    
    PG.updatedBy=userId
    PG.updatedAt=new Date()
    await this.productPTypeRepository.update(PG.id,PG)
    return PG  
   }
   else{
        return Promise.reject(new HttpException('PType not found', HttpStatus.BAD_REQUEST));
   }
}

async editFields(id:string,userId:string,fields:any){
  let PG = await this.productPTypeRepository.findOne(id);
  if(PG){//permission group
    for(let i=0;i<fields.length;i++){
      let perm=fields[i]
       let obj = PG.fields.find(o => o.apiName === perm.apiName);
       if(obj){
         perm.createdAt=new Date()
         perm.updatedAt=new Date()
         fields[i]=perm
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error:'This Field not in this PType'+perm.apiName,
          message: 'This Field not in this PType'+",Please add from the addField",
        }, HttpStatus.BAD_REQUEST);
       }
    }    
    PG.fields=await PG.fields.map(obj => fields.find(o => o.apiName === obj.apiName) || obj);
    PG.updatedBy=userId
    PG.updatedAt=new Date()
    // await this.productPTypeRepository.update(PG.id,PG)
    return PG  
   }
   else{
        return Promise.reject(new HttpException('PType not found', HttpStatus.BAD_REQUEST));
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
        'refresh_token':'1000..935cf4a8f14bf3cafa77756340386482',//Mehul
        'client_id':'1000.',
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
