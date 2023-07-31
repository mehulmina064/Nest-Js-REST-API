import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./account.entity";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";
import { Organization } from "../organization/organization.entity";
import { OrganizationService } from "../organization/organization.service";
import { OrganizationController } from "../organization/organization.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        MailModule,
        AuthenticationModule,
        PassportModule,
        TypeOrmModule.forFeature([Organization]),
    ],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService, TypeOrmModule.forFeature([Account])],

})
export class AccountModule {}