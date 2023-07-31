"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const test_entity_1 = require("./test.entity");
const test_service_1 = require("../processTest/test.service");
const test_controller_1 = require("../processTest/test.controller");
const testProcess_controller_1 = require("../processTest/testProcess.controller");
const testProcess_service_1 = require("../processTest/testProcess.service");
const process_service_1 = require("../process/process.service");
const process_entity_1 = require("../process/process.entity");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const middleware_1 = require("../authentication/middleware");
let testModule = class testModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(test_controller_1.TestController, testProcess_controller_1.testProcessController);
    }
};
testModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, test_entity_1.Test, test_entity_1.TestProcess, process_entity_1.process]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [test_controller_1.TestController, testProcess_controller_1.testProcessController],
        providers: [test_service_1.TestService, testProcess_service_1.testProcessService, process_service_1.processService],
        exports: [test_service_1.TestService, testProcess_service_1.testProcessService, process_service_1.processService]
    })
], testModule);
exports.testModule = testModule;
//# sourceMappingURL=test.module.js.map