// Module for Supply Chain

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupplyChain } from "./supplychain.entity";
import { SupplyChainService } from "./supplychain.service";
import { SupplyChainController } from "./supplychain.controller";
import { SupplyChainFeedItem } from "./supply-chain-item.entity";
import { SupplyChainType } from "./supplychain.entity";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplyChain, SupplyChainFeedItem]),
    
    MailModule,
    AuthenticationModule,
    PassportModule,
    ],
    controllers: [SupplyChainController],
    providers: [SupplyChainService],
    exports: [SupplyChainService, TypeOrmModule.forFeature([SupplyChain, SupplyChainFeedItem, SupplyChainType])],

})
export class SupplyChainModule {}
