"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
class BaseAppEntity {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], BaseAppEntity.prototype, "additionalData", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.CreateDateColumn(),
    tslib_1.__metadata("design:type", Date)
], BaseAppEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.UpdateDateColumn(),
    tslib_1.__metadata("design:type", Date)
], BaseAppEntity.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], BaseAppEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], BaseAppEntity.prototype, "attachments", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], BaseAppEntity.prototype, "createdBy", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], BaseAppEntity.prototype, "updatedBy", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], BaseAppEntity.prototype, "deletedBy", void 0);
exports.BaseAppEntity = BaseAppEntity;
//# sourceMappingURL=base-app.entity.js.map