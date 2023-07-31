"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prodo_partner_entity_1 = require("./prodo-partner.entity");
const prodo_partner_service_1 = require("./prodo-partner.service");
const prodo_partner_controller_1 = require("./prodo-partner.controller");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
let ProdoPartnerModule = class ProdoPartnerModule {
};
ProdoPartnerModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([prodo_partner_entity_1.ProdoPartner]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule],
        providers: [prodo_partner_service_1.ProdoPartnerService],
        controllers: [prodo_partner_controller_1.ProdoPartnerController],
    })
], ProdoPartnerModule);
exports.ProdoPartnerModule = ProdoPartnerModule;
//# sourceMappingURL=prodo-partner.module.js.map