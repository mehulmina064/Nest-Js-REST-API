"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const batchItem_entity_1 = require("./batchItem.entity");
const batchItem_service_1 = require("./batchItem.service");
const batch_entity_1 = require("../batches/batch.entity");
const batch_service_1 = require("../batches/batch.service");
const batchItem_controller_1 = require("./batchItem.controller");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const process_entity_1 = require("../process/process.entity");
const process_service_1 = require("../process/process.service");
const batchItemProcess_controller_1 = require("./batchItemProcess.controller");
const batchItemProcess_service_1 = require("./batchItemProcess.service");
const middleware_1 = require("../authentication/middleware");
const purchaseOrder_service_1 = require("../zohoData/services/purchaseOrder.service");
const zohoPurchaseOrder_entity_1 = require("./../../zohoPurchaseOrder/zohoPurchaseOrder.entity");
const ProductPSku_entity_1 = require("../zohoData/entity/ProductPSku.entity");
const productPSku_service_1 = require("../zohoData/services/productPSku.service");
let batchItemModule = class batchItemModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(batchItem_controller_1.batchItemController, batchItemProcess_controller_1.batchItemProcessController);
    }
};
batchItemModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, batchItem_entity_1.BatchItem, batchItem_entity_1.BatchItemProcess, process_entity_1.process, batch_entity_1.batch, zohoPurchaseOrder_entity_1.zohoPurchaseOrder, ProductPSku_entity_1.ProductPSku]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [batchItem_controller_1.batchItemController, batchItemProcess_controller_1.batchItemProcessController],
        providers: [batchItem_service_1.batchItemService, process_service_1.processService, batchItemProcess_service_1.batchItemProcessService, batch_service_1.batchService, purchaseOrder_service_1.internalPurchaseOrderService, productPSku_service_1.ProductPSkuService],
        exports: [batchItem_service_1.batchItemService, process_service_1.processService, batchItemProcess_service_1.batchItemProcessService, batch_service_1.batchService, purchaseOrder_service_1.internalPurchaseOrderService, productPSku_service_1.ProductPSkuService]
    })
], batchItemModule);
exports.batchItemModule = batchItemModule;
//# sourceMappingURL=batchItem.module.js.map