import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { Status, batch,BatchItemConnection } from './batch.entity';
import { CreateBatchDto,UpdateBatchDto,CreateFieldDto,UpdateFieldDto,CreateBatchItemConnectionDto,UpdateBatchItemConnectionDto } from './batch.dto';
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'





@Injectable()
export class batchItemConnectionService {
  constructor(
    @InjectRepository(BatchItemConnection)
    private readonly connectionRepository: Repository<BatchItemConnection>,
    

) { }

async findOne(id: string){
    let team = await this.connectionRepository.findOne(id);  
    if(team){
    return team
   }
   else{
        return Promise.reject(new HttpException('BatchItemConnection not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(role: CreateBatchItemConnectionDto){
  let check=await this.connectionRepository.findOne({where:{batchId:role.batchId,batchItemId:role.batchItemId}});
  if(check){
    return Promise.reject(new HttpException('BatchItemConnection already exists', HttpStatus.BAD_REQUEST));
  }
  else{
    // return role
    return await this.connectionRepository.save(role)
  }
}


async softRemove(id: string,userId:string){
    let role = await this.connectionRepository.findOne(id);  
    if(role){
    let del=await this.connectionRepository.delete(id);
    if(del){
      return "Deleted successfully"
    }
    else{
      return Promise.reject(new HttpException('BatchItemConnection not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('BatchItemConnection not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<BatchItemConnection>): Promise<BatchItemConnection> {
    let role = await this.connectionRepository.findOne(id);  
    if(role){
      let data= await this.connectionRepository.update(id, updateRole);
      let saveRole=await this.connectionRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('BatchItemConnection not found', HttpStatus.BAD_REQUEST));
   }
  }
async findAll(query?:any){
  // console.log("in findall")
    if(query){
      console.log(query)
      let data=await this.connectionRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    } 
    else {
      let data=await this.connectionRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }


}
