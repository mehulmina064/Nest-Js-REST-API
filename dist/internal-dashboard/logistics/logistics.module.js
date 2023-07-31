"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const logistics_entity_1 = require("./logistics.entity");
const logistics_service_1 = require("./logistics.service");
const logistics_controller_1 = require("./logistics.controller");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const middleware_1 = require("../authentication/middleware");
let logisticsModule = class logisticsModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(logistics_controller_1.logisticsController);
    }
};
logisticsModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, logistics_entity_1.logistics]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [logistics_controller_1.logisticsController],
        providers: [logistics_service_1.logisticsService],
        exports: [logistics_service_1.logisticsService]
    })
], logisticsModule);
exports.logisticsModule = logisticsModule;
//# sourceMappingURL=logistics.module.js.map