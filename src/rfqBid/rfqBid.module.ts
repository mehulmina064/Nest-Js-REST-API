import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { rfqBidController } from './rfqBid.controller';
import { rfqBidService } from './rfqBid.service';
import { rfqBid } from './rfqBid.entity';
import { MailService } from './../mail/mail.service';
import { zohoToken } from './../sms/token.entity';
import { WhatsappService } from './../mail/whatsapp.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([rfqBid,zohoToken])
    ],
    controllers: [rfqBidController],
    providers: [rfqBidService,MailService,WhatsappService],
    exports:[rfqBidService,TypeOrmModule.forFeature([rfqBid])]
  })
  export class rfqBidModule {}
