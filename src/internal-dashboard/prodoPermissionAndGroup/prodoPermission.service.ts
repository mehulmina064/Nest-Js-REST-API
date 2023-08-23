import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { permissionGroupStatus, prodoPermissionGroup } from './prodoPermissionGroup.entity';
import { CreatePermissionDto,UpdatePermissionDto,CreateModulePermissionDto,UpdateModulePermissionDto } from './rolePermission.dto';
import { zohoToken } from '../../sms/token.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'





@Injectable()
export class prodoPermissionService {
  constructor(
    @InjectRepository(prodoPermissionGroup)
    private readonly prodoPermissionGroupRepository: Repository<prodoPermissionGroup>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
) { }

async findOne(id: string){
  let team = await this.prodoPermissionGroupRepository.findOne(id);  
  if(team){
  return team
 }
 else{
      return Promise.reject(new HttpException('PermissionGroup not found', HttpStatus.BAD_REQUEST));
 }
}

async save(role: prodoPermissionGroup){
let check=await this.prodoPermissionGroupRepository.findOne({where:{permissionGroupName:role.permissionGroupName}});
if(check){
  return Promise.reject(new HttpException('PermissionGroup already exists', HttpStatus.BAD_REQUEST));
}
else{
  role.status=permissionGroupStatus.ACTIVE
  role.permissions=[]
  // return role
  return await this.prodoPermissionGroupRepository.save(role)
}
}


async softRemove(id: string,userId:string): Promise<prodoPermissionGroup> {
  let role = await this.prodoPermissionGroupRepository.findOne(id);  
  if(role){
  role.deletedAt=new Date()
  role.deletedBy=userId
  role.status=permissionGroupStatus.DELETED
  return await this.prodoPermissionGroupRepository.save(role);
  // await this.prodoRolesRepository.delete(id);
 }
 else{
      return Promise.reject(new HttpException('PermissionGroup not found', HttpStatus.BAD_REQUEST));
 }
} 

async hardRemove(id: string,userId:string) {
  let role = await this.prodoPermissionGroupRepository.findOne(id);  
  if(role){
  let del= await this.prodoPermissionGroupRepository.delete(id);
  if(del){
    return "Deleted successfully"
  }
  else{
    return Promise.reject(new HttpException('PermissionGroup not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
  }
 }
 else{
      return Promise.reject(new HttpException('PermissionGroup not found', HttpStatus.BAD_REQUEST));
 }
} 

async update(id: string,updateRole: Partial<prodoPermissionGroup>): Promise<prodoPermissionGroup> {
  let role = await this.prodoPermissionGroupRepository.findOne(id);  
  if(role){
    let data= await this.prodoPermissionGroupRepository.update(id, updateRole);
    let saveRole=await this.prodoPermissionGroupRepository.findOne(id);
    return saveRole;
 }
 else{
      return Promise.reject(new HttpException('PermissionGroup not found', HttpStatus.BAD_REQUEST));
 }
}
async findAll(query?:any){
// console.log("in findall")
  if(query){
    console.log(query)
    let data=await this.prodoPermissionGroupRepository.findAndCount(query)
    return {data:data[0],count:data[1]}
  } 
  else {
    let data=await this.prodoPermissionGroupRepository.findAndCount()
    return {data:data[0],count:data[1]}
  }
}

async check(id: string){
  let check = await this.prodoPermissionGroupRepository.findOne(id).then((res1)=>{
    return res1
  }).catch((err)=>{
    return false
  })
  return check
}

//*add permission in group

async addPermissions(id:string,userId:string,permissions:any){
  let PG = await this.prodoPermissionGroupRepository.findOne(id);
  if(PG){//permission group
    for(let i=0;i<permissions.length;i++){
      let perm=permissions[i]
       let obj = PG.permissions.find(o => o.moduleName === perm.moduleName);
       if(!obj){
         perm.createdAt=new Date()
         perm.updatedAt=new Date()
         PG.permissions.push(perm)
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error:'This Module Permission already in permissionGroup'+perm.moduleName,
          message: 'This Module Permission already in permissionGroup'+",Please update from the editPermission",
        }, HttpStatus.BAD_REQUEST);
       }
    }    
    PG.updatedBy=userId
    PG.updatedAt=new Date()
    await this.prodoPermissionGroupRepository.update(PG.id,PG)
    return PG  
   }
   else{
        return Promise.reject(new HttpException('PermissionGroup not found', HttpStatus.BAD_REQUEST));
   }
}

async editPermissions(id:string,userId:string,permissions:any){
  let PG = await this.prodoPermissionGroupRepository.findOne(id);
  if(PG){//permission group
    for(let i=0;i<permissions.length;i++){
      let perm=permissions[i]
       let obj = PG.permissions.find(o => o.moduleName === perm.moduleName);
       if(obj){
         perm.createdAt=new Date()
         perm.updatedAt=new Date()
         permissions[i]=perm
       }
       else{
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error:'This Module Permission not in this permissionGroup'+perm.moduleName,
          message: 'This Module Permission not in this permissionGroup'+",Please add from the addPermission",
        }, HttpStatus.BAD_REQUEST);
       }
    }    
    PG.permissions=await PG.permissions.map(obj => permissions.find(o => o.moduleName === obj.moduleName) || obj);
    PG.updatedBy=userId
    PG.updatedAt=new Date()
    // await this.prodoPermissionGroupRepository.update(PG.id,PG)
    return PG  
   }
   else{
        return Promise.reject(new HttpException('PermissionGroup not found', HttpStatus.BAD_REQUEST));
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
        'refresh_token':'1000.da',//Mehul
        'client_id':'100',
        'client_secret':'a10',
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
