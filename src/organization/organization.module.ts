import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./organization.entity";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";
import { UserService } from "./../users/user.service";
import { User } from './../users/user.entity';



@Module({
    imports: [ TypeOrmModule.forFeature([Organization]), TypeOrmModule.forFeature([User]), MailModule, AuthenticationModule ],
    controllers: [ OrganizationController ],
    providers: [ OrganizationService],
    exports: [ OrganizationService,TypeOrmModule.forFeature([Organization])],
})
export class OrganizationModule { }