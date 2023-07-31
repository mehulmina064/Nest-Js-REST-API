"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prodo_power_club_entity_1 = require("./prodo-power-club.entity");
const prodo_power_club_service_1 = require("./prodo-power-club.service");
const prodo_power_club_controller_1 = require("./prodo-power-club.controller");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
let ProdoPowerClubModule = class ProdoPowerClubModule {
};
ProdoPowerClubModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([prodo_power_club_entity_1.ProdoPowerClub]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule],
        providers: [prodo_power_club_service_1.ProdoPowerClubService],
        controllers: [prodo_power_club_controller_1.ProdoPowerClubController],
    })
], ProdoPowerClubModule);
exports.ProdoPowerClubModule = ProdoPowerClubModule;
//# sourceMappingURL=prodo-power-club.module.js.map