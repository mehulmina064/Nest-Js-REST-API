import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { entitiesService } from './entities.service';
import { Organization } from '../organization/organization.entity';
import { Company } from '../company/company.entity';
import { UserRole } from '../users/roles.constants';

@Controller('entities')
export class entitiesController {
  constructor(private readonly entitiesService: entitiesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    ) {}

    // @Get("fix")
    // async fix(){
    //   return await this.entitiesService.addStatus()
    // }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req:any) {
    
    let user = await this.userRepository.findOne(req.user.id)
    if(!user)
    {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "User Not Found",
        }, HttpStatus.EXPECTATION_FAILED);
      }
    // console.log(user)
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
        // console.log("user is admin for the company therefore sees all entities")
    result = await this.entitiesService.findAll()    
    return {statusCode:200,message:"All Entities",data:result}

    }
    else if(user.entityIds.length>0) {
        result = await this.entitiesService.findEntities(user.entityIds)    
        return {statusCode:200,message:"All Entities",data:result}
    }
    else{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad request',
        message: "You have no Entities",
      }, HttpStatus.BAD_REQUEST);
    }
  }
  else{
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "Invalid User",
      }, HttpStatus.EXPECTATION_FAILED);
    }
  }


    @UseGuards(JwtAuthGuard) 
    @Post()
    async save(@Request() req:any,@Body() entityData:any,) {
      let user = await this.userRepository.findOne(req.user.id)
      // return user
      if(!user)
          {
              throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'NOT_FOUND',
                message: "User Not Found",
              }, HttpStatus.NOT_FOUND);
            }
            // return user
        if(!entityData.companyId)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide companyId",
              }, HttpStatus.BAD_REQUEST);
            }
          if(!entityData.zipCode)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide zipCode ",
              }, HttpStatus.BAD_REQUEST);
            }
            if(!entityData.shippingAddress)
            {
                throw new HttpException({
                  status: HttpStatus.BAD_REQUEST,
                  error: 'BAD_REQUEST',
                  message: "Please Provide shippingAddress ",
                }, HttpStatus.BAD_REQUEST);
              }
          if(!entityData.entityName)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide entity name",
              }, HttpStatus.BAD_REQUEST);
            }
            if(!entityData.entityCity)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide city name",
              }, HttpStatus.BAD_REQUEST);
            }
            if(!entityData.entityState)
            {
                throw new HttpException({
                  status: HttpStatus.BAD_REQUEST,
                  error: 'BAD_REQUEST',
                  message: "Please Provide State name",
                }, HttpStatus.BAD_REQUEST);
              }
            if(!entityData.entityCountryCode)
            {
                throw new HttpException({
                  status: HttpStatus.BAD_REQUEST,
                  error: 'BAD_REQUEST',
                  message: "Please Provide entity Country Code like IN,US..",
                }, HttpStatus.BAD_REQUEST);
              }
      let result
      let company= await this.companyRepository.findOne(entityData.companyId)
      if(!company){
        {
          throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'NOT_FOUND',
            message: "Company Not Found", 
          }, HttpStatus.NOT_FOUND);
        }
      }
      let organization =await this.organizationRepository.findOne(company.organization_id)
      if(!organization){
        {
          throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'NOT_FOUND',
            message: "Organization Not Found", 
          }, HttpStatus.NOT_FOUND);
        }
      }
      let cId=String(company.id)
      let uI=String(user.id)
      let oID=String(organization.id)
      // return {user:user,company:company,organization:organization}
      if(user.roles)
      {
         if (user.roles.includes(UserRole.PRODO_ADMIN)) {
             result = await this.entitiesService.save(oID,cId,entityData)
         }
         else if(user.orgIdRoles.find(i => (i.id==oID)&&(i.role=='ORG_ADMIN'))){
          result = await this.entitiesService.save(oID,cId,entityData)
         }
         else
         {
         if (organization.account_id==user.accountId){
            console.log("User is super admin")
            result = await this.entitiesService.save(oID,cId,entityData)
          }
         else  if(user.orgIds.includes(oID)){
          if(user.companyIdRoles.find(i => (i.id==cId)&&(i.role=='COMPANY_ADMIN'))){
            result = await this.entitiesService.save(oID,cId,entityData)
           }
           else {
                throw new HttpException({
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Bad request',
                  message: " You are not a admin of this Company ",
                }, HttpStatus.BAD_REQUEST);
               }
            }
          else
           {
            throw new HttpException({
              status: HttpStatus.BAD_REQUEST,
              error: 'Bad request',
              message:"You are not in this organization",
            }, HttpStatus.BAD_REQUEST);
          }
        }
        if(result){
          organization.entityIds.push(`${result.id}`)
          company.entityIds.push(`${result.id}`)
          user.entityIdRoles.push({id:`${result.id}`,role:"ENTITY_ADMIN"})
          user.entityIds.push(`${result.id}`) 
          await this.userRepository.update(user.id,user)
          await this.companyRepository.update(company.id,company)
          await this.organizationRepository.update(organization.id,organization)
          result={
            entity:result,
            company:company,
            organization:organization,
            user:user
          }
          let output={
            statusCode:200,
            message:" Successfully saved ",
            data:result
          }
          return output
        }
        else
        {
            throw new HttpException({
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'EXPECTATION_FAILED',
              message: "Error in saving data",
            }, HttpStatus.INTERNAL_SERVER_ERROR);
          }
  
      }
      else
      {
          throw new HttpException({
            status: HttpStatus.EXPECTATION_FAILED,
            error: 'EXPECTATION_FAILED',
            message: "Invalid User",
          }, HttpStatus.EXPECTATION_FAILED);
        }

    }

  @Get('details/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string,@Request() req:any){
      let user = await this.userRepository.findOne(req.user.id)
      if(!user)
          {
              throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'NOT_FOUND',
                message: "User Not Found",
              }, HttpStatus.NOT_FOUND);
            }
      let result
      if(user.roles)
      {
         if (user.roles.includes(UserRole.PRODO_ADMIN)) {
            result = await this.entitiesService.findOne(id);
            return {statusCode:200,message:"entity details",data:result}
         }
         else if(user.entityIds.includes(id)){
          result = await this.entitiesService.findOne(id);   
          return {statusCode:200,message:"entity details",data:result}
         }
         else{
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Bad request',
            message: "You are not in this entity",
          }, HttpStatus.BAD_REQUEST);
        }
      }
      else
      {
          throw new HttpException({
            status: HttpStatus.EXPECTATION_FAILED,
            error: 'EXPECTATION_FAILED',
            message: "Invalid User",
          }, HttpStatus.EXPECTATION_FAILED);
        }
    }

  @Patch(':id')
  update(@Param('id') id: string, @Body()data :any) {
    return this.entitiesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(+id);
  }


 }
