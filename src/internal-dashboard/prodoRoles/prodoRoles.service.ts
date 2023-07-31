import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { prodoRoles, roleStatus } from './prodoRoles.entity'; 
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
import { CreateRoleDto } from './prodoRoles.dto';



@Injectable()
export class prodoRolesService {
  constructor(
    @InjectRepository(prodoRoles)
    private readonly prodoRolesRepository: Repository<prodoRoles>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,

) { }

async findOne(id: string){
    let role = await this.prodoRolesRepository.findOne(id);  
    if(role){
    return role
   }
   else{
        return Promise.reject(new HttpException('Role not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(role: CreateRoleDto){
  let check=await this.prodoRolesRepository.findOne({where:{roleName:role.roleName}});
  if(check){
    return Promise.reject(new HttpException('Role already exists', HttpStatus.BAD_REQUEST));
  }
  else{
    role.status=roleStatus.ACTIVE
    // return role
    return await this.prodoRolesRepository.save(role)
  }
}


async softRemove(id: string,userId:string): Promise<prodoRoles> {
    let role = await this.prodoRolesRepository.findOne(id);  
    if(role){
    role.deletedAt=new Date()
    role.deletedBy=userId
    role.status=roleStatus.DELETED
    return await this.prodoRolesRepository.save(role);
    // await this.prodoRolesRepository.delete(id);
   }
   else{
        return Promise.reject(new HttpException('Role not found', HttpStatus.BAD_REQUEST));
   }
  } 

  async hardRemove(id: string,userId:string) {
    let role = await this.prodoRolesRepository.findOne(id);  
    if(role){
    let del= await this.prodoRolesRepository.delete(id);
    if(del){
      return "Deleted successfully"
    }
    else{
      return Promise.reject(new HttpException('Role not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('Role not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<prodoRoles>): Promise<prodoRoles> {
    let role = await this.prodoRolesRepository.findOne(id);  
    if(role){
      let data= await this.prodoRolesRepository.update(id, updateRole);
      let saveRole=await this.prodoRolesRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('Role not found', HttpStatus.BAD_REQUEST));
   }
  }
async findAll(query?:any){
  // console.log("in findall")
    if(query){
      console.log(query)
      let data=await this.prodoRolesRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    } 
    else {
      let data=await this.prodoRolesRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }

async check(id: string){
    let check = await this.prodoRolesRepository.findOne(id).then((res1)=>{
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
          'client_secret':'a106415659f7c06d2406f446068c1739e81174c2b7',
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
