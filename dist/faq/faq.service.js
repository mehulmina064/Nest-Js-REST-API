"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const faq_entity_1 = require("./faq.entity");
const crypto = require('crypto');
let FaqService = class FaqService {
    constructor(faqRepository) {
        this.faqRepository = faqRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.faqRepository.find();
        });
    }
    findAllByType(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.faqRepository.find({ type });
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.faqRepository.findOne(id);
        });
    }
    save(faq) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.faqRepository.save(faq);
        });
    }
    update(id, faq) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.faqRepository.update(id, faq);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.faqRepository.findOne(id).then(result => {
                this.faqRepository.delete(result);
            });
        });
    }
};
FaqService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(faq_entity_1.Faq)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], FaqService);
exports.FaqService = FaqService;
//# sourceMappingURL=faq.service.js.map