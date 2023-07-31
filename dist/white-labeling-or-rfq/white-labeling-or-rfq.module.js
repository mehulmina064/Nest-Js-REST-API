"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const white_labeling_or_rfq_entity_1 = require("./white-labeling-or-rfq.entity");
const white_labeling_or_rfq_service_1 = require("./white-labeling-or-rfq.service");
const white_labeling_or_rfq_controller_1 = require("./white-labeling-or-rfq.controller");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
let WhiteLabelingOrRfqModule = class WhiteLabelingOrRfqModule {
};
WhiteLabelingOrRfqModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([white_labeling_or_rfq_entity_1.WhiteLabelingOrRfq]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule],
        providers: [white_labeling_or_rfq_service_1.WhiteLabelingOrRfqService],
        controllers: [white_labeling_or_rfq_controller_1.WhiteLabelingOrRfqController],
        exports: [white_labeling_or_rfq_service_1.WhiteLabelingOrRfqService]
    })
], WhiteLabelingOrRfqModule);
exports.WhiteLabelingOrRfqModule = WhiteLabelingOrRfqModule;
//# sourceMappingURL=white-labeling-or-rfq.module.js.map