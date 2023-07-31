"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const fulfillmentTracker_entity_1 = require("./fulfillmentTracker.entity");
const fulfillmentTracker_service_1 = require("./fulfillmentTracker.service");
const fulfillment_cntroller_1 = require("./fulfillment.cntroller");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const batch_entity_1 = require("../batches/batch.entity");
const batch_service_1 = require("../batches/batch.service");
const zohoSalesOrder_entity_1 = require("./../../zohoSalesOrder/zohoSalesOrder.entity");
const salesOrder_service_1 = require("../zohoData/services/salesOrder.service");
const middleware_1 = require("../authentication/middleware");
let fulfillmentTrackerModule = class fulfillmentTrackerModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(fulfillment_cntroller_1.fulfillmentTrackerController);
    }
};
fulfillmentTrackerModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, fulfillmentTracker_entity_1.FulfillmentTracker, batch_entity_1.batch, zohoSalesOrder_entity_1.zohoSalesOrder]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [fulfillment_cntroller_1.fulfillmentTrackerController],
        providers: [fulfillmentTracker_service_1.fulfillmentTrackerService, batch_service_1.batchService, salesOrder_service_1.internalSalesOrderService],
        exports: [fulfillmentTracker_service_1.fulfillmentTrackerService, batch_service_1.batchService, salesOrder_service_1.internalSalesOrderService]
    })
], fulfillmentTrackerModule);
exports.fulfillmentTrackerModule = fulfillmentTrackerModule;
//# sourceMappingURL=fulfillment.module.js.map