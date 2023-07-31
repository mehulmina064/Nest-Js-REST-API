"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const manufacture_service_1 = require("./manufacture.service");
const manufacture_controller_1 = require("./manufacture.controller");
const typeorm_1 = require("@nestjs/typeorm");
const manufacture_entity_1 = require("./manufacture.entity");
const token_entity_1 = require("./../sms/token.entity");
let ManufactureModule = class ManufactureModule {
};
ManufactureModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [manufacture_controller_1.ManufactureController],
        providers: [manufacture_service_1.ManufactureService],
        imports: [typeorm_1.TypeOrmModule.forFeature([manufacture_entity_1.Manufacture, token_entity_1.zohoToken])],
        exports: [manufacture_service_1.ManufactureService, typeorm_1.TypeOrmModule.forFeature([manufacture_entity_1.Manufacture, token_entity_1.zohoToken])]
    })
], ManufactureModule);
exports.ManufactureModule = ManufactureModule;
//# sourceMappingURL=manufacture.module.js.map