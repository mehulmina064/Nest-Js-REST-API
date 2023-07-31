"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const company_entity_1 = require("./company.entity");
const company_controller_1 = require("./company.controller");
const company_service_1 = require("./company.service");
const entities_module_1 = require("./../entities/entities.module");
const entities_service_1 = require("./../entities/entities.service");
const user_entity_1 = require("../users/user.entity");
const organization_entity_1 = require("../organization/organization.entity");
let companyModule = class companyModule {
};
companyModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([company_entity_1.Company, user_entity_1.User, organization_entity_1.Organization]), entities_module_1.entitiesModule],
        controllers: [company_controller_1.companyController],
        providers: [company_service_1.companyService, entities_service_1.entitiesService],
        exports: [company_service_1.companyService, typeorm_1.TypeOrmModule.forFeature([company_entity_1.Company, user_entity_1.User]), entities_service_1.entitiesService],
    })
], companyModule);
exports.companyModule = companyModule;
//# sourceMappingURL=company.module.js.map