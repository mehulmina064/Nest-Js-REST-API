import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetInTouch } from './get-in-touch.entity';
import { GetInTouchService } from './get-in-touch.service';
import { GetInTouchController } from './get-in-touch.controller';
import { MailModule } from '../mail/mail.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
import { UserModule } from './../users/user.module';
import { TicketsModule } from './../tickets/tickets.module';

@Module({
  imports: [TypeOrmModule.forFeature([GetInTouch]), MailModule, MailTriggerModule,UserModule,TicketsModule],
  providers: [GetInTouchService],
  controllers: [GetInTouchController],
})
export class GetInTouchModule {}
