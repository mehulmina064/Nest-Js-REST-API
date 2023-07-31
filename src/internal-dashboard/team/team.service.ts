import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { internalTeam, teamStatus } from './team.entity'; 
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
import { CreateTeamDto } from './team.dto';





@Injectable()
export class internalTeamService {
  constructor(
    @InjectRepository(internalTeam)
    private readonly teamRepository: Repository<internalTeam>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
    // private readonly userService: UserService,
    // private readonly productService: ProductService,
    // private readonly entitiesService: entitiesService,
    // private readonly organizationService: OrganizationService,
    // private readonly companyService: companyService,

) { }

async findOne(id: string){
    let team = await this.teamRepository.findOne(id);  
    if(team){
    return team
   }
   else{
        return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(role: CreateTeamDto){
  let check=await this.teamRepository.findOne({where:{teamName:role.teamName}});
  if(check){
    return Promise.reject(new HttpException('Team already exists', HttpStatus.BAD_REQUEST));
  }
  else{
    role.status=teamStatus.ACTIVE
    // return role
    return await this.teamRepository.save(role)
  }
}


async softRemove(id: string,userId:string): Promise<internalTeam> {
    let team = await this.teamRepository.findOne(id);  
    if(team){
      team.deletedAt=new Date()
      team.deletedBy=userId
      team.status=teamStatus.DELETED
    return await this.teamRepository.save(team);
    // await this.teamRepository.delete(id);
   }
   else{
        return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
   }
  } 

  async hardRemove(id: string,userId:string) {
    let team = await this.teamRepository.findOne(id);  
    if(team){
    let del= await this.teamRepository.delete(id);
    if(del){
      return "Deleted successfully"
    }
    else{
      return Promise.reject(new HttpException('Team not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<internalTeam>): Promise<internalTeam> {
    let team = await this.teamRepository.findOne(id);  
    if(team){
      let data= await this.teamRepository.update(id, updateRole);
      let saveRole=await this.teamRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
   }
  }
async findAll(query?:any){
  // console.log("in findall")
    if(query){
      console.log(query)
      let data=await this.teamRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    } 
    else {
      let data=await this.teamRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }

async check(id: string){
    let check = await this.teamRepository.findOne(id).then((res1)=>{
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
