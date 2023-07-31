import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdoPowerClub } from './prodo-power-club.entity';
import { ProdoPowerClubService } from './prodo-power-club.service';
import { ProdoPowerClubController } from './prodo-power-club.controller';
import { MailModule } from '../mail/mail.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
@Module({
  imports: [TypeOrmModule.forFeature([ProdoPowerClub]), MailModule, MailTriggerModule],
  providers: [ProdoPowerClubService],
  controllers: [ProdoPowerClubController],
})
export class ProdoPowerClubModule {}
