"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const get_in_touch_entity_1 = require("./get-in-touch.entity");
const get_in_touch_service_1 = require("./get-in-touch.service");
const get_in_touch_controller_1 = require("./get-in-touch.controller");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
const user_module_1 = require("./../users/user.module");
const tickets_module_1 = require("./../tickets/tickets.module");
let GetInTouchModule = class GetInTouchModule {
};
GetInTouchModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([get_in_touch_entity_1.GetInTouch]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule, user_module_1.UserModule, tickets_module_1.TicketsModule],
        providers: [get_in_touch_service_1.GetInTouchService],
        controllers: [get_in_touch_controller_1.GetInTouchController],
    })
], GetInTouchModule);
exports.GetInTouchModule = GetInTouchModule;
//# sourceMappingURL=get-in-touch.module.js.map