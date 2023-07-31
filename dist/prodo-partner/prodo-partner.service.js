"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prodo_partner_entity_1 = require("./prodo-partner.entity");
const crypto = require('crypto');
let ProdoPartnerService = class ProdoPartnerService {
    constructor(prodoPartnerRepository) {
        this.prodoPartnerRepository = prodoPartnerRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.prodoPartnerRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.prodoPartnerRepository.findOne(id);
        });
    }
    save(prodoPartner) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var prodo_partner = yield this.prodoPartnerRepository.save(prodoPartner);
            return prodo_partner;
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.prodoPartnerRepository.findOne(id).then(result => {
                this.prodoPartnerRepository.delete(result);
            });
        });
    }
};
ProdoPartnerService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(prodo_partner_entity_1.ProdoPartner)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], ProdoPartnerService);
exports.ProdoPartnerService = ProdoPartnerService;
//# sourceMappingURL=prodo-partner.service.js.map