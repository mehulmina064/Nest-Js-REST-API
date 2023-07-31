import { Module } from '@nestjs/common';
import { MailTrigger } from './mailTrigger.entity';
import { MailTriggerService } from './mailTrigger.service';
import { MailTriggerController } from './mailTrigger.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './../users/user.entity';
import { Team } from './../team/team.entity';
// import { TeamModule } from './../team/team.module';
import { MailModule } from './../mail/mail.module';
@Module({
  imports: [
      TypeOrmModule.forFeature([MailTrigger,Team]),
      MailModule,
  ],
  controllers: [MailTriggerController],
  providers: [MailTriggerService],
  exports:[MailTriggerService,TypeOrmModule.forFeature([MailTrigger])]
})
export class MailTriggerModule {}
 
