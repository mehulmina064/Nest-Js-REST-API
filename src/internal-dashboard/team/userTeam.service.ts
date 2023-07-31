import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { internalTeam, teamStatus } from './team.entity'; 

import { UserAndTeam} from './EmployeeAndTeam.entity'; 
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
// import { CreateUserRoleDto } from './prodoRoles.dto';
import { CreateUserTeamDto,UpdateUserTeamDto } from './team.dto';






@Injectable()
export class userTeamService {
  constructor(
    @InjectRepository(internalTeam)
    private readonly internalTeamRepository: Repository<internalTeam>,
    @InjectRepository(UserAndTeam)
    private readonly userTeamsRepository: Repository<UserAndTeam>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,

) { }

async findOne(id: string){
    let team = await this.userTeamsRepository.findOne(id);  
    if(team){
    return team
   }
   else{
        return Promise.reject(new HttpException('UserTeam not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(team: CreateUserTeamDto){
  let check=await this.userTeamsRepository.findOne({where:{teamId:team.teamId,userId:team.userId}});
  if(check){
    return Promise.reject(new HttpException('UserTeam already exists', HttpStatus.BAD_REQUEST));
  }
  else{
    return await this.userTeamsRepository.save(team)
  }
}


async softRemove(id: string,userId:string){
    let team = await this.userTeamsRepository.findOne(id);  
    if(team){
    let del=await this.userTeamsRepository.delete(id);
    if(del){
      return "Deleted successfully"
    }
    else{
      return Promise.reject(new HttpException('UserTeam not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('UserTeam not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<UserAndTeam>): Promise<UserAndTeam> {
    let role = await this.userTeamsRepository.findOne(id);  
    if(role){
      let data= await this.userTeamsRepository.update(id, updateRole);
      let saveRole=await this.userTeamsRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('UserTeam not found', HttpStatus.BAD_REQUEST));
   }
  }
async findAll(query?:any){
  // console.log("in findall")
    if(query){
      console.log(query)
      let data=await this.userTeamsRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    } 
    else {
      let data=await this.userTeamsRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }


}
