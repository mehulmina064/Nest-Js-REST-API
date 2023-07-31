import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteLabelingOrRfq } from './white-labeling-or-rfq.entity';
import { WhiteLabelingOrRfqService } from './white-labeling-or-rfq.service';
import { WhiteLabelingOrRfqController } from './white-labeling-or-rfq.controller';
import { MailModule } from '../mail/mail.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';

@Module({
  imports: [TypeOrmModule.forFeature([WhiteLabelingOrRfq]), MailModule, MailTriggerModule], ],
  providers: [WhiteLabelingOrRfqService],
  controllers: [WhiteLabelingOrRfqController],
  exports:[WhiteLabelingOrRfqService]
})
export class WhiteLabelingOrRfqModule {}
