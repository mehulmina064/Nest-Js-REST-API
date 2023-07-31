import { getRepository } from 'typeorm';
import { UnimoveFilter } from 'src/inventory/unimove.filter';
// import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';

import { AddressService } from './address.service';
import { Address } from './address.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {
  }

  
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req): Promise<Address[]> {
    return this.addressService.findAll(req.user);
  }

  @Get('user/:userId')
  findAllUserAddresses(@Param('userId') userId: string): Promise<Address[]> {
    return this.addressService.findAllUserAddresses(userId);
  }

  @Get('byorg/:id')
  findByOrg(@Param('id') id: string) {
    return this.addressService.findByOrg(id);
  }
  

  @Post()
  @UseGuards(JwtAuthGuard)
  async save(@Body() address: Address,@Request() req:any) {
    let user = await this.userRepository.findOne(req.user.id)
    if(!user)
        {
            throw new HttpException({
              status: HttpStatus.NOT_FOUND,
              error: 'NOT_FOUND',
              message: "User Not Found",
            }, HttpStatus.NOT_FOUND);
          }
          else{
            address.companyIds=[user.companyId]
            address.entityIds=[user.entityId]
            return this.addressService.save(address);
          }

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() address: Address) {
    return this.addressService.update(id, address);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.addressService.remove(id);
  }

  @Get('address-as-string/:id') 
  getAddressAsString(@Param('id') id: string) {
    return this.addressService.getAddressAsString(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('fixAddress/')
  async fixAddress(@Request() req) {
    console.log('req', req.user);
   return await getRepository(Address).find({where:{ organization_id:req.user.organization_id }}).then(addresses => {
      addresses.forEach(async address => {
        address.addressType = 'shipping';
        address.country = 'India';
        await this.addressService.save(address);
      });
    }
    );

  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }
}
