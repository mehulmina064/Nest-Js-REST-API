// Create Nest JS Service for Organization Entity ./../organization/organization.entity.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Company, companyStatus } from './company.entity';
import { entitiesService } from "./../entities/entities.service";
import {HttpException,HttpStatus } from '@nestjs/common';
var ObjectId = require('mongodb').ObjectID;


export class companyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        private readonly entitiesService: entitiesService,
    ) { }

    async findAll(){
        return await this.companyRepository.find();
    }

    async findOne(id: string){
        return await this.companyRepository.findOne(id);
    }

    async filter(filter: any) {
        return await this.companyRepository.find(filter);
    }

    async save(orgId:string,companyData:any){
        orgId=String(orgId)
        let find=await this.companyRepository.findOne({where: { gstNo : companyData.gstNo, organization_id : orgId}})
        if (find)
        {
            // find.status=companyStatus.ACTIVE
            // await this.companyRepository.update(find.id,find)
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Bad request',
                message:"Company Already exist in this organization",
              }, HttpStatus.BAD_REQUEST);
        }
        else{
              let company = await new Company
              company.gstNo=companyData.gstNo
              company.companyName=companyData.companyName
              company.companyContactNumber=companyData.companyContactNumber?companyData.companyContactNumber:""
              company.companyCountry=companyData.companyCountry?companyData.companyCountry:"IN"
              company.companyState=companyData.companyState?companyData.companyState:""
              company.description=companyData.description?companyData.description:""
              company.status=companyStatus.ACTIVE
              company.organization_id=`${orgId}`
            //   company.id="TEst"
            //   return company
              company= await this.companyRepository.save(company)
              if(company){
               return company
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

    async update(id: string, company: any) {
        return await this.companyRepository.update(id, company);
    }

    async remove(id: ObjectID | undefined) {
        const company = this.companyRepository.findOne(id).then(result => {
            this.companyRepository.delete(result);
        });
    }

    async create(orgId:string,gstNo:string,zipCode:string) {
        orgId=String(orgId)
        gstNo=String(gstNo)
        zipCode=String(zipCode)
        let data={
            orgId:orgId,
            gstNo:gstNo,
            zipCode:zipCode,
            companyId:"",
            entityId:""
        }
        let find=await this.companyRepository.findOne({where: { gstNo : gstNo, organization_id : orgId}})
        if(find){
           console.log("allready existed gstno company")
           let companyId=String(find.id)
           let entity=await this.entitiesService.create(orgId,companyId,zipCode)
           let entityId=String(entity.id)
           data.companyId=companyId
           data.entityId=entityId
        //    console.log(find.entityIds.includes(entityId))
           if(find.entityIds.includes(entityId)){
            console.log("Allready have that entity")
           }
           else{
            find.entityIds.push(entityId)
            await this.companyRepository.save(find)
           }
           data.company=find
           data.entity=entity
           return data
        }
        else{
        //    console.log("error")
        let company = await new Company
        company.gstNo=gstNo
        company.companyName=""
        company.companyContactNumber=""
        company.companyCountry="IN"
        company.companyState=""
        company.description=""
        company.organization_id=`${orgId}`
        company.status=companyStatus.ACTIVE
        // return company
        company= await this.companyRepository.save(company)
        if(company){
        let companyId=String(company.id)
        let entity=await this.entitiesService.create(orgId,companyId,zipCode)
        let entityId=String(entity.id)
        data.companyId=companyId
        data.entityId=entityId
        company.entityIds.push(entityId)
        await this.companyRepository.save(company)
        data.company=company
        data.entity=entity
        return data
        }
        else{
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Forbidden',
                message: "Error in Saving Data"
              }, HttpStatus.BAD_REQUEST);
        }

        }
    }


    async findCompanies(ids:any):Promise<Company[]>{
        let filterData=[]
        for(let i = 0;i<ids.length;i++){
        filterData.push({_id:ObjectId(ids[i])})
        }
        let filter = {
            $or: filterData
        };
        //  console.log(filter)
        const companies = await this.companyRepository.find({ where: filter });
        return companies
    }


    async addStatus(){
        let out=[]
        let comps=await this.companyRepository.find()
        for(let o of comps){
             o.status=companyStatus.ACTIVE
             let o1=await this.companyRepository.update(o.id,o)
             out.push({id:o.id,update:o1})
        }
        return out
    }

    async mapCompany(salesOrder:any,customer:any){
        if(!salesOrder.gst_no){
            return false
            throw new HttpException({
                status: HttpStatus.FAILED_DEPENDENCY,
                error: 'Error from zoho fields in company',
                message: "Field error gstNo",
              }, HttpStatus.FAILED_DEPENDENCY);
        }
        let compDetails=customer.tax_info_list.find(i=>i.tax_registration_no==salesOrder.gst_no)
        // console.log("compDetails",compDetails,customer.tax_info_list,salesOrder.gst_no)
        let company= new Company()
        company.entityIds=[]
        company.organization_id=""
        company.gstNo=salesOrder.gst_no?salesOrder.gst_no:""
        company.status=companyStatus.ACTIVE
        // company.companyState=compDetails.place_of_supply?compDetails.place_of_supply:(salesOrder.place_of_supply?salesOrder.place_of_supply:"None")
        company.companyState=salesOrder.place_of_supply?salesOrder.place_of_supply:"None"
        company.companyName=salesOrder.customer_name?salesOrder.customer_name:"None"
        company.companyCountry="IN"
        company.description="" 
        company.createdBy="ZOHO SYNC"
        company.createdAt=new Date()
        company.updatedAt=new Date()
      return company
    }

    async zohoCustomerCompany(company:Company){
        let find=await this.companyRepository.findOne({where:{gstNo:company.gstNo,organization_id:company.organization_id}})
        if(find){
          company.createdAt=find.createdAt?find.createdAt:(company.createdAt?company.createdAt:new Date())
          company.id=find.id
          await this.companyRepository.save(company)
          return company
        }
        else{
          return await this.companyRepository.save(company)
        }

    }

}