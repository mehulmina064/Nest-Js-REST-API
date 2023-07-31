import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../users/user.module';
import { AddressModule } from '../addresses/address.module';
import { MailModule } from '../mail/mail.module';
import { MailTriggerModule } from '../mailTrigger/mailTrigger.module';

@Module({
  imports: [AddressModule, UserModule, MailModule, TypeOrmModule.forFeature([Order]), MailTriggerModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
