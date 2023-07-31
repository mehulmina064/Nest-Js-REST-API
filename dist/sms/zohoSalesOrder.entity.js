"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../common/base-app.entity");
let zohoSalesOrder = class zohoSalesOrder extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.orderDetails = {};
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], zohoSalesOrder.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoSalesOrder.prototype, "zohoId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], zohoSalesOrder.prototype, "orderDetails", void 0);
zohoSalesOrder = tslib_1.__decorate([
    typeorm_1.Entity('zohoSalesOrder')
], zohoSalesOrder);
exports.zohoSalesOrder = zohoSalesOrder;
//# sourceMappingURL=zohoSalesOrder.entity.js.map