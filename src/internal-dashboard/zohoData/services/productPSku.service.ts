import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { ProductPSku } from '../entity/ProductPSku.entity';
import { zohoToken } from '../../../sms/token.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
import {CreateProductPSkuDto,UpdateProductPSkuDto } from '../entity/ProductPSku.dto';





@Injectable()
export class ProductPSkuService {
  constructor(
    @InjectRepository(ProductPSku)
    private readonly connectionRepository: Repository<ProductPSku>,
    

) { }

async findOne(id: string){
    let team = await this.connectionRepository.findOne(id);  
    if(team){
    return team
   }
   else{
        return Promise.reject(new HttpException('ProductPSku not found', HttpStatus.BAD_REQUEST));
   }
  }
 
async save(role: CreateProductPSkuDto){
  let check=await this.connectionRepository.findOne({where:{productId:role.productId,pSkuId:role.pSkuId}});
  if(check){
    return Promise.reject(new HttpException('ProductPSku already exists', HttpStatus.BAD_REQUEST));
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
      return Promise.reject(new HttpException('ProductPSku not Deleted', HttpStatus.INTERNAL_SERVER_ERROR));
    }
   }
   else{
        return Promise.reject(new HttpException('ProductPSku not found', HttpStatus.BAD_REQUEST));
   }
  } 
 
async update(id: string,updateRole: Partial<ProductPSku>): Promise<ProductPSku> {
    let role = await this.connectionRepository.findOne(id);  
    if(role){
      let data= await this.connectionRepository.update(id, updateRole);
      let saveRole=await this.connectionRepository.findOne(id);
      return saveRole;
   }
   else{
        return Promise.reject(new HttpException('ProductPSku not found', HttpStatus.BAD_REQUEST));
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
