"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    getPaymentTerms() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.getPaymentTerms();
        });
    }
    getPaymentGateway() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.getPaymentGateway();
        });
    }
    getPaymentGatewayById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.getPaymentGatewayById(id);
        });
    }
    getPaymentTermsById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.getPaymentTermsById(id);
        });
    }
    savePaymentTerms(paymentTerms) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.savePaymentTerms(paymentTerms);
        });
    }
    savePaymentGateway(paymentGateway) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.savePaymentGateway(paymentGateway);
        });
    }
    updatePaymentTerms(id, paymentTerms) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.updatePaymentTerms(id, paymentTerms);
        });
    }
    updatePaymentGateway(id, paymentGateway) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.updatePaymentGateway(id, paymentGateway);
        });
    }
    deletePaymentTerms(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.deletePaymentTerms(id);
        });
    }
    deletePaymentGateway(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.deletePaymentGateway(id);
        });
    }
};
tslib_1.__decorate([
    common_1.Get('payment-terms'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentTerms", null);
tslib_1.__decorate([
    common_1.Get('payment-gateway'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentGateway", null);
tslib_1.__decorate([
    common_1.Get('payment-gateway/:id'),
    tslib_1.__param(0, Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentGatewayById", null);
tslib_1.__decorate([
    common_1.Get('payment-terms/:id'),
    tslib_1.__param(0, Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentTermsById", null);
tslib_1.__decorate([
    common_1.Post('payment-terms'),
    tslib_1.__param(0, Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "savePaymentTerms", null);
tslib_1.__decorate([
    common_1.Post('payment-gateway'),
    tslib_1.__param(0, Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "savePaymentGateway", null);
tslib_1.__decorate([
    common_1.Patch('payment-terms/:id'),
    tslib_1.__param(0, Param('id')), tslib_1.__param(1, Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "updatePaymentTerms", null);
tslib_1.__decorate([
    common_1.Patch('payment-gateway/:id'),
    tslib_1.__param(0, Param('id')), tslib_1.__param(1, Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "updatePaymentGateway", null);
tslib_1.__decorate([
    common_1.Delete('payment-terms/:id'),
    tslib_1.__param(0, Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "deletePaymentTerms", null);
tslib_1.__decorate([
    common_1.Delete('payment-gateway/:id'),
    tslib_1.__param(0, Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentController.prototype, "deletePaymentGateway", null);
PaymentController = tslib_1.__decorate([
    common_1.Controller('payments/'),
    tslib_1.__metadata("design:paramtypes", [payments_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payments.controller.js.map