import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import {SmsTemplate} from './sms.entity'
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './../users/user.entity';
import { zohoToken } from './token.entity';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
import { zohoSalesOrderByUser } from './zohoSalesOrderByUser.entity';
import { UserModule } from './../users/user.module';
import { ProductModule } from './../product/product.module';
import { zohoSalesOrderService } from './zohoSalesOrder.service';
import { zohoSalesOrderController } from './zohoSalesOrder.controller';
@Module({
  imports: [
      TypeOrmModule.forFeature([SmsTemplate,User,zohoToken,zohoSalesOrder,zohoSalesOrderByUser]),UserModule,ProductModule
  ],
  controllers: [SmsController,zohoSalesOrderController],
  providers: [SmsService,zohoSalesOrderService],
  exports:[SmsService,zohoSalesOrderService,TypeOrmModule.forFeature([SmsTemplate])]
})
export class SmsModule {}

