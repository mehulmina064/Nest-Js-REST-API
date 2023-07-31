import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "./company.entity";
import { companyController } from "./company.controller";
import { companyService } from "./company.service";
import { entitiesModule } from "./../entities/entities.module";
import { entitiesService } from "./../entities/entities.service";
// import { UserService } from "../users/user.service";
import { User } from "../users/user.entity";
import { Organization } from "../organization/organization.entity";


@Module({
    imports: [ TypeOrmModule.forFeature([Company,User,Organization]),entitiesModule],
    controllers: [ companyController ],
    providers: [ companyService,entitiesService ],
    exports: [ companyService , TypeOrmModule.forFeature([Company,User]),entitiesService],
})
export class companyModule { }