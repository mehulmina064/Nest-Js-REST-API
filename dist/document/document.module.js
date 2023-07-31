"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const document_status_entity_1 = require("./document-status.entity");
const client_data_entity_1 = require("./../clientData/client-data.entity");
const supplychain_entity_1 = require("./../supplychain/supplychain.entity");
const client_data_module_1 = require("./../clientData/client-data.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const document_entity_1 = require("./document.entity");
const document_service_1 = require("./document.service");
const document_controller_1 = require("./document.controller");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const passport_1 = require("@nestjs/passport");
const supplychain_module_1 = require("../supplychain/supplychain.module");
const category_module_1 = require("./../categories/category.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
let DocumentModule = class DocumentModule {
};
DocumentModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([document_entity_1.Document, supplychain_entity_1.SupplyChain, client_data_entity_1.ClientData, document_status_entity_1.StatusTemplate, document_status_entity_1.DocumentStatus]),
            mail_module_1.MailModule,
            authentication_module_1.AuthenticationModule,
            passport_1.PassportModule,
            supplychain_module_1.SupplyChainModule,
            client_data_module_1.ClientDataModule,
            mail_module_1.MailModule,
            category_module_1.CategoryModule,
            mailTrigger_module_1.MailTriggerModule
        ],
        controllers: [document_controller_1.DocumentController],
        providers: [document_service_1.DocumentService],
        exports: [document_service_1.DocumentService, typeorm_1.TypeOrmModule.forFeature([document_entity_1.Document])],
    })
], DocumentModule);
exports.DocumentModule = DocumentModule;
//# sourceMappingURL=document.module.js.map