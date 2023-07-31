import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { RolesAndPermission} from './prodoRolesAndPermissionGroups.entity'; 
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
import { CreateUserRoleDto } from '../prodoRoles/prodoRoles.dto';
import { CreateRolePermissionDto } from './rolePermission.dto';





@Injectable()
export class rolesPermissionGroupService {
  constructor(
    @InjectRepository(RolesAndPermission)
    private readonly rolesAndPermissionRepository: Repository<RolesAndPermission>,
    

) { }

async findOne(id: string){
    let team = await this.rolesAndPermissionRepository.findOne(id);  
    if(team){
    return team
   }
   else{
        return Promise.reject(new HttpException('rolePermission not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(role: CreateRolePermissionDto){
  let check=await this.rolesAndPermissionRepository.findOne({where:{roleId:role.roleId,permissionGroupId:role.permissionGroupId}});
  if(check){
    return Promise.reject(new HttpException('rolePermission already exists', HttpStatus.BAD_REQUEST));
  }
  else{
    // return role
    return await this.rolesAndPermissionRepository.save(role)
  }
}


async softRemove(id: string,userId:string){
    let role = await this.rolesAndPermissionRepository.findOne(id);  
    if(role){
    let del=await this.rolesAndPermissionRepository.delete(id);
    if(del){
      return "Deleted successfully"
    }
    else{
      return Promise.reject(new HttpException('rolePermission not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('rolePermission not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<RolesAndPermission>): Promise<RolesAndPermission> {
    let role = await this.rolesAndPermissionRepository.findOne(id);  
    if(role){
      let data= await this.rolesAndPermissionRepository.update(id, updateRole);
      let saveRole=await this.rolesAndPermissionRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('rolePermission not found', HttpStatus.BAD_REQUEST));
   }
  }
async findAll(query?:any){
  // console.log("in findall")
    if(query){
      console.log(query)
      let data=await this.rolesAndPermissionRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    } 
    else {
      let data=await this.rolesAndPermissionRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }


}
