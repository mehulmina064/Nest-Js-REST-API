"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const white_labeling_or_rfq_entity_1 = require("./white-labeling-or-rfq.entity");
const mail_service_1 = require("../mail/mail.service");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
const http = require("https");
const crypto = require('crypto');
let WhiteLabelingOrRfqService = class WhiteLabelingOrRfqService {
    constructor(whiteLabelingOrRfqRepository, mailservice, mailtriggerservice) {
        this.whiteLabelingOrRfqRepository = whiteLabelingOrRfqRepository;
        this.mailservice = mailservice;
        this.mailtriggerservice = mailtriggerservice;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rfqs = this.whiteLabelingOrRfqRepository.find();
            return rfqs;
        });
    }
    findTypeByUser(type, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.whiteLabelingOrRfqRepository.find({ type, userId });
        });
    }
    findAllByUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.whiteLabelingOrRfqRepository.find({ userId });
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.whiteLabelingOrRfqRepository.findOne(id);
        });
    }
    save(WhiteLabelingOrRfq) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const createdwhiteLabelingOrRfq = yield this.whiteLabelingOrRfqRepository.save(WhiteLabelingOrRfq);
            const name = yield createdwhiteLabelingOrRfq.name;
            let mailOptions = {
                TriggerName: 'rfqSubmit',
                doc: createdwhiteLabelingOrRfq,
                templatevars: {
                    name: name,
                    companyname: createdwhiteLabelingOrRfq.organisation,
                    email: createdwhiteLabelingOrRfq.workEmail,
                    file: createdwhiteLabelingOrRfq.file,
                    products: JSON.stringify(createdwhiteLabelingOrRfq.products),
                    number: createdwhiteLabelingOrRfq.mobileNumber
                }
            };
            this.mailtriggerservice.SendMail(mailOptions);
            return createdwhiteLabelingOrRfq;
        });
    }
    update(id, whiteLabelingOrRfq) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.whiteLabelingOrRfqRepository.update(id, whiteLabelingOrRfq);
            return this.whiteLabelingOrRfqRepository.findOne(id);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.whiteLabelingOrRfqRepository.findOne(id).then(result => {
                this.whiteLabelingOrRfqRepository.delete(result);
            });
        });
    }
};
WhiteLabelingOrRfqService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(white_labeling_or_rfq_entity_1.WhiteLabelingOrRfq)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        mailTrigger_service_1.MailTriggerService])
], WhiteLabelingOrRfqService);
exports.WhiteLabelingOrRfqService = WhiteLabelingOrRfqService;
//# sourceMappingURL=white-labeling-or-rfq.service.js.map