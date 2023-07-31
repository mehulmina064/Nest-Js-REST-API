import { Module } from '@nestjs/common';
import { ManufactureService } from './manufacture.service';
import { ManufactureController } from './manufacture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacture } from './manufacture.entity';
import { zohoToken } from './../sms/token.entity';


@Module({
  controllers: [ManufactureController],
  providers: [ManufactureService],
  imports : [TypeOrmModule.forFeature([Manufacture,zohoToken])],
  exports:[ManufactureService,TypeOrmModule.forFeature([Manufacture,zohoToken])]

})
export class ManufactureModule {}
