"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organization_entity_1 = require("./organization.entity");
const organization_service_1 = require("./organization.service");
const organization_controller_1 = require("./organization.controller");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const user_entity_1 = require("./../users/user.entity");
const company_service_1 = require("./../company/company.service");
const company_entity_1 = require("./../company/company.entity");
const company_module_1 = require("./../company/company.module");
const entities_module_1 = require("./../entities/entities.module");
const entities_service_1 = require("./../entities/entities.service");
let OrganizationModule = class OrganizationModule {
};
OrganizationModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization, company_entity_1.Company]), typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]), mail_module_1.MailModule, authentication_module_1.AuthenticationModule, company_module_1.companyModule, entities_module_1.entitiesModule],
        controllers: [organization_controller_1.OrganizationController],
        providers: [organization_service_1.OrganizationService, company_service_1.companyService, entities_service_1.entitiesService],
        exports: [organization_service_1.OrganizationService, typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization]), company_service_1.companyService, entities_service_1.entitiesService],
    })
], OrganizationModule);
exports.OrganizationModule = OrganizationModule;
//# sourceMappingURL=organization.module.js.map