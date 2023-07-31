"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const process_entity_1 = require("./process.entity");
const process_service_1 = require("./process.service");
const process_controller_1 = require("./process.controller");
const pSkuProcess_service_1 = require("./pSkuProcess.service");
const pSkuProcess_controller_1 = require("./pSkuProcess.controller");
const parentSku_service_1 = require("../parentSku/parentSku.service");
const parentSku_entity_1 = require("../parentSku/parentSku.entity");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const middleware_1 = require("../authentication/middleware");
const test_entity_1 = require("../processTest/test.entity");
const test_service_1 = require("../processTest/test.service");
const testProcess_service_1 = require("../processTest/testProcess.service");
let processModule = class processModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(process_controller_1.processController, pSkuProcess_controller_1.PSkuProcessController);
    }
};
processModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, process_entity_1.process, parentSku_entity_1.parentSku, process_entity_1.PSkuProcess, test_entity_1.TestProcess, test_entity_1.Test]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [process_controller_1.processController, pSkuProcess_controller_1.PSkuProcessController],
        providers: [process_service_1.processService, parentSku_service_1.parentSkuService, pSkuProcess_service_1.PSkuProcessService, testProcess_service_1.testProcessService, test_service_1.TestService],
        exports: [process_service_1.processService, parentSku_service_1.parentSkuService, pSkuProcess_service_1.PSkuProcessService, testProcess_service_1.testProcessService, test_service_1.TestService]
    })
], processModule);
exports.processModule = processModule;
//# sourceMappingURL=process.module.js.map