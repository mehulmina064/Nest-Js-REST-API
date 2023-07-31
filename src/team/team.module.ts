import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import team entity and service and controller
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
import { UserModule } from './../users/user.module';

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([Team]), MailTriggerModule, UserModule],
  providers: [TeamService],
  controllers: [TeamController],
  exports: [TeamService],
})
export class TeamModule {}
