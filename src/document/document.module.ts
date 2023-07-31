import { StatusTemplate, DocumentStatus } from './document-status.entity';
import { ClientData } from './../clientData/client-data.entity';
import { SupplyChain } from './../supplychain/supplychain.entity';
import { ClientDataModule } from './../clientData/client-data.module';
// Module for Document

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "./document.entity";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PassportModule } from "@nestjs/passport";
import { SupplyChainModule } from "../supplychain/supplychain.module";
import { CategoryModule } from './../categories/category.module';
import { MailTriggerModule } from './../mailTrigger/mailTrigger.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Document, SupplyChain, ClientData,StatusTemplate,DocumentStatus]),
        MailModule,
        AuthenticationModule,
        PassportModule,
        SupplyChainModule,
        ClientDataModule,
        MailModule,
        CategoryModule,
        MailTriggerModule
    ],
    controllers: [DocumentController],
    providers: [DocumentService],
    exports: [DocumentService, TypeOrmModule.forFeature([Document])],
})
export class DocumentModule {}