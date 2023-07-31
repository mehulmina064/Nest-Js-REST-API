"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shipmentBox_entity_1 = require("./shipmentBox.entity");
const shipmentBox_service_1 = require("./shipmentBox.service");
const shipmentBox_controller_1 = require("./shipmentBox.controller");
let ShipmentBoxModule = class ShipmentBoxModule {
};
ShipmentBoxModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([shipmentBox_entity_1.ShipmentBox])],
        providers: [shipmentBox_service_1.ShipmentBoxService],
        controllers: [shipmentBox_controller_1.ShipmentBoxController],
        exports: [shipmentBox_service_1.ShipmentBoxService]
    })
], ShipmentBoxModule);
exports.ShipmentBoxModule = ShipmentBoxModule;
//# sourceMappingURL=shipmentBox.module.js.map