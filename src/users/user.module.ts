import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { Otp } from './otp.entity';
import { MailModule } from '../mail/mail.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Account } from '../account/account.entity';
import { Organization } from '../organization/organization.entity';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
import { dashboardData } from './dashboardData.entity';
import { ProductModule } from './../product/product.module';
import { CategoryModule } from './../categories/category.module';
import { salesOrderReview } from './salesOrderReview.entity';
import { OrganizationService } from './../organization/organization.service';
import { companyModule } from "./../company/company.module";
import { entitiesModule } from "./../entities/entities.module";
import { entitiesService } from "./../entities/entities.service";
import { companyService } from "./../company/company.service"
import { TempuserService } from '../tempuser/tempuser.service';
import { TempuserModule } from '../tempuser/tempuser.module';
import { zohoEmployeeModule } from '../internal-dashboard/zohoEmployee/zohoEmployee.module';


@Module({
    imports: [forwardRef(() => AuthenticationModule),TypeOrmModule.forFeature([User, Otp,dashboardData,salesOrderReview]), MailModule, TypeOrmModule.forFeature([Account, Organization]), MailTriggerModule,ProductModule,CategoryModule,companyModule,entitiesModule,TempuserModule,zohoEmployeeModule],
    providers: [UserService,OrganizationService,entitiesService,companyService],
    controllers: [UserController],
    exports: [UserService,entitiesService,companyService,zohoEmployeeModule],
  })
  export class UserModule {}
