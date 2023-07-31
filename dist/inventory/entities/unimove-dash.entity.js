"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let UnimoveDash = class UnimoveDash {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_2.ObjectID)
], UnimoveDash.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "hub", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_inventory_processed_today", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_inventory_processed_for_last_7_days", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_inventory_processed_for_current_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_inventory_processed_for_last_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_good_inventory_received_today", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_good_inventory_received_for_last_7_days", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_good_inventory_received_for_current_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_good_inventory_received_for_last_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_bad_inventory_received_today", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_bad_inventory_received_for_last_7_days", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_bad_inventory_received_for_current_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_bad_inventory_received_for_last_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_fresh_inventory_processed_today", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_fresh_inventory_processed_for_last_7_days", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_fresh_inventory_processed_for_current_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "total_fresh_inventory_processed_for_last_month", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "today_s_Churn_Ration", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "last_7_days_Churn_Ratio", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "Current_Month_churn_ratio", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_2.Column(),
    tslib_1.__metadata("design:type", String)
], UnimoveDash.prototype, "Last_Month_Churn_Ratio", void 0);
UnimoveDash = tslib_1.__decorate([
    typeorm_1.Entity('unimove_dash')
], UnimoveDash);
exports.UnimoveDash = UnimoveDash;
//# sourceMappingURL=unimove-dash.entity.js.map