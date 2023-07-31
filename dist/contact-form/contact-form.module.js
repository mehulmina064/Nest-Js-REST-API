"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contact_form_entity_1 = require("./contact-form.entity");
const contact_form_service_1 = require("./contact-form.service");
const contact_form_controller_1 = require("./contact-form.controller");
const mail_module_1 = require("../mail/mail.module");
const files_module_1 = require("../files/files.module");
const mailTrigger_module_1 = require("../mailTrigger/mailTrigger.module");
let ContactFormModule = class ContactFormModule {
};
ContactFormModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([contact_form_entity_1.ContactForm]), mail_module_1.MailModule, files_module_1.FilesModule, mailTrigger_module_1.MailTriggerModule],
        providers: [contact_form_service_1.ContactFormService],
        controllers: [contact_form_controller_1.ContactFormController],
    })
], ContactFormModule);
exports.ContactFormModule = ContactFormModule;
//# sourceMappingURL=contact-form.module.js.map