import { forwardRef, Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './s3.service';
// import { S3 } from './s3.entity';
import { S3Controller } from './s3.controller';
// import { Otp } from './otp.entity';
// import { MailModule } from '../mail/mail.module';
import { AuthenticationModule } from '../authentication/authentication.module';
// import { Account } from '../account/account.entity';
// import { Organization } from '../organization/organization.entity';
// import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
// import { dashboardData } from './dashboardData.entity';
// import { ProductModule } from './../product/product.module';
// import { CategoryModule } from './../categories/category.module';
// import { salesOrderReview } from './salesOrderReview.entity';
@Module({
    imports: [forwardRef(() => AuthenticationModule)],
    providers: [S3Service],
    controllers: [S3Controller],
    exports: [S3Service],
  })
  export class S3Module {}
