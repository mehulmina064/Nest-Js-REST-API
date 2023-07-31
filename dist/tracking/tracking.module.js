"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tracking_service_1 = require("./tracking.service");
const common_1 = require("@nestjs/common");
const tracking_controller_1 = require("./tracking.controller");
const tracking_entity_1 = require("./tracking.entity");
const typeorm_1 = require("@nestjs/typeorm");
let TrackingModule = class TrackingModule {
};
TrackingModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tracking_entity_1.Tracking])],
        controllers: [tracking_controller_1.TrackingController],
        providers: [
            tracking_service_1.TrackingService,
        ],
    })
], TrackingModule);
exports.TrackingModule = TrackingModule;
//# sourceMappingURL=tracking.module.js.map