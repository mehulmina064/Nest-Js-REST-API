import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Entitie, entityStatus } from './entity.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
var ObjectId = require('mongodb').ObjectID;


// @Injectable()
export class entitiesService {
  constructor(
    @InjectRepository(Entitie)
    private readonly entityRepository: Repository<Entitie>,

) { }

async save(orgId:any,companyId:any,entityData:any){
  orgId=String(orgId)
  let find=await this.entityRepository.findOne({where: { zipCode : entityData.zipCode, companyId : companyId,organization_id:orgId}})
  if(find)
  {
    // console.log(find)
      throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad request',
          message:"Entity Already exist in this company",
        }, HttpStatus.BAD_REQUEST);
  }
  else{
        let entity = await new Entitie
        entity.zipCode=entityData.zipCode
        entity.entityName=entityData.entityName?entityData.entityName:"None"
        entity.entityState=entityData.entityState?entityData.entityState:"None"
        entity.entityCountry=entityData.entityCountry?entityData.entityCountry:"IN"
        entity.shippingAddress=entityData.shippingAddress?entityData.shippingAddress:"None"
        entity.description=entityData.description?entityData.description:"None"
        entity.entityContactNumber=entityData.entityContactNumber?entityData.entityContactNumber:"None"
        entity.entityCity=entityData.entityCity?entityData.entityCity:"None"
        entity.status=entityStatus.ACTIVE
        entity.companyId=`${companyId}`
        entity.organization_id=`${orgId}`
      //   entity.id='33Test236938648'
      // return entity

      entity= await this.entityRepository.save(entity)
        if(entity){
         return entity
        }
        else{
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Forbidden',
                message: "Error in Saving Data"
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
   
  }
}

async create(orgId:string,companyId:string,zipCode:string) {
  orgId=String(orgId)
  companyId=String(companyId)
  zipCode=String(zipCode)

  // let find=await this.entityRepository.findOne({gstNo:gstNo})
  let find=await this.entityRepository.findOne({where: { companyId : companyId, organization_id : orgId , zipCode:zipCode }})

  if(find){
     console.log("allready existed zipcode on this company")
     return find
  }
  else{
  let entity = await new Entitie
      entity.entityName=""
      entity.companyId=`${companyId}`
      entity.organization_id=`${orgId}`
      entity.zipCode = `${zipCode}`
      entity.billingAddress=""
      entity.shippingAddress=""
      entity.description=""
      entity.entityContactNumber=""
      entity.entityCountry="IN"
      entity.entityState=""
      entity.entityCity=""
      entity.status=entityStatus.ACTIVE
      // return entity
      return await this.entityRepository.save(entity)

  }
        
}

  async findAll() {
    return await this.entityRepository.find();
  }

  async findOne(id: any) {
  let find=await this.entityRepository.findOne({_id : ObjectId(`${id}`)})

    return find;
  }

  update(id: number, data:any) {
    return `This action updates a #${id} entity`;
  }

  remove(id: number) {
    return `This action removes a #${id} entity`;
  }

  async findEntities(ids:any):Promise<Entitie[]>{
    let filterData=[]
    for(let i = 0;i<ids.length;i++){
    filterData.push({_id:ObjectId(ids[i])})
    }
    let filter = {
        $or: filterData
    };
    //  console.log(filter)
    const entities = await this.entityRepository.find({ where: filter });
    return entities
}


async addStatus(){
  let out=[]
  let entitys=await this.entityRepository.find()
  for(let o of entitys){
       o.status=entityStatus.ACTIVE
       let o1=await this.entityRepository.update(o.id,o)
       out.push({id:o.id,update:o1})
  }
  return out
}

async mapEntity(salesOrder:any){
  let entity=new Entitie()
  let entityDetails=salesOrder.shipping_address
  if(!entityDetails.zip){
    return false

    throw new HttpException({
        status: HttpStatus.FAILED_DEPENDENCY,
        error: 'Error from zoho fields in entity ',
        message: "Field error zipcode",
      }, HttpStatus.FAILED_DEPENDENCY);
}
  entity.companyId=""
  entity.status=entityStatus.ACTIVE
  entity.branches=[]
  entity.createdBy="ZOHO SYNC"
  entity.zipCode=entityDetails.zip
  entity.entityName=`${salesOrder.customer_name?salesOrder.customer_name:"None"}-Entity`
  entity.shippingAddress=entityDetails.address?entityDetails.address:"None"
  entity.entityCity=entityDetails.city?entityDetails.city:"None"
  entity.entityState=entityDetails.state?entityDetails.state:(entityDetails.state_code?entityDetails.state_code:"None")
  entity.entityCountry=entityDetails.country?entityDetails.country:(entityDetails.country_code?entityDetails.country_code:"IN")
  entity.entityContactNumber=entityDetails.phone?entityDetails.phone:(entityDetails.fax?entityDetails.fax:"None")
  entity.createdAt=new Date()
  entity.updatedAt=new Date()

  return entity
}

async zohoCustomerEntity(entity:Entitie){
  let find=await this.entityRepository.findOne({where:{zipCode:entity.zipCode,companyId:entity.companyId}})
  if(find){
    // console.log(find,entity)
    entity.createdAt=find.createdAt?find.createdAt:(entity.createdAt?entity.createdAt:new Date())
    entity.id=find.id
    await this.entityRepository.save(entity)
    return entity
  }
  else{
    return await this.entityRepository.save(entity)
  }

}




}
