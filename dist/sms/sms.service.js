"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sms_entity_1 = require("./sms.entity");
let SmsService = class SmsService {
    constructor(SmsTemplateRepository) {
        this.SmsTemplateRepository = SmsTemplateRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.SmsTemplateRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.SmsTemplateRepository.findOne(id);
        });
    }
    update(id, SmsTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.SmsTemplateRepository.update(id, SmsTemplate);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.SmsTemplateRepository.delete(id);
        });
    }
    save(SmsTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.SmsTemplateRepository.save(SmsTemplate);
        });
    }
    saveData(SmsTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("number in service-", SmsTemplate);
        });
    }
};
SmsService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(sms_entity_1.SmsTemplate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], SmsService);
exports.SmsService = SmsService;
//# sourceMappingURL=sms.service.js.map