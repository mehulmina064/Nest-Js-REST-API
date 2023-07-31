"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../common/base-app.entity");
let zohoSalesOrderByUser = class zohoSalesOrderByUser extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.orderIds = [];
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], zohoSalesOrderByUser.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoSalesOrderByUser.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoSalesOrderByUser.prototype, "orderIds", void 0);
zohoSalesOrderByUser = tslib_1.__decorate([
    typeorm_1.Entity('zohoSalesOrderByUser')
], zohoSalesOrderByUser);
exports.zohoSalesOrderByUser = zohoSalesOrderByUser;
//# sourceMappingURL=zohoSalesOrderByUser.entity.js.map