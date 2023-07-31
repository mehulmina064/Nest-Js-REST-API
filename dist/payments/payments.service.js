"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const payment_terms_entity_1 = require("./payment-terms.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payments_entity_1 = require("./payments.entity");
const typeorm_2 = require("typeorm");
const paymentGateway_entity_1 = require("./paymentGateway.entity");
let PaymentService = class PaymentService {
    constructor(paymentRepository, paymentGatewayAccountRepository, paymentGatewayRepository, paymentTermsRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentGatewayAccountRepository = paymentGatewayAccountRepository;
        this.paymentGatewayRepository = paymentGatewayRepository;
        this.paymentTermsRepository = paymentTermsRepository;
    }
    findAll(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (filter) {
                return yield this.paymentTermsRepository.find(filter);
            }
            return yield this.paymentTermsRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentTermsRepository.findOne(id);
        });
    }
    save(payment) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentTermsRepository.save(payment);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentTermsRepository.delete(id);
        });
    }
    update(id, payment) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentTermsRepository.update(id, payment);
        });
    }
    getPaymentGateways(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentGatewayRepository.find();
        });
    }
    savePaymentGateway(paymentGateway) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentGatewayRepository.save(paymentGateway);
        });
    }
    deletePaymentGateway(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentGatewayRepository.delete(id);
        });
    }
    updatePaymentGateway(id, paymentGateway) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentGatewayRepository.update(id, paymentGateway);
        });
    }
};
PaymentService = tslib_1.__decorate([
    common_1.Controller('payment'),
    tslib_1.__param(0, typeorm_1.InjectRepository(payments_entity_1.Payments)),
    tslib_1.__param(1, typeorm_1.InjectRepository(paymentGateway_entity_1.PaymentGatewayAccount)),
    tslib_1.__param(2, typeorm_1.InjectRepository(paymentGateway_entity_1.PaymentGateway)),
    tslib_1.__param(3, typeorm_1.InjectRepository(payment_terms_entity_1.PaymentTerms)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payments.service.js.map