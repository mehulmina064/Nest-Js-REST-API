import { Organization } from './organization.entity';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';

import { OrganizationService } from "./organization.service";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Repository } from 'typeorm';
import { UserRole } from './../users/roles.constants';


@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
        ) { }


    // @Get("fix")
    // async fix(){
    //   return await this.organizationService.addStatus()
    // }
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllOrganizations(@Request() req:any) {
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
              result = await this.organizationService.findAll()    
              return {statusCode:200,message:"All organizations",data:result}
           }
           else if(user.orgIds.length>0){
            result = await this.organizationService.findOrganizations(user.orgIds)    
            return {statusCode:200,message:"All organizations",data:result}
           }
           else{
            throw new HttpException({
              status: HttpStatus.BAD_REQUEST,
              error: 'Bad request',
              message: "You have no Organizations",
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
   
    @Get('organizationbyid/:id')
    @UseGuards(JwtAuthGuard)
    async findOne1(@Param('id') id: string,@Request() req:any){
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
            result = await this.organizationService.findOne(id);
            return result
         }
         else if(user.orgIds.includes(id)){
          result = await this.organizationService.findOne(id);   
          return result
         }
         else{
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Bad request',
            message: "You are not in this organization",
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
    

    @Get(':id')
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
            result = await this.organizationService.findOne(id);
            return {statusCode:200,message:"organization details",data:result}
         }
         else if(user.orgIds.includes(id)){
          result = await this.organizationService.findOne(id);   
          return {statusCode:200,message:"organization details",data:result}
         }
         else{
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Bad request',
            message: "You are not in this organization",
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
    async filter(@Query() query:any) {
        return await this.organizationService.filter(query);
    }
    @Post()
    save(@Body() organization: Organization) {
        console.log(organization)
        return this.organizationService.save(organization);
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() organization: any) {
        return await this.organizationService.update(id, organization);
    }
  
   
}