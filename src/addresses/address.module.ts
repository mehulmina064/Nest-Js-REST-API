import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { User } from './../users/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Address,User])],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
