import { User } from '../../users/user.entity';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe  } from '@nestjs/common';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { prodoRoles, roleStatus } from './prodoRoles.entity';
import { CreateRoleDto,UpdateRoleDto } from './prodoRoles.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { prodoRolesService } from './prodoRoles.service'
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { prodoPermissionService } from '../prodoPermissionAndGroup/prodoPermission.service';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
var ObjectId = require('mongodb').ObjectID; 

import fetch from 'node-fetch'
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { userInfo } from 'os';



@Controller('internal/roles')
export class prodoRolesController {
  constructor(  
  private readonly prodoRolesService:prodoRolesService,
  private readonly zohoEmployeeService:zohoEmployeeService,
  private readonly prodoPermissionService:prodoPermissionService,
  private readonly rolesPermissionGroupService:rolesPermissionGroupService,
  ) { }

  //*Roles
  @UseGuards(IJwtAuthGuard)
  @Get()
  async findAll(@Request() req:any,
  @Query('search', new DefaultValuePipe(''), ) search: string = "",
  @Query('status', new DefaultValuePipe('NA'),) status: string = "NA",
  @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  // @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number = 500,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  @Query('isDefault',new DefaultValuePipe('NA')) isDefault: string="NA",

  ) {

    // isEmployee
    // limit = limit > 200 ? 200 : limit;
    limit = limit > 500 ? 500 : limit;
    let start= (page - 1) * limit
    let end = page * limit
    let user = req.user
  
    const attrFilter = []
    if(status!="NA"){
        attrFilter.push({
          "status": status
        })
      }
      if(isDefault!="NA"){
        if(isDefault=="true"){
          attrFilter.push({
            "isDefault": true
          })
        }else{
          attrFilter.push({
            "isDefault": false
          })
        }
      }
      let query
      if(attrFilter.length>0){
        query = {
          where: {
            $or: [
              { roleName: { $regex: search, $options: 'i' } },
              { roleDisplayName: { $regex: search, $options: 'i' } },
              { roleDescription: { $regex: search, $options: 'i' } }
            ],
            $and: [
              ...attrFilter
            ] 
          }
        }
      }
      else{
        query = {
            where: {
              $or: [
                { roleName: { $regex: search, $options: 'i' } },
                { roleDisplayName: { $regex: search, $options: 'i' } },
                { roleDescription: { $regex: search, $options: 'i' } }
              ]
            }
          }
      }
    //  return query 
    let result
    if(user.roles)
      {
    if (user.roles.includes(UserRole.PRODO_ADMIN)){
      // console.log("error")
      // return user
      result = await this.prodoRolesService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All Roles",count:result.count,limit:limit,page:page,data:result.data}
    } 
    else {
      // return query
        result = await this.prodoRolesService.findAll(query)  
        result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Roles",count:result.count,limit:limit,page:page,data:result.data}
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


 

   @Get(':id')
   @UseGuards(IJwtAuthGuard)
   async findOne(@Param('id') id: string) {
     let PermissionGroups = await this.rolesPermissionGroupService.findAll({where: { roleId: id}})    
     let PermissionGroupsIds=[]
     for (let a of PermissionGroups.data){
      PermissionGroupsIds.push({_id:ObjectId(a.permissionGroupId)})
     }  
     let yep = await this.prodoPermissionService.findAll({where : { $or : [...PermissionGroupsIds]}})
     // return yep.data
       let role=await this.prodoRolesService.findOne(id);
       role.permissions=yep.data
      return {statusCode:200,message:"Details",data:role}

   }

   @Post()
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true })) 
   async save(@Body() role: CreateRoleDto,@Request() req:any) {
       role.updatedBy=req.user.id;
       role.createdBy=req.user.id;
       return await this.prodoRolesService.save(role);  
   }

   @Patch(':id')
   @UseGuards(IJwtAuthGuard)
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(@Param('id') id: string, @Body() role: UpdateRoleDto,@Request() req:any) {
    // return role
    if(role.status==roleStatus.DELETED){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'status must be not ' + role.status,
        message: 'User does not have permission to perform this action',
      }, HttpStatus.BAD_REQUEST);
    }
       role.updatedBy=req.user.id;
       role.updatedAt= new Date()
       return await this.prodoRolesService.update(id, role);
   }

   @Delete(':id')
   @UseGuards(IJwtAuthGuard)
   async softDelete(@Param('id') id: string,@Request() req:any) {
       return await this.prodoRolesService.softRemove(id,req.user.id);
    }

   @Delete('permanentDelete/:id')
   @UseGuards(IJwtAuthGuard)
   async hardDelete(@Param('id') id: string,@Request() req:any) {
       if(req.user.roles.includes('PRODO_ADMIN'))
       {
        return await this.prodoRolesService.hardRemove(id,req.user.id);
       }
       else{
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: 'User does not have permission to perform this action',
        }, HttpStatus.EXPECTATION_FAILED);
       }
    }



  
}