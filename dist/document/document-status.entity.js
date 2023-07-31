"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_app_entity_1 = require("./../common/base-app.entity");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const document_entity_1 = require("./document.entity");
let DocumentStatus = class DocumentStatus extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.is_active = false;
        this.is_default = false;
        this.is_system = false;
    }
};
tslib_1.__decorate([
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], DocumentStatus.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DocumentStatus.prototype, "status", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DocumentStatus.prototype, "description", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DocumentStatus.prototype, "code", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DocumentStatus.prototype, "type", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], DocumentStatus.prototype, "index", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], DocumentStatus.prototype, "is_active", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], DocumentStatus.prototype, "is_default", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], DocumentStatus.prototype, "is_system", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DocumentStatus.prototype, "location", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], DocumentStatus.prototype, "timestamp", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], DocumentStatus.prototype, "actionAvailable", void 0);
DocumentStatus = tslib_1.__decorate([
    typeorm_1.Entity('documentStatus')
], DocumentStatus);
exports.DocumentStatus = DocumentStatus;
let StatusTemplate = class StatusTemplate extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.statuses = [];
        this.type = "RFQ";
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], StatusTemplate.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], StatusTemplate.prototype, "statuses", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], StatusTemplate.prototype, "type", void 0);
StatusTemplate = tslib_1.__decorate([
    typeorm_1.Entity('statusTemplate')
], StatusTemplate);
exports.StatusTemplate = StatusTemplate;
//# sourceMappingURL=document-status.entity.js.map