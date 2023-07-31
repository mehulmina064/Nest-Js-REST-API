"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const prodoRoles_entity_1 = require("./prodoRoles.entity");
const EmployeeAndRoles_entity_1 = require("./EmployeeAndRoles.entity");
const prodoRoles_service_1 = require("./prodoRoles.service");
const prodoRoles_controller_1 = require("./prodoRoles.controller");
const userRoles_controller_1 = require("./userRoles.controller");
const userRoles_service_1 = require("./userRoles.service");
const prodoRolesAndPermissionGroups_entity_1 = require("../prodoPermissionAndGroup/prodoRolesAndPermissionGroups.entity");
const prodoPermissionGroup_entity_1 = require("../prodoPermissionAndGroup/prodoPermissionGroup.entity");
const prodoPermission_service_1 = require("../prodoPermissionAndGroup/prodoPermission.service");
const rolesPermission_service_1 = require("../prodoPermissionAndGroup/rolesPermission.service");
const middleware_1 = require("../authentication/middleware");
let prodoRolesModule = class prodoRolesModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(prodoRoles_controller_1.prodoRolesController, userRoles_controller_1.userRolesController);
    }
};
prodoRolesModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, prodoRoles_entity_1.prodoRoles, EmployeeAndRoles_entity_1.UserAndRoles, prodoRolesAndPermissionGroups_entity_1.RolesAndPermission, prodoPermissionGroup_entity_1.prodoPermissionGroup]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [prodoRoles_controller_1.prodoRolesController, userRoles_controller_1.userRolesController],
        providers: [prodoRoles_service_1.prodoRolesService, userRoles_service_1.userRolesService, rolesPermission_service_1.rolesPermissionGroupService, prodoPermission_service_1.prodoPermissionService],
        exports: [prodoRoles_service_1.prodoRolesService, userRoles_service_1.userRolesService, rolesPermission_service_1.rolesPermissionGroupService, prodoPermission_service_1.prodoPermissionService]
    })
], prodoRolesModule);
exports.prodoRolesModule = prodoRolesModule;
//# sourceMappingURL=prodoRoles.module.js.map