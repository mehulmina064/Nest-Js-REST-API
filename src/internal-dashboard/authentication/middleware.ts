import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesAndPermission } from '../prodoPermissionAndGroup/prodoRolesAndPermissionGroups.entity';
import { Repository } from 'typeorm';
import { prodoRoles } from '../prodoRoles/prodoRoles.entity';
import { prodoPermissionGroup } from '../prodoPermissionAndGroup/prodoPermissionGroup.entity';
import { UserAndRoles } from '../prodoRoles/EmployeeAndRoles.entity';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
import { userRolesService } from '../prodoRoles/userRoles.service';
import { ModuleNames } from '../prodoPermissionAndGroup/moduleNames.constant';
import { UserRole } from '../zohoEmployee/prodoRoles.constants';

import { prodoPermissionService } from '../prodoPermissionAndGroup/prodoPermission.service'
var ObjectId = require('mongodb').ObjectID;

 



@Injectable()
export class roleMiddleware implements NestMiddleware {

  constructor(private readonly zohoEmployeeService: zohoEmployeeService,
  private readonly rolesPermissionGroupService : rolesPermissionGroupService,
  private readonly userRolesService:userRolesService,
  private readonly prodoPermissionService:prodoPermissionService,


    ) {}

  async use(req: Request, res: Response, next: NextFunction){
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      // access_token: this.jwtService.sign(payload), 
      let decoded1:any
      jwt.verify(token, 'prodoadminsecret',function(err, decoded){
        if (err) {
          throw new HttpException("Token Expired Please log in Again or contact admin for new", HttpStatus.BAD_REQUEST);
        }
        else{
          decoded1=decoded
        }
      })
      const user = await this.zohoEmployeeService.findOne(decoded1.id);
       if(!user)
       {
        throw new HttpException({
          status: HttpStatus.EXPECTATION_FAILED,
          error: 'EXPECTATION_FAILED',
          message: "User Not Found", 
        }, HttpStatus.EXPECTATION_FAILED);
       }
      if(user.roles.includes(UserRole.PRODO_ADMIN)){
        console.log("the user is prodo admin therefore has all the permissions");
        next()
      }
      else {

        let query = {where: { userId: String(user.id)}}
    let alluserroles = await this.userRolesService.findAll(query)
    let roleIds = []
    let requestMethod = req.method
      for(let i of alluserroles.data){
        roleIds.push({roleId : i.roleId})
      }
      let result = await this.rolesPermissionGroupService.findAll({where : { $or : roleIds}})
      let pgIds=[]
      // let result1 = await this.prodoPermissionService.findAll({where : { $and: [{"permissions.moduleName":'User'}]}})  
      let moduleName = (req.url.split('/'))[2]
      if(moduleName=="zohoData"){
        moduleName = (req.url.split('/'))[3]
      }
      if(moduleName.split('?').length>1)
      {
        moduleName=moduleName.split('?')[0]
      }
      console.log(moduleName);
      
      let fullaccesscheck,result1
      
      switch(moduleName){
        case 'employee':
          moduleName=ModuleNames.Employee
          break;
            case 'batch':
              moduleName=ModuleNames.Batch
              break;
            case 'roles':
              moduleName=ModuleNames.Role
            break;
            case 'so':                                            /// so means sales order
            moduleName=ModuleNames.SalesOrder
            break;
            case 'po':
              moduleName=ModuleNames.PurchaseOrder
              break;
            case 'invoice':
             moduleName=ModuleNames.Invoice
             break;
            case 'InvoicePod':
                  moduleName=ModuleNames.InvoicePod
              break;
            case 'teams':
                  moduleName=ModuleNames.Team
              break;
             case 'userRoles':
                    moduleName=ModuleNames.UserRole
                    break;
             case 'rolePermission':
                    moduleName=ModuleNames.RolePermission
                    break;
             case 'bills':
                      moduleName=ModuleNames.Bill
                      break;
             case 'customers':
                    moduleName=ModuleNames.Customer
                    break;
             case 'products':
                  moduleName=ModuleNames.Product
                   break;
             case 'rfq':
                  moduleName=ModuleNames.Rfq
                  break;
              case 'mail':
                    moduleName=ModuleNames.Mail
                    break;
              case 'whatsapp':
                      moduleName=ModuleNames.Whatsapp
                      break;
              case 'organization':
                  moduleName=ModuleNames.Organization
                  break;
              case 'company':
                      moduleName=ModuleNames.Company
                      break;
              case 'entity':
                      moduleName=ModuleNames.Entity
                      break;
              case 'parentSku':
                  moduleName=ModuleNames.ParentSku
                       break;
              case 'users':
                   moduleName=ModuleNames.User
                       break;
              case 'batchItem':
                      moduleName=ModuleNames.BatchItem
                       break;
              case 'batchItemProcess':
                        moduleName=ModuleNames.BatchItemProcess
                       break;

              default:
                        throw new HttpException('Contact Admin for the Module- '+moduleName, HttpStatus.NOT_IMPLEMENTED);
                        break;    
    
      }

      switch (requestMethod){
        case'GET':
        for(let i of result.data){
          pgIds.push({_id:ObjectId(i.permissionGroupId)})
          }
          fullaccesscheck = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.fullAccess":true}]}})
          if(fullaccesscheck.count){
          console.log("full access for the module detected");
              next();
              break
           }
           result1 = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.canView":true}]}})
          if(result1.count){
            console.log("have perm..");
            next();
          }
          else{
          throw new HttpException('Insufficent Permissions for the Module- '+moduleName, HttpStatus.UNAUTHORIZED);
          }
          break;
        case 'POST':
          for(let i of result.data){
            pgIds.push({_id:ObjectId(i.permissionGroupId)})
          }  
           fullaccesscheck = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.fullAccess":true}]}})
          if(fullaccesscheck.count){
             console.log("full access for the module detected");
             next();
             break
          }    
           result1 = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.canCreate":true}]}})
          if(result1.count){
            console.log("have perm..");
            next();
          }
          else{
          throw new HttpException('Insufficent Permissions for the Module- '+moduleName, HttpStatus.UNAUTHORIZED);
          }
          break;
        case 'PATCH':
          for(let i of result.data){
            pgIds.push({_id:ObjectId(i.permissionGroupId)})
          }  
           fullaccesscheck = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.fullAccess":true}]}})
          if(fullaccesscheck.count){
             console.log("full access for the module detected");
             next();
             break
          }    
           result1 = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.canEdit":true}]}})
          if(result1.count){
            console.log("have perm..");
            next();
          }
          else{
          throw new HttpException('Insufficent Permissions for the Module- '+moduleName, HttpStatus.UNAUTHORIZED);
          }
          break;
        case 'DELETE':   
        for(let i of result.data){
          pgIds.push({_id:ObjectId(i.permissionGroupId)})
        }  
         fullaccesscheck = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.fullAccess":true}]}})
        if(fullaccesscheck.count){
           console.log("full access for the module detected");
           next();
           break
        }    
         result1 = await this.prodoPermissionService.findAll({where : { $or : [...pgIds], $and: [{"permissions.moduleName":moduleName},{"permissions.canDelete":true}]}})
        if(result1.count){
          console.log("have perm..");
          next();
        }
        else{
        throw new HttpException('Insufficent Permissions for the Module- '+moduleName, HttpStatus.UNAUTHORIZED);
        }
        break;
        
        default:
          throw new HttpException('Contact Admin for the Module- '+moduleName, HttpStatus.NOT_IMPLEMENTED);
          break



      }
      }
    }
    else{
      throw new HttpException('Access Token Required', HttpStatus.PROXY_AUTHENTICATION_REQUIRED);
    }
    }
  }