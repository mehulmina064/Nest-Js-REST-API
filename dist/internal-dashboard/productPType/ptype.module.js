"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const pType_entity_1 = require("./pType.entity");
const pType_service_1 = require("./pType.service");
const pType_controller_1 = require("./pType.controller");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const middleware_1 = require("../authentication/middleware");
let pTypeModule = class pTypeModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(pType_controller_1.pTypeController);
    }
};
pTypeModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, pType_entity_1.productPType]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [pType_controller_1.pTypeController],
        providers: [pType_service_1.pTypeService],
        exports: [pType_service_1.pTypeService]
    })
], pTypeModule);
exports.pTypeModule = pTypeModule;
//# sourceMappingURL=ptype.module.js.map