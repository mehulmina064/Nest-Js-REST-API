"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const parentSku_entity_1 = require("./parentSku.entity");
const parentSku_service_1 = require("./parentSku.service");
const parentSku_controller_1 = require("./parentSku.controller");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const middleware_1 = require("../authentication/middleware");
const process_entity_1 = require("../process/process.entity");
const process_service_1 = require("../process/process.service");
const pSkuProcess_service_1 = require("../process/pSkuProcess.service");
let parentSkuModule = class parentSkuModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(parentSku_controller_1.parentSkuController);
    }
};
parentSkuModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, parentSku_entity_1.parentSku, process_entity_1.process, process_entity_1.PSkuProcess]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [parentSku_controller_1.parentSkuController],
        providers: [parentSku_service_1.parentSkuService, process_service_1.processService, pSkuProcess_service_1.PSkuProcessService],
        exports: [parentSku_service_1.parentSkuService, pSkuProcess_service_1.PSkuProcessService, process_service_1.processService]
    })
], parentSkuModule);
exports.parentSkuModule = parentSkuModule;
//# sourceMappingURL=parentSku.module.js.map