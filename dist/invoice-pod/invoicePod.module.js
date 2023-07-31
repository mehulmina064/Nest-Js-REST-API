"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const sms_controller_1 = require("./../sms/sms.controller");
const sms_service_1 = require("./../sms/sms.service");
const sms_entity_1 = require("./../sms/sms.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./../users/user.entity");
const token_entity_1 = require("./../sms/token.entity");
const zohoSalesOrder_entity_1 = require("./../sms/zohoSalesOrder.entity");
const zohoSalesOrderByUser_entity_1 = require("./../sms/zohoSalesOrderByUser.entity");
const user_module_1 = require("./../users/user.module");
const product_module_1 = require("./../product/product.module");
const zohoSalesOrder_service_1 = require("./../sms/zohoSalesOrder.service");
const zohoSalesOrder_controller_1 = require("./../sms/zohoSalesOrder.controller");
const invoicePod_entity_1 = require("./invoicePod.entity");
const invoicePod_service_1 = require("./invoicePod.service");
const invoicePod_controller_1 = require("./invoicePod.controller");
let invoicePodModule = class invoicePodModule {
};
invoicePodModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sms_entity_1.SmsTemplate, user_entity_1.User, token_entity_1.zohoToken, zohoSalesOrder_entity_1.zohoSalesOrder, zohoSalesOrderByUser_entity_1.zohoSalesOrderByUser, invoicePod_entity_1.invoicePod]), user_module_1.UserModule, product_module_1.ProductModule
        ],
        controllers: [sms_controller_1.SmsController, zohoSalesOrder_controller_1.zohoSalesOrderController, invoicePod_controller_1.invoicePodController],
        providers: [sms_service_1.SmsService, zohoSalesOrder_service_1.zohoSalesOrderService, invoicePod_service_1.invoicePodService],
        exports: [sms_service_1.SmsService, zohoSalesOrder_service_1.zohoSalesOrderService, typeorm_1.TypeOrmModule.forFeature([sms_entity_1.SmsTemplate]), invoicePod_service_1.invoicePodService]
    })
], invoicePodModule);
exports.invoicePodModule = invoicePodModule;
//# sourceMappingURL=invoicePod.module.js.map