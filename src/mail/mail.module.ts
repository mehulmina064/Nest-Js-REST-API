require('dotenv').config();
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { User } from './../users/user.entity';
import { TypeOrmModule } from "@nestjs/typeorm";






@Module({
  imports: [ TypeOrmModule.forFeature([User])],
  controllers: [MailController],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
