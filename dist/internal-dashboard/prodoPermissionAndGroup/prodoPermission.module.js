"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prodoPermissionGroup_entity_1 = require("./prodoPermissionGroup.entity");
const prodoPermission_service_1 = require("./prodoPermission.service");
const typeorm_1 = require("@nestjs/typeorm");
const mail_module_1 = require("../../mail/mail.module");
const mailTrigger_module_1 = require("../../mailTrigger/mailTrigger.module");
const prodoPermission_controller_1 = require("./prodoPermission.controller");
const token_entity_1 = require("../../sms/token.entity");
const zohoEmployee_module_1 = require("./../zohoEmployee/zohoEmployee.module");
const prodoRolesAndPermissionGroups_entity_1 = require("./prodoRolesAndPermissionGroups.entity");
const rolesPermission_service_1 = require("./rolesPermission.service");
const rolePermission_controller_1 = require("./rolePermission.controller");
const prodoRoles_service_1 = require("../prodoRoles/prodoRoles.service");
const prodoRoles_entity_1 = require("../prodoRoles/prodoRoles.entity");
const middleware_1 = require("../authentication/middleware");
let prodoPermissionAndGroupModule = class prodoPermissionAndGroupModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(prodoPermission_controller_1.prodoPermissionController, rolePermission_controller_1.userRolesController);
    }
};
prodoPermissionAndGroupModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [prodoPermission_controller_1.prodoPermissionController, rolePermission_controller_1.userRolesController],
        providers: [prodoPermission_service_1.prodoPermissionService, rolesPermission_service_1.rolesPermissionGroupService, prodoRoles_service_1.prodoRolesService],
        imports: [typeorm_1.TypeOrmModule.forFeature([prodoPermissionGroup_entity_1.prodoPermissionGroup, token_entity_1.zohoToken, prodoRolesAndPermissionGroups_entity_1.RolesAndPermission, prodoRoles_entity_1.prodoRoles]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule, zohoEmployee_module_1.zohoEmployeeModule],
        exports: [prodoPermission_service_1.prodoPermissionService, rolesPermission_service_1.rolesPermissionGroupService, prodoRoles_service_1.prodoRolesService, typeorm_1.TypeOrmModule.forFeature([prodoPermissionGroup_entity_1.prodoPermissionGroup])],
    })
], prodoPermissionAndGroupModule);
exports.prodoPermissionAndGroupModule = prodoPermissionAndGroupModule;
//# sourceMappingURL=prodoPermission.module.js.map