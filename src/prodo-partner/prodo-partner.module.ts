import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdoPartner } from './prodo-partner.entity';
import { ProdoPartnerService } from './prodo-partner.service';
import { ProdoPartnerController } from './prodo-partner.controller';
import { MailModule } from '../mail/mail.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProdoPartner]), MailModule, MailTriggerModule ],
  providers: [ProdoPartnerService],
  controllers: [ProdoPartnerController],
})
export class ProdoPartnerModule {}
