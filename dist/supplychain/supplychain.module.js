"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const supplychain_entity_1 = require("./supplychain.entity");
const supplychain_service_1 = require("./supplychain.service");
const supplychain_controller_1 = require("./supplychain.controller");
const supply_chain_item_entity_1 = require("./supply-chain-item.entity");
const supplychain_entity_2 = require("./supplychain.entity");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const passport_1 = require("@nestjs/passport");
let SupplyChainModule = class SupplyChainModule {
};
SupplyChainModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([supplychain_entity_1.SupplyChain, supply_chain_item_entity_1.SupplyChainFeedItem]),
            mail_module_1.MailModule,
            authentication_module_1.AuthenticationModule,
            passport_1.PassportModule,
        ],
        controllers: [supplychain_controller_1.SupplyChainController],
        providers: [supplychain_service_1.SupplyChainService],
        exports: [supplychain_service_1.SupplyChainService, typeorm_1.TypeOrmModule.forFeature([supplychain_entity_1.SupplyChain, supply_chain_item_entity_1.SupplyChainFeedItem, supplychain_entity_2.SupplyChainType])],
    })
], SupplyChainModule);
exports.SupplyChainModule = SupplyChainModule;
//# sourceMappingURL=supplychain.module.js.map