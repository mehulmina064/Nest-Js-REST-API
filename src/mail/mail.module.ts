require('dotenv').config();
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { User } from './../users/user.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from './../team/team.entity';






@Module({
  imports: [ TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Team])],
  controllers: [MailController,WhatsappController],
  providers: [MailService,WhatsappService],
  exports:[MailService,WhatsappService]
})
export class MailModule {}
