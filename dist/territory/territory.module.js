"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const territory_entity_1 = require("./territory.entity");
const territory_service_1 = require("./territory.service");
const territory_controller_1 = require("./territory.controller");
let TerritoryModule = class TerritoryModule {
};
TerritoryModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([territory_entity_1.Territory])],
        providers: [territory_service_1.TerritoryService],
        controllers: [territory_controller_1.TerritoryController],
        exports: [territory_service_1.TerritoryService]
    })
], TerritoryModule);
exports.TerritoryModule = TerritoryModule;
//# sourceMappingURL=territory.module.js.map