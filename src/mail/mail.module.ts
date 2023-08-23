require('dotenv').config();
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { User } from './../users/user.entity';
import { TypeOrmModule } from "@nestjs/typeorm";






@Module({
  imports: [ TypeOrmModule.forFeature([User])],
  controllers: [MailController,WhatsappController],
  providers: [MailService,WhatsappService],
  exports:[MailService,WhatsappService]
})
export class MailModule {}
