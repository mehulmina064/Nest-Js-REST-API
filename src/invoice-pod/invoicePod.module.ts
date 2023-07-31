import { Module } from '@nestjs/common';
import { SmsController } from './../sms/sms.controller';
import { SmsService } from './../sms/sms.service';
import {SmsTemplate} from './../sms/sms.entity'
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './../users/user.entity';
import { zohoToken } from './../sms/token.entity';
import { zohoSalesOrder } from './../sms/zohoSalesOrder.entity';
import { zohoSalesOrderByUser } from './../sms/zohoSalesOrderByUser.entity';
import { UserModule } from './../users/user.module';
import { ProductModule } from './../product/product.module';
import { zohoSalesOrderService } from './../sms/zohoSalesOrder.service';
import { zohoSalesOrderController } from './../sms/zohoSalesOrder.controller';
import { invoicePod } from './invoicePod.entity';
import { invoicePodService } from './invoicePod.service';
import { invoicePodController } from './invoicePod.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([SmsTemplate,User,zohoToken,zohoSalesOrder,zohoSalesOrderByUser,invoicePod]),UserModule,ProductModule
  ],
  controllers: [SmsController,zohoSalesOrderController,invoicePodController],
  providers: [SmsService,zohoSalesOrderService,invoicePodService],
  exports:[SmsService,zohoSalesOrderService,TypeOrmModule.forFeature([SmsTemplate]),invoicePodService]
})
export class invoicePodModule {}

