"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shipment_entity_1 = require("./shipment.entity");
let ShipmentModule = class ShipmentModule {
};
ShipmentModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([shipment_entity_1.Shipment])],
        providers: [],
        controllers: [],
        exports: []
    })
], ShipmentModule);
exports.ShipmentModule = ShipmentModule;
//# sourceMappingURL=shipment.module.js.map