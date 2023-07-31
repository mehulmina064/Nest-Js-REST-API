"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const salesorders_service_1 = require("./salesorders.service");
const salesorders_controller_1 = require("./salesorders.controller");
let SalesordersModule = class SalesordersModule {
};
SalesordersModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [salesorders_controller_1.SalesordersController],
        providers: [salesorders_service_1.SalesordersService]
    })
], SalesordersModule);
exports.SalesordersModule = SalesordersModule;
//# sourceMappingURL=salesorders.module.js.map