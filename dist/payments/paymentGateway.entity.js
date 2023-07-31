"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const org_model_entity_1 = require("../common/org-model.entity");
class PaymentGatewayAccount {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountCurrency", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountBalance", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountStatus", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountCreatedAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountUpdatedAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountCreatedBy", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayAccount.prototype, "paymentGatewayAccountUpdatedBy", void 0);
exports.PaymentGatewayAccount = PaymentGatewayAccount;
let PaymentGateway = class PaymentGateway extends org_model_entity_1.OrganizationModel {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], PaymentGateway.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayDescription", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayCode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayStatus", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayUrl", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayUsername", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayPassword", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayToken", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewaySecret", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayPublicKey", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayPrivateKey", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayLogo", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFee", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeCurrency", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeePercentage", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeFixed", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeMin", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeMax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeMinAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], PaymentGateway.prototype, "paymentGatewayFeeMaxAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", PaymentGatewayAccount)
], PaymentGateway.prototype, "paymentGatewayAccount", void 0);
PaymentGateway = tslib_1.__decorate([
    typeorm_1.Entity("paymentGateway")
], PaymentGateway);
exports.PaymentGateway = PaymentGateway;
//# sourceMappingURL=paymentGateway.entity.js.map