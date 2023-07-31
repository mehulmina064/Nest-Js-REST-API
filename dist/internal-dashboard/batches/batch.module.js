"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const batch_entity_1 = require("./batch.entity");
const batch_service_1 = require("./batch.service");
const batch_controller_1 = require("./batch.controller");
const batchItemConnection_controller_1 = require("./batchItemConnection.controller");
const batchItemConnection_service_1 = require("./batchItemConnection.service");
const batchItem_entity_1 = require("../batchItems/batchItem.entity");
const batchItem_service_1 = require("../batchItems/batchItem.service");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const zohoSalesOrder_entity_1 = require("./../../zohoSalesOrder/zohoSalesOrder.entity");
const salesOrder_service_1 = require("../zohoData/services/salesOrder.service");
const middleware_1 = require("../authentication/middleware");
let batchModule = class batchModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(batch_controller_1.batchController, batchItemConnection_controller_1.batchItemConnectionController);
    }
};
batchModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, batch_entity_1.batch, batchItem_entity_1.BatchItem, batch_entity_1.BatchItemConnection, zohoSalesOrder_entity_1.zohoSalesOrder]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [batch_controller_1.batchController, batchItemConnection_controller_1.batchItemConnectionController],
        providers: [batch_service_1.batchService, batchItem_service_1.batchItemService, batchItemConnection_service_1.batchItemConnectionService, salesOrder_service_1.internalSalesOrderService],
        exports: [batch_service_1.batchService, batchItem_service_1.batchItemService, batchItemConnection_service_1.batchItemConnectionService, salesOrder_service_1.internalSalesOrderService]
    })
], batchModule);
exports.batchModule = batchModule;
//# sourceMappingURL=batch.module.js.map