import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./organization.entity";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";
 import { Account } from "../account/account.entity";
import { UserService } from "./../users/user.service";
import { User } from './../users/user.entity';
import { companyService } from "./../company/company.service";
import { Company } from "./../company/company.entity";
import { companyModule } from "./../company/company.module";
import { entitiesModule } from "./../entities/entities.module";
import { entitiesService } from "./../entities/entities.service";



@Module({
    imports: [ TypeOrmModule.forFeature([Organization,Company]), TypeOrmModule.forFeature([User]), MailModule, AuthenticationModule,companyModule,entitiesModule ],
    controllers: [ OrganizationController ],
    providers: [ OrganizationService,companyService,entitiesService],
    exports: [ OrganizationService,TypeOrmModule.forFeature([Organization]),companyService,entitiesService],
})
export class OrganizationModule { }