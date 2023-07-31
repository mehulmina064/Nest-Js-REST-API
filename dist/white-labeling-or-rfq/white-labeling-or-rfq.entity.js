"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var Status;
(function (Status) {
    Status["Pending"] = "Pending";
    Status["Approved"] = "Approved";
    Status["Rejected"] = "Rejected";
})(Status || (Status = {}));
let WhiteLabelingOrRfq = class WhiteLabelingOrRfq {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], WhiteLabelingOrRfq.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "userId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "workEmail", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "organisation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "gstin", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "city", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "pinCode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], WhiteLabelingOrRfq.prototype, "products", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "file", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], WhiteLabelingOrRfq.prototype, "additionalDetails", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], WhiteLabelingOrRfq.prototype, "rfqStatus", void 0);
WhiteLabelingOrRfq = tslib_1.__decorate([
    typeorm_1.Entity('white-labeling-or-rfq')
], WhiteLabelingOrRfq);
exports.WhiteLabelingOrRfq = WhiteLabelingOrRfq;
class RoleStatus {
}
exports.RoleStatus = RoleStatus;
//# sourceMappingURL=white-labeling-or-rfq.entity.js.map