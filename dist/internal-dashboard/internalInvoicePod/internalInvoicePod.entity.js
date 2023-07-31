"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
var podType;
(function (podType) {
    podType["Signed"] = "Signed Invoice";
    podType["Digital"] = "Digital Signature with Receiver Photo";
})(podType = exports.podType || (exports.podType = {}));
let invoicePod = class invoicePod extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.otherAttachmentLinks = [];
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], invoicePod.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "zohoInvoiceId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "zohoSalesOrderId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "validity", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: podType,
        default: podType.Digital,
    }),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "podType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "signatureFile", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "podLocation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "pod1", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], invoicePod.prototype, "pod2", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], invoicePod.prototype, "otherAttachmentLinks", void 0);
invoicePod = tslib_1.__decorate([
    typeorm_1.Entity('invoicePod')
], invoicePod);
exports.invoicePod = invoicePod;
//# sourceMappingURL=internalInvoicePod.entity.js.map