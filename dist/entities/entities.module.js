"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const entities_service_1 = require("./entities.service");
const entities_controller_1 = require("./entities.controller");
const entity_entity_1 = require("./entity.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const organization_entity_1 = require("../organization/organization.entity");
const company_entity_1 = require("../company/company.entity");
let entitiesModule = class entitiesModule {
};
entitiesModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [entities_controller_1.entitiesController],
        providers: [entities_service_1.entitiesService],
        imports: [typeorm_1.TypeOrmModule.forFeature([entity_entity_1.Entitie, user_entity_1.User, organization_entity_1.Organization, company_entity_1.Company])],
        exports: [entities_service_1.entitiesService, typeorm_1.TypeOrmModule.forFeature([entity_entity_1.Entitie])],
    })
], entitiesModule);
exports.entitiesModule = entitiesModule;
//# sourceMappingURL=entities.module.js.map