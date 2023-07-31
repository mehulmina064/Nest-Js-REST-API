"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const internalInvoicePod_entity_1 = require("./internalInvoicePod.entity");
const internalInvoicePod_service_1 = require("./internalInvoicePod.service");
const internalInvoicePod_controller_1 = require("./internalInvoicePod.controller");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const middleware_1 = require("../authentication/middleware");
let internalInvoicePodModule = class internalInvoicePodModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(internalInvoicePod_controller_1.invoicePodController);
    }
};
internalInvoicePodModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, internalInvoicePod_entity_1.invoicePod]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [internalInvoicePod_controller_1.invoicePodController],
        providers: [internalInvoicePod_service_1.invoicePodService],
        exports: [internalInvoicePod_service_1.invoicePodService]
    })
], internalInvoicePodModule);
exports.internalInvoicePodModule = internalInvoicePodModule;
//# sourceMappingURL=internalInvoicePod.module.js.map