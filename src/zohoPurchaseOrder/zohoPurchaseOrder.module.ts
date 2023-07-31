import { Module } from '@nestjs/common';
import { zohoPurchaseOrder } from './zohoPurchaseOrder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import { dashboardData } from '../users/dashboardData.entity';
import { Otp } from '../users/otp.entity';
import { salesOrderReview } from '../users/salesOrderReview.entity';

import { ProductModule } from './../product/product.module';
import { MailModule } from '../mail/mail.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
import { Organization } from '../organization/organization.entity';
import { OrganizationService } from './../organization/organization.service';
import { Entitie } from './../entities/entity.entity';
import { Company } from '../company/company.entity';
import { zohoPurchaseOrderService } from './zohoPurchaseOrder.service';
import { zohoPurchaseOrderController } from './zohoPurchaseOrder.controller';
import { zohoToken } from './../sms/token.entity'; 
import { Account } from '../account/account.entity';
import { CategoryModule } from './../categories/category.module';
import { companyModule } from "./../company/company.module";
import { entitiesModule } from "./../entities/entities.module";
import { TempuserModule } from '../tempuser/tempuser.module';



@Module({
  controllers: [zohoPurchaseOrderController],
  providers: [zohoPurchaseOrderService,UserService,OrganizationService],
  imports : [TypeOrmModule.forFeature([zohoPurchaseOrder,Organization,Company,zohoToken,Entitie,User,Otp,Account,dashboardData,salesOrderReview]),MailModule,MailTriggerModule,ProductModule,CategoryModule,companyModule,entitiesModule,TempuserModule],
  exports: [ zohoPurchaseOrderService , TypeOrmModule.forFeature([zohoPurchaseOrder])],
})
export class zohoPurchaseOrderModule {} 
