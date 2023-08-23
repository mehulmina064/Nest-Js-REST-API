import { OrganizationType, OrganizationDomain, OrganizationStatus } from './../organization/organization.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository, FindManyOptions, getRepository } from 'typeorm';
import { User, UserStatus, UserType } from './user.entity';
import { Permission, UserRole } from '../users/roles.constants';
import * as CryptoJS from 'crypto-js';
import * as xlsx from 'xlsx';
import { MailService } from '../mail/mail.service';
import { UserCreateDto, UserDto } from './user.dto';
import { Organization } from '../organization/organization.entity';
import { K, template } from 'handlebars';
// import { SmsController } from './../sms/sms.controller';
import fetch from 'node-fetch'
import {HttpException,HttpStatus } from '@nestjs/common';
const http = require("https");
import { callbackPromise } from 'nodemailer/lib/shared';
import { OrganizationService } from './../organization/organization.service';


// import { Response } from 'express';
// import { Response } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly organizationService: OrganizationService,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async findAll(filter: FindManyOptions<User> | undefined): Promise<User[]> {
    // Convert String into ObjectId Object
    if(filter){
      console.log("filter exists")
      return await this.userRepository.find(filter);
    }
    console.log("filter does not exist")
    return await this.userRepository.find();
  }


  async findOne(id: string): Promise<User> {
    // console.log('id', id);
    const user = await this.userRepository.findOne(String(id));
    // console.log('user', user);
    return user
  }

  async findCombinedUserData(id: string,new_ticket){
    const user = await this.userRepository.findOne(String(id));
    // return user
    if(user){
      new_ticket.type=user.designation?`Designation-${user.designation}`:`Designation-${new_ticket.type}`
      new_ticket.title=user.companyName?`CompanyName- ${user.companyName}`:`CompanyName-${new_ticket.title}`
      new_ticket.email=user.email
      new_ticket.contactNumber=user.contactNumber
      let org = await this.organizationRepository.findOne(String(user.organization_id))
      new_ticket.title=`${org.name?`CompanyName- ${org.name}`:new_ticket.title} [${org.type?org.type:""}]`//company or Institute [Type of Org]
      return new_ticket
    }
    else{
      return new_ticket
    }
   
  }
 
  //Get List of Available UserRoles
  async getUserRoles() {
    return Object.keys(Permission);
  }
  async filter(filter: any) {
    return await this.userRepository.find(filter);
  }

  async remove(id: ObjectId) {
    const order = await this.userRepository.findOne(id);
    await this.userRepository.delete(id);
    return order;
  }


  async assignRoles(id: ObjectId, roles: UserRole[]) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user);
    // if user.roles includes roles
    user.roles= await [...user.roles, ...roles];
    return await this.userRepository.save(user);
  }
  async addUser(user: User) {
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
      // return { status: 'failure', message: 'User already exists' };
    } else {
      user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
      user.isVerified=false;
      const newUser = await this.userRepository.save(user);
      return { status: 'success', message: 'User created successfully', data: newUser };
    }
  }
  async save(user: User, account:Account, organization:Organization) {
    // check if user already exists
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
      // return { status: 'failure', message: 'User already exists' };
    }
    console.log("user",user);
    console.log("account",account);
    console.log("organization",organization);
    // create account

    user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
    var saveUser = await this.userRepository.save(user);
    var userName = saveUser.firstName +' '+ saveUser.lastName;
    account.email=user.email;
    var saveOrganization = await this.organizationRepository.save(organization);
    saveUser.organization_id = String(saveOrganization.id);
    saveOrganization.customerId=String(saveOrganization.id)
    saveOrganization.companyIds=[]
    saveOrganization.entityIds=[]
    saveOrganization.status=OrganizationStatus.ACTIVE
    //is
    saveUser.status=UserStatus.ACTIVE
    await this.userRepository.save(saveUser);
    await this.organizationRepository.save(saveOrganization);

       return {
         "user" : saveUser,
         "organization" :saveOrganization};
     }

  async update(id: string | number | Date | ObjectId  | string[] | number[] | Date[] | ObjectId[], user: Partial<User>) {
    if (user.roles && user.roles.length > 0) {
      throw new HttpException({
        status: 400,
        error: "You cannot change your own role", 
        message: "You cannot change your own role"
      }, HttpStatus.BAD_REQUEST);
    }
    let data= await this.userRepository.update(id, user);
    let saveUser=await this.userRepository.findOne(id);
    return data;
  }

  async updatePassword(id: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | undefined, user: any) {
    user.currentPassword = CryptoJS.HmacSHA1(user.currentPassword, 'jojo').toString();
    console.log(user);
    const foundUser = await this.userRepository.findOne(id);
    if (foundUser.password !== user.currentPassword) {
      return { status: 'failure', message: 'Current Password do not match' };
    }
    user.password = CryptoJS.HmacSHA1(user.newPassword, 'jojo').toString();
    user.confirmPassword = CryptoJS.HmacSHA1(user.confirmPassword, 'jojo').toString();
    if (user.password !== user.confirmPassword) {
      return { status: 'failure', message: 'Passwords do not match' };
    }
    return await this.userRepository.update(id, { password: user.password });
  }

  async login(user:any) {
    user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
    const criteria = (user.email.indexOf('@') === -1) ? { contactNumber :user.email } : { email :user.email};
    const foundUser = await this.userRepository.findOne(criteria)
    console.log('foundUser in userService ',foundUser);
    if (foundUser) {
    const pass = foundUser.password;
      if( pass != user.password){ 
        throw new HttpException({
          status: 400,
          error: "Bad Request", 
          message: 'Wrong Password'
        }, HttpStatus.BAD_REQUEST);
      }
     foundUser.lastLoginAt=new Date();
      await this.userRepository.update(foundUser.id,foundUser)
      return { status: 'success', message: 'User logged in successfully', user: foundUser };
    }else{
      throw new HttpException({
        status: 400,
        error: "Bad Request", 
        message: 'User not found'
      }, HttpStatus.BAD_REQUEST);
      return { status: 'failure', message: 'User not found'};      
    }
      
  }



  async updateOrganizationDomains() {
    let organizations = await this.organizationRepository.find({where: {domain: {$exists: false}}});
    organizations.forEach(async organization => {
      organization.domains = [OrganizationDomain.PROCUREMENT, OrganizationDomain.INVENTORY, OrganizationDomain.ECOMMERCE];
      let saveOrganization = await this.organizationRepository.save(organization);
      console.log('saveOrganization',saveOrganization);
    }
    );
    return { status: 'success', message: 'Organization domains updated successfully' };

  }
  async createUser(user: User) {
    const foundUser = await this.userRepository.findOne({ email: user.email });
    if (foundUser) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: "User already exists"
      }, HttpStatus.FORBIDDEN);
      // return { status: 'failure', message: 'User already exists' };
    }
    else {
      const newuser = await this.userRepository.save(user);
      return { status: 'success', message: 'User created successfully', user: newuser };
    }
  }
  async addUserToOrganization(user: User, organizationId: string, adminUser: User) {
    user.organization_id = organizationId;
    const organization = await this.organizationRepository.findOne(organizationId);
    user.accountId = adminUser.accountId;
    let password= "hello";
    console.log('-----------password----',password);
    user.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
    user.createdBy = String(adminUser.id);
    user.isVerified=false;
    console.log('user',user);
    user.roles = [...user.roles, UserRole.USER];
    console.log('roles',user.roles);
    const newuser = await this.userRepository.save(user);
    console.log("zohouser",user);
    newuser.password=password;
    let mailOptions = {
      TriggerName: 'AddUserToOrganization',
      doc: organization,
      templatevars: {
        user: newuser,
        organization: organization,
      }
    }
    return { status: 'success', message: 'User added successfully', user: newuser };
  }

}


