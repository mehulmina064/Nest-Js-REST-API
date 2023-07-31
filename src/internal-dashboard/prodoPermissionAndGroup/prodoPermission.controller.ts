import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe,UploadedFile,UseInterceptors, Query,Header,Response,StreamableFile, UsePipes, ValidationPipe, ParseArrayPipe  } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
// import { IJwtAuthGuard } from '../../authentication/jwt-auth.guard';
import { IJwtAuthGuard } from '../../authentication/internal-jwt-auth.guard';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { get } from 'superagent';
import {HttpException,HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getMongoRepository, getRepository } from 'typeorm';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';
import { CreatePermissionDto,UpdatePermissionDto,CreateModulePermissionDto,UpdateModulePermissionDto } from './rolePermission.dto';
import { permissionGroupStatus, prodoPermissionGroup } from './prodoPermissionGroup.entity';
import { InjectRepository } from '@nestjs/typeorm';

import fetch from 'node-fetch'
var request = require('request')
const fs = require('fs')
const http = require("https");
import axios from 'axios';
import { prodoPermissionService } from './prodoPermission.service'
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';


@Controller('internal/prodoPermission')
export class prodoPermissionController {
  constructor(  
  private readonly prodoPermissionService:prodoPermissionService,
  private readonly zohoEmployeeService:zohoEmployeeService,

  ) { }

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
              { permissionGroupName: { $regex: search, $options: 'i' } },
              { permissionGroupDisplayName: { $regex: search, $options: 'i' } },
              { permissionGroupDescription: { $regex: search, $options: 'i' } }
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
                { permissionGroupName: { $regex: search, $options: 'i' } },
                { permissionGroupDisplayName: { $regex: search, $options: 'i' } },
                { permissionGroupDescription: { $regex: search, $options: 'i' } }
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
      result = await this.prodoPermissionService.findAll(query)    
      result.data = result.data.slice(start, end)  
      return {statusCode:200,message:"All Permissions",count:result.count,limit:limit,page:page,data:result.data}
    } 
    else {
      // return query
        result = await this.prodoPermissionService.findAll(query)  
        result.data = result.data.slice(start, end) 
        return {statusCode:200,message:"All Permissions",count:result.count,limit:limit,page:page,data:result.data}
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
      return this.prodoPermissionService.findOne(id);
  }

  @Post()
  @UseGuards(IJwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async save(@Body() role: CreatePermissionDto,@Request() req:any) {
      role.updatedBy=req.user.id;
      role.createdBy=req.user.id;
      let save= await this.prodoPermissionService.save(role);
      if(save){
        return {statusCode:200,message:"Successfully created",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not saved',
          message: "Not saved",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

  }

  @Patch(':id')
  @UseGuards(IJwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() role: UpdatePermissionDto,@Request() req:any) {
   // return role
   if(role.status==permissionGroupStatus.DELETED){
     throw new HttpException({
       status: HttpStatus.BAD_REQUEST,
       error: 'status must be not ' + role.status,
       message: 'User does not have permission to perform this action',
     }, HttpStatus.BAD_REQUEST);
   }
      role.updatedBy=req.user.id;
      role.updatedAt= new Date()
      let save= await this.prodoPermissionService.update(id, role);
      if(save){
        return {statusCode:200,message:"Successfully updated",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not updated',
          message: "Not updated",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Delete(':id')
  @UseGuards(IJwtAuthGuard)
  async softDelete(@Param('id') id: string,@Request() req:any) {
      let save=await this.prodoPermissionService.softRemove(id,req.user.id);
      if(save){
        return {statusCode:200,message:"Successfully Deleted",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not Deleted',
          message: "Not Deleted",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

  @Delete('permanentDelete/:id')
  @UseGuards(IJwtAuthGuard)
  async hardDelete(@Param('id') id: string,@Request() req:any) {
      if(req.user.roles.includes('PRODO_ADMIN'))
      {
       let save=await this.prodoPermissionService.hardRemove(id,req.user.id);
       if(save){
        return {statusCode:200,message:"Successfully removed",data:save}
      }  
      else{
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Not removed',
          message: "Not removed",
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      }
      else{
       throw new HttpException({
         status: HttpStatus.EXPECTATION_FAILED,
         error: 'EXPECTATION_FAILED',
         message: 'User does not have permission to perform this action',
       }, HttpStatus.EXPECTATION_FAILED);
      }
   }


//*for add and edit and remove permissions from the group
@Post('addPermissions/:id')
@UseGuards(IJwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
async addPermissions(@Param('id') id: string,@Request() req:any,@Body(new ParseArrayPipe({ items: CreateModulePermissionDto }))
body: CreateModulePermissionDto[],) {
  let d=body.map(item => item.moduleName)
  if(new Set(d).size !== d.length)
  {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error:'module name must be unique',
      message: 'Module name must be unique',
    }, HttpStatus.BAD_REQUEST);
  }
  else{
    let save= await this.prodoPermissionService.addPermissions(id,req.user.id,body);
    if(save){
      return {statusCode:200,message:"Successfully added permissions",data:save}
    }  
    else{
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Not added permissions',
        message: "Not added permissions",
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Patch('editPermissions/:id')
@UseGuards(IJwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
async editPermissions(@Param('id') id: string,@Request() req:any,@Body(new ParseArrayPipe({ items: CreateModulePermissionDto }))
body: CreateModulePermissionDto[],) {
  let d=body.map(item => item.moduleName)
  if(new Set(d).size !== d.length)
  {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error:'module name must be unique',
      message: 'Module name must be unique',
    }, HttpStatus.BAD_REQUEST);
  }
  else{
    let save= await this.prodoPermissionService.editPermissions(id,req.user.id,body);
    if(save){
      return {statusCode:200,message:"Successfully updated permissions",data:save}
    }  
    else{
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Not updated permissions',
        message: "Not updated permissions",
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}

  
}