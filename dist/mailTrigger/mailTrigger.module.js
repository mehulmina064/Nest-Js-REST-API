"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mailTrigger_entity_1 = require("./mailTrigger.entity");
const mailTrigger_service_1 = require("./mailTrigger.service");
const mailTrigger_controller_1 = require("./mailTrigger.controller");
const typeorm_1 = require("@nestjs/typeorm");
const team_entity_1 = require("./../team/team.entity");
const mail_module_1 = require("./../mail/mail.module");
let MailTriggerModule = class MailTriggerModule {
};
MailTriggerModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([mailTrigger_entity_1.MailTrigger, team_entity_1.Team]),
            mail_module_1.MailModule,
        ],
        controllers: [mailTrigger_controller_1.MailTriggerController],
        providers: [mailTrigger_service_1.MailTriggerService],
        exports: [mailTrigger_service_1.MailTriggerService, typeorm_1.TypeOrmModule.forFeature([mailTrigger_entity_1.MailTrigger])]
    })
], MailTriggerModule);
exports.MailTriggerModule = MailTriggerModule;
//# sourceMappingURL=mailTrigger.module.js.map