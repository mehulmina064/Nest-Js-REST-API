"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../common/base-app.entity");
let dashboardData = class dashboardData extends base_app_entity_1.BaseAppEntity {
    constructor() {
        super(...arguments);
        this.data = {
            orders: {
                total: 0,
                completed: 0,
                inProgress: 0,
                submitted: 0,
                cancelled: 0
            },
            rfq: {
                approved: 0,
                rejected: 0,
                inProgress: 0,
                total_submitted: 0,
            },
            payments: {
                total: 0,
                paid: 0,
                due: 0,
            },
            pieChart: [],
            barChart: []
        };
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], dashboardData.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], dashboardData.prototype, "userId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], dashboardData.prototype, "data", void 0);
dashboardData = tslib_1.__decorate([
    typeorm_1.Entity('dashboardData')
], dashboardData);
exports.dashboardData = dashboardData;
//# sourceMappingURL=dashboardData.entity.js.map