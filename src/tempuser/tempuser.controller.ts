import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { TempuserService } from './tempuser.service';
import { UserRole } from '../users/roles.constants';


@Controller('tempuser')
export class TempuserController {
  constructor(private readonly tempuserService: TempuserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,) {}



  @Get()
@UseGuards(JwtAuthGuard) 
  async findAll(@Request() req :any) {
    let user = await this.userRepository.findOne(req.user.id)
    if(!user){
      console.log("throw exception that the user does not exists");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "user does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    if(user.roles.includes(UserRole.PRODO_ADMIN)){
      console.log("here show the user all the invites");
      return await this.tempuserService.findAll()
    }
    else{
      return await this.tempuserService.findUserInvites(user)
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) 
  async findOne(@Param('id') id: any,@Request() req :any) {
    let user = await this.userRepository.findOne(id)
    // let adminUser = await this.userRepository.findOne(req.user.id)
    if(!user){
      console.log("throw exception that the user does not exists");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User Does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    console.log("further checks will happen");
    // if(adminUser.roles.includes(UserRole.PRODO_ADMIN)){
      console.log("here show the user all the invites");
      return await this.tempuserService.findUserInvites(user)
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  async remove(@Param('id') id: any,@Request() req:any) {
    let user = await this.userRepository.findOne(req.user.id)
    if(!user){
      console.log("throw exception");
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'EXPECTATION_FAILED',
        message: "User does not exists",
      }, HttpStatus.EXPECTATION_FAILED);
    }

    return await this.tempuserService.remove(id,user);
  }
}
