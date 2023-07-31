"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const zohoSalesOrderByUser_entity_1 = require("../../sms/zohoSalesOrderByUser.entity");
const user_module_1 = require("../../users/user.module");
const prodoRoles_entity_1 = require("../prodoRoles/prodoRoles.entity");
const EmployeeAndRoles_entity_1 = require("../prodoRoles/EmployeeAndRoles.entity");
const internalInvoicePod_entity_1 = require("../internalInvoicePod/internalInvoicePod.entity");
const internalInvoicePod_service_1 = require("../internalInvoicePod/internalInvoicePod.service");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const data_controller_1 = require("./data.controller");
const data_service_1 = require("./data.service");
const prodoRoles_service_1 = require("../prodoRoles/prodoRoles.service");
const userRoles_service_1 = require("../prodoRoles/userRoles.service");
const product_entity_1 = require("./../../product/product.entity");
const productRating_entity_1 = require("./../../product/productRating.entity");
const userReview_entity_1 = require("./../../product/userReview.entity");
const category_entity_1 = require("./../../categories/category.entity");
const category_service_1 = require("./../../categories/category.service");
const product_service_1 = require("./services/product.service");
const parentSku_entity_1 = require("../parentSku/parentSku.entity");
const parentSku_service_1 = require("../parentSku/parentSku.service");
const ProductPSku_entity_1 = require("./entity/ProductPSku.entity");
const productPSku_service_1 = require("./services/productPSku.service");
const productPSku_controller_1 = require("./productPSku.controller");
const zohoBill_entity_1 = require("./../../zohoBill/zohoBill.entity");
const zohoInvoice_entity_1 = require("./../../zohoInvoice/zohoInvoice.entity");
const zohoPurchaseOrder_entity_1 = require("./../../zohoPurchaseOrder/zohoPurchaseOrder.entity");
const zohoSalesOrder_entity_1 = require("./../../zohoSalesOrder/zohoSalesOrder.entity");
const salesOrder_service_1 = require("./services/salesOrder.service");
const bill_service_1 = require("./services/bill.service");
const invoice_service_1 = require("./services/invoice.service");
const purchaseOrder_service_1 = require("./services/purchaseOrder.service");
const fulfillmentTracker_entity_1 = require("../fulfillmentTracker/fulfillmentTracker.entity");
const fulfillmentTracker_service_1 = require("../fulfillmentTracker/fulfillmentTracker.service");
const middleware_1 = require("../authentication/middleware");
const batchItem_entity_1 = require("../batchItems/batchItem.entity");
const batchItem_service_1 = require("../batchItems/batchItem.service");
let zohoDataModule = class zohoDataModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(data_controller_1.zohoDataController, productPSku_controller_1.ProductPSkuController);
    }
};
zohoDataModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, zohoSalesOrder_entity_1.zohoSalesOrder, zohoSalesOrderByUser_entity_1.zohoSalesOrderByUser, zohoBill_entity_1.zohoBill, internalInvoicePod_entity_1.invoicePod, prodoRoles_entity_1.prodoRoles, EmployeeAndRoles_entity_1.UserAndRoles, product_entity_1.Product,
                productRating_entity_1.ProductRating, userReview_entity_1.UserReview, category_entity_1.Category, zohoInvoice_entity_1.zohoInvoice, zohoPurchaseOrder_entity_1.zohoPurchaseOrder, parentSku_entity_1.parentSku, ProductPSku_entity_1.ProductPSku, fulfillmentTracker_entity_1.FulfillmentTracker, batchItem_entity_1.BatchItem]), user_module_1.UserModule, zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [data_controller_1.zohoDataController, productPSku_controller_1.ProductPSkuController],
        providers: [internalInvoicePod_service_1.invoicePodService, data_service_1.zohoDataService, prodoRoles_service_1.prodoRolesService, userRoles_service_1.userRolesService, product_service_1.internalProductService,
            category_service_1.CategoryService, bill_service_1.internalBillService, invoice_service_1.internalInvoiceService, purchaseOrder_service_1.internalPurchaseOrderService, salesOrder_service_1.internalSalesOrderService, parentSku_service_1.parentSkuService, productPSku_service_1.ProductPSkuService, fulfillmentTracker_service_1.fulfillmentTrackerService, batchItem_service_1.batchItemService],
        exports: [internalInvoicePod_service_1.invoicePodService, data_service_1.zohoDataService, prodoRoles_service_1.prodoRolesService, userRoles_service_1.userRolesService, product_service_1.internalProductService,
            category_service_1.CategoryService, bill_service_1.internalBillService, invoice_service_1.internalInvoiceService, purchaseOrder_service_1.internalPurchaseOrderService, salesOrder_service_1.internalSalesOrderService, parentSku_service_1.parentSkuService, productPSku_service_1.ProductPSkuService, fulfillmentTracker_service_1.fulfillmentTrackerService, batchItem_service_1.batchItemService]
    })
], zohoDataModule);
exports.zohoDataModule = zohoDataModule;
//# sourceMappingURL=data.module.js.map