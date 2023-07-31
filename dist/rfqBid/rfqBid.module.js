"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rfqBid_controller_1 = require("./rfqBid.controller");
const rfqBid_service_1 = require("./rfqBid.service");
const rfqBid_entity_1 = require("./rfqBid.entity");
const mail_service_1 = require("./../mail/mail.service");
const token_entity_1 = require("./../sms/token.entity");
const whatsapp_service_1 = require("./../mail/whatsapp.service");
let rfqBidModule = class rfqBidModule {
};
rfqBidModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([rfqBid_entity_1.rfqBid, token_entity_1.zohoToken])
        ],
        controllers: [rfqBid_controller_1.rfqBidController],
        providers: [rfqBid_service_1.rfqBidService, mail_service_1.MailService, whatsapp_service_1.WhatsappService],
        exports: [rfqBid_service_1.rfqBidService, typeorm_1.TypeOrmModule.forFeature([rfqBid_entity_1.rfqBid])]
    })
], rfqBidModule);
exports.rfqBidModule = rfqBidModule;
//# sourceMappingURL=rfqBid.module.js.map