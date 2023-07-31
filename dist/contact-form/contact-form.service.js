"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mail_service_1 = require("../mail/mail.service");
const typeorm_2 = require("typeorm");
const contact_form_entity_1 = require("./contact-form.entity");
const crypto = require('crypto');
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
let ContactFormService = class ContactFormService {
    constructor(FormRepository, mailservice, mailTriggerService) {
        this.FormRepository = FormRepository;
        this.mailservice = mailservice;
        this.mailTriggerService = mailTriggerService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.FormRepository.find();
        });
    }
    findAllByType(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.FormRepository.find({ type });
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.FormRepository.findOne(id);
        });
    }
    save(Form) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var form = yield this.FormRepository.save(Form);
            var mailOptions = [];
            if (form.type == "join_the_team") {
                let mailOptions = {
                    TriggerName: 'JoinTheTeam',
                    doc: form,
                    templatevars: {
                        name: form.name,
                        email: form.email,
                        mobileNumber: form.mobileNumber,
                        linkedin: form.linkedin,
                        file: form.file
                    },
                };
                yield this.mailTriggerService.SendMail(mailOptions);
            }
            else {
                let mailOptions = {
                    TriggerName: 'BecomeASalesConsultant',
                    doc: form,
                    templatevars: {
                        name: form.name,
                        email: form.email,
                        mobileNumber: form.mobileNumber,
                        linkedin: form.linkedin
                    },
                };
                yield this.mailTriggerService.SendMail(mailOptions);
            }
            return form;
        });
    }
    update(id, ContactForm) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.FormRepository.update(id, ContactForm);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.FormRepository.findOne(id).then(result => {
                this.FormRepository.delete(result);
            });
        });
    }
};
ContactFormService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(contact_form_entity_1.ContactForm)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        mailTrigger_service_1.MailTriggerService])
], ContactFormService);
exports.ContactFormService = ContactFormService;
//# sourceMappingURL=contact-form.service.js.map