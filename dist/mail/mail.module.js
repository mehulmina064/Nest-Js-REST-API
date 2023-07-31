"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require('dotenv').config();
const common_1 = require("@nestjs/common");
const mail_controller_1 = require("./mail.controller");
const mail_service_1 = require("./mail.service");
const whatsapp_service_1 = require("./whatsapp.service");
const whatsapp_controller_1 = require("./whatsapp.controller");
const user_entity_1 = require("./../users/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const team_entity_1 = require("./../team/team.entity");
let MailModule = class MailModule {
};
MailModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]), typeorm_1.TypeOrmModule.forFeature([team_entity_1.Team])],
        controllers: [mail_controller_1.MailController, whatsapp_controller_1.WhatsappController],
        providers: [mail_service_1.MailService, whatsapp_service_1.WhatsappService],
        exports: [mail_service_1.MailService, whatsapp_service_1.WhatsappService]
    })
], MailModule);
exports.MailModule = MailModule;
//# sourceMappingURL=mail.module.js.map