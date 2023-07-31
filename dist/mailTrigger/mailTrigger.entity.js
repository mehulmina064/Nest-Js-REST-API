"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../common/base-app.entity");
let MailTrigger = class MailTrigger extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], MailTrigger.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MailTrigger.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], MailTrigger.prototype, "teams", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MailTrigger.prototype, "description", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MailTrigger.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MailTrigger.prototype, "templateName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], MailTrigger.prototype, "from", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], MailTrigger.prototype, "subject", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], MailTrigger.prototype, "templatevars", void 0);
MailTrigger = tslib_1.__decorate([
    typeorm_1.Entity('MailTrigger')
], MailTrigger);
exports.MailTrigger = MailTrigger;
//# sourceMappingURL=mailTrigger.entity.js.map