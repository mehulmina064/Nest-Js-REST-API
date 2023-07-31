import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { prodoRoles, roleStatus } from './prodoRoles.entity'; 
import { UserAndRoles} from './EmployeeAndRoles.entity'; 
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
import { CreateUserRoleDto } from './prodoRoles.dto';

@Injectable()
export class userRolesService {
  constructor(
    @InjectRepository(UserAndRoles)
    private readonly userRolesRepository: Repository<UserAndRoles>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,

) { }

async findOne(id: string){
    let team = await this.userRolesRepository.findOne(id);  
    if(team){
    return team
   }
   else{
        return Promise.reject(new HttpException('UserRole not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(role: CreateUserRoleDto){
  let check=await this.userRolesRepository.findOne({where:{roleId:role.roleId,userId:role.userId}});
  if(check){
    return Promise.reject(new HttpException('UserRole already exists', HttpStatus.BAD_REQUEST));
  }
  else{
    return await this.userRolesRepository.save(role)
  }
}


async softRemove(id: string,userId:string){
    let role = await this.userRolesRepository.findOne(id);  
    if(role){
    let del=await this.userRolesRepository.delete(id);
    if(del){
      return "Deleted successfully"
    }
    else{
      return Promise.reject(new HttpException('UserRole not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('UserRole not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<UserAndRoles>): Promise<UserAndRoles> {
    let role = await this.userRolesRepository.findOne(id);  
    if(role){
      let data= await this.userRolesRepository.update(id, updateRole);
      let saveRole=await this.userRolesRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('UserRole not found', HttpStatus.BAD_REQUEST));
   }
  }
async findAll(query?:any){
  // console.log("in findall")
    if(query){
      console.log(query)
      let data=await this.userRolesRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    } 
    else {
      let data=await this.userRolesRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }


}
