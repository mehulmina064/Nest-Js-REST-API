// Create Nest JS Service for Organization Entity ./../organization/organization.entity.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { getRepository, getTreeRepository, MongoRepository } from 'typeorm';
import { OrganizationDomain, OrganizationType,OrganizationStatus } from '../organization/organization.entity';
import { of } from 'rxjs';
import {HttpException,HttpStatus } from '@nestjs/common';



var ObjectId = require('mongodb').ObjectID;

Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
    ) { }

    async findAll(): Promise<Organization[]> {
        return await this.organizationRepository.find();
    }

    async findOne(id: string): Promise<Organization> {
        return await this.organizationRepository.findOne(id);
    }

    async filter(filter: any) {
        return await this.organizationRepository.find(filter);
    }

    async update(id: string, organization: any) {
        return await this.organizationRepository.update(id, organization);
    }

    async remove(id: ObjectID | undefined) {
        const organization = this.organizationRepository.findOne(id).then(result => {
            this.organizationRepository.delete(result);
        });
    }

    async save(organization: Organization) {
        // check if organization already exists
        const foundOrganization = await this.organizationRepository.findOne(organization.id);
        if (foundOrganization) {
            let m=await this.organizationRepository.update(foundOrganization.id,organization);
            return organization
        } else {
            return await this.organizationRepository.save(organization);
        }
    }
    async fixOldData(id: string) {
        const foundOrganization = await this.organizationRepository.findOne(id);
        if (foundOrganization) {
            foundOrganization.customerId=`${foundOrganization.id}`
            let m=await this.organizationRepository.save(foundOrganization);
            return foundOrganization
        } else {
            // return (`No Organization Found on Id- ${id}`)
            throw new NotFoundException(`No Organization Found on Id- ${id}`)
        }
    }
    async newOrgSave(organization: any,type: string) {
        if(type=="Old")
        {
            console.log("in Old FLow")
            organization.status=OrganizationStatus.ACTIVE
            let foundOrganization = await this.organizationRepository.findOne(organization.id);
            if (foundOrganization) {
                // console.log(foundOrganization)
                organization.id=foundOrganization.id
                organization.customerId=`${foundOrganization.id}`
                organization.account_id=`${foundOrganization.account_id}`
                let m=await this.organizationRepository.save(organization);
                // console.log(organization)
                // return organization
            } else {
                foundOrganization= await this.organizationRepository.save(organization);
                foundOrganization.customerId=`${foundOrganization.id}`
                let y=await this.organizationRepository.save(foundOrganization);
                console.log(foundOrganization)
                organization= foundOrganization
            }
            //update/save company for org
            // console.log(organization)
            let gstNo=organization.id
            let zipCode=organization.id

            // let gstNo="07AABCU9603R1ZP"
            // let zipCode="122002"

            let otherData=await this.companyService.create(organization.id,gstNo,zipCode)
            if(organization.companyIds.includes(otherData.companyId)){
                console.log("Allready have that Company in Organization")

                if(organization.entityIds.includes(otherData.entityId)){
                    console.log("Allready have that entity in Organization")
                   }
                   else{
                    organization.entityIds.push(otherData.entityId)
                    await this.organizationRepository.update(organization.id,organization)
                   }
               }  
               else{
                organization.companyIds.push(otherData.companyId)
                if(organization.entityIds.includes(otherData.entityId)){
                    console.log("Allready have that entity in Organization")
                    await this.organizationRepository.update(organization.id,organization)
                   }
                   else{
                    organization.entityIds.push(otherData.entityId)
                    await this.organizationRepository.update(organization.id,organization)
                   }
               }
               otherData.organization=organization
            return otherData
        }
        else if(type=="New")
        {
        // console.log("in new organization creation")
        // return await this.organizationRepository.findOne('623b0c35b08559a53237cdc8')
            console.log("in New Flow")
           const foundOrganization = await this.organizationRepository.findOne({where: {customerId:organization.customerId}});
           if (foundOrganization) {
                // foundOrganization.account_id=String(organization.account_id)
                // foundOrganization.status=OrganizationStatus.ACTIVE,
                // await this.organizationRepository.update(foundOrganization.id,foundOrganization)
                // return foundOrganization
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad request',
                    message:"Allready have that customer id organization",
                  }, HttpStatus.BAD_REQUEST);
           } else {
            console.log("in new organization creation")
             let saveData={
                "companyIds": [],
                "entityIds": [],
                "name": organization.name,
                "type": organization.type,
                "account_id": organization.account_id,
                "customerId": organization.customerId,
                "status":OrganizationStatus.ACTIVE,
                "domains":[OrganizationDomain.PROCUREMENT,OrganizationDomain.ECOMMERCE,OrganizationDomain.INVENTORY]
             }

             if(saveData.type === OrganizationType.LOGISTICS) {
               saveData.domains.push(OrganizationDomain.LOGISTICS);
             }
             if(saveData.type == OrganizationType.MANUFACTURER) {
                saveData.domains.push(OrganizationDomain.SUPPLIER,OrganizationDomain.MANUFACTURER);
             }
            //  return saveData
              
             organization=await this.organizationRepository.save(saveData);
                return organization
           }
      }
    }

    async findOrganizations(ids:any):Promise<Organization[]>{
        let filterData=[]
        for(let i = 0;i<ids.length;i++){
        filterData.push({_id:ObjectId(ids[i])})
        }
        let filter = {
            $or: filterData
        };
        //  console.log(filter)
        const organizations = await this.organizationRepository.find({ where: filter });
        return organizations
    }

    async addStatus(){
        let out=[]
        let orgs=await this.organizationRepository.find()
        for(let o of orgs){
             o.status=OrganizationStatus.ACTIVE
             let o1=await this.organizationRepository.update(o.id,o)
             out.push({id:o.id,update:o1})
        }
        return out
    }
    

    async mapOrganization(customer:any){
        if(!customer.contact_id){
            return false

            throw new HttpException({
                status: HttpStatus.FAILED_DEPENDENCY,
                error: 'Error from zoho fields in organization',
                message: "Field error customer id",
              }, HttpStatus.FAILED_DEPENDENCY);
        }
        let organization= new Organization()
        organization.companyIds=[]
        organization.entityIds=[]
        organization.account_id=""
        organization.createdBy="ZOHO SYNC"
        organization.createdAt=String(new Date())
        organization.updatedAt=String(new Date())
        organization.customerId=customer.contact_id
        organization.name=customer.contact_name?customer.contact_name:"None"
        organization.business_website=customer.website?customer.website:""
        organization.payment_terms=customer.payment_terms?customer.payment_terms:""
        organization.credit_limit=customer.credit_limit?customer.credit_limit:""
        organization.status=OrganizationStatus.ACTIVE
        organization.business_pan=customer.pan_no?customer.pan_no:""
        organization.gst_treatment=customer.gst_treatment?customer.gst_treatment:""
        organization.created_time=customer.created_time?customer.created_time:""
        organization.created_date=customer.created_date?customer.created_date:""
        organization.last_modified_time=customer.last_modified_time?customer.last_modified_time:""
        organization.created_by_name=customer.created_by_name?customer.created_by_name:"ZOHO-BOOKS-SYNC"

       return organization
    }

    async zohoCustomerOrganization(organization:Organization){
      let find=await this.organizationRepository.findOne({where:{customerId:organization.customerId}})
      if(find){
        organization.createdAt=find.createdAt?find.createdAt:(organization.createdAt?organization.createdAt:String(new Date()))
        await this.organizationRepository.update(find.id,organization)
        organization.id=find.id
        return organization
      }
      else{
        return await this.organizationRepository.save(organization)
      }

    }


}