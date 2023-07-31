//Module for Employee

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./employee.entity";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PassportModule } from "@nestjs/passport";
import { Organization } from "../organization/organization.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Employee]),
        MailModule,
        AuthenticationModule,
        PassportModule,
        TypeOrmModule.forFeature([Organization]),
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService, TypeOrmModule.forFeature([Employee])],
})
export class EmployeeModule {}
