"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const base_app_entity_1 = require("./base-app.entity");
class OrganizationModel extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.territory_id = [];
    }
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], OrganizationModel.prototype, "organization_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], OrganizationModel.prototype, "territory_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], OrganizationModel.prototype, "namingScheme", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], OrganizationModel.prototype, "serialNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], OrganizationModel.prototype, "barcode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], OrganizationModel.prototype, "barcodeType", void 0);
exports.OrganizationModel = OrganizationModel;
//# sourceMappingURL=org-model.entity.js.map