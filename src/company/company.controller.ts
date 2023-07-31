import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';
// import { UserService } from '../users/user.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { companyService } from "./company.service";
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../users/roles.constants';
import { Organization } from "../organization/organization.entity";


@Controller('company')
export class companyController {
    constructor(
        private readonly companyService: companyService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>
        ) {}
   

      // @Get("fix")
      //   async fix(){
      //     return await this.companyService.addStatus()
      //   }
    
    @UseGuards(JwtAuthGuard) 
    @Post()
    async save(@Request() req:any,@Body() companyData:any,) {
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
        if(!companyData.orgId)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide orgId",
              }, HttpStatus.BAD_REQUEST);
            }
          if(!companyData.gstNo)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide gst number",
              }, HttpStatus.BAD_REQUEST);
            }
          if(!companyData.companyName)
          {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide company name",
              }, HttpStatus.BAD_REQUEST);
            }
      let result
      let organization =await this.organizationRepository.findOne(companyData.orgId)
      if(!organization){
        {
          throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'NOT_FOUND',
            message: "Organization Not Found", 
          }, HttpStatus.NOT_FOUND);
        }
      }
      if(user.roles)
      {
         if (user.roles.includes(UserRole.PRODO_ADMIN)) {
             result = await this.companyService.save(companyData.orgId,companyData)
         }
         else if(user.orgIdRoles.find(i => (i.id==companyData.orgId)&&(i.role=='ORG_ADMIN'))){
            result = await this.companyService.save(companyData.orgId,companyData)
         }
         else
         {
         if (organization.account_id==user.accountId){
            console.log("User is super admin")
            result = await this.companyService.save(companyData.orgId,companyData)
          }
         else  if(user.orgIds.includes(companyData.orgId)){
            throw new HttpException({
              status: HttpStatus.BAD_REQUEST,
              error: 'Bad request',
              message: " You are not a admin of this organization ",
            }, HttpStatus.BAD_REQUEST);
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
          organization.companyIds.push(`${result.id}`)
          user.companyIdRoles.push({id:`${result.id}`,role:"COMPANY_ADMIN"})
          user.companyIds.push(`${result.id}`)
          await this.userRepository.update(user.id,user)
          await this.organizationRepository.update(organization.id,organization)
          result={
            company:result,
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
    @UseGuards(JwtAuthGuard) 
    @Get()
    async findAll(@Request() req:any) {
      let user = await this.userRepository.findOne(req.user.id)
      let result
      if(!user)
          {
              throw new HttpException({
                status: HttpStatus.EXPECTATION_FAILED,
                error: 'EXPECTATION_FAILED',
                message: "User Not Found",
              }, HttpStatus.EXPECTATION_FAILED);
            }
      if(user.roles)
      {
          if (user.roles.includes(UserRole.PRODO_ADMIN))
          {
          result = await this.companyService.findAll()    
          return {statusCode:200,message:"All Companies",data:result}

          }
          else if(user.companyIds.length>0) {
              result = await this.companyService.findCompanies(user.companyIds)    
              return {statusCode:200,message:"All Companies",data:result}
          }
          else{
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Bad request',
                message: "You have no Companies",
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

    @Get('filter')
    async filter(@Query() query: any) {
        return await this.companyService.filter(query);
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
            result = await this.companyService.findOne(id);
            return {statusCode:200,message:"company details",data:result}
         }
         else if(user.companyIds.includes(id)){
          result = await this.companyService.findOne(id);   
          return {statusCode:200,message:"company details",data:result}
         }
         else{
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Bad request',
            message: "You are not in this company",
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
    @UseGuards(JwtAuthGuard)

    async update(@Param('id') id: string, @Body() company: any) {
        return await this.companyService.update(id, company);
    }

    


    // @Get('companyDetails/:id')
    // @UseGuards(JwtAuthGuard)
    // async companydetails(@Param() id : any){
    //     // console.log(id)
    //     let company = await this.companyService.findOne(id.id);
    //     // console.log(company)
    //     let result = await this.companyService.companyDetails(company)
    //     let orgdetails = await this.organizationRepository.findOne(company.organization_id)
    //     return [result,orgdetails,company]
    // } 
    



}