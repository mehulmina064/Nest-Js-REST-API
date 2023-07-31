import { Module } from '@nestjs/common';
import { TempuserService } from './tempuser.service';
import { TempuserController } from './tempuser.controller';
import { Tempuser } from './tempuser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  controllers: [TempuserController],
  providers: [TempuserService],
  imports : [TypeOrmModule.forFeature([Tempuser,User])],
  exports : [TempuserService]
})
export class TempuserModule {}
