"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const zohoEmployee_entity_1 = require("./zohoEmployee.entity");
const typeorm_1 = require("@nestjs/typeorm");
const otp_entity_1 = require("../../users/otp.entity");
const salesOrderReview_entity_1 = require("../../users/salesOrderReview.entity");
const authentication_module_1 = require("../../authentication/authentication.module");
const mail_module_1 = require("../../mail/mail.module");
const mailTrigger_module_1 = require("../../mailTrigger/mailTrigger.module");
const zohoEmployee_service_1 = require("./zohoEmployee.service");
const zohoEmployee_controller_1 = require("./zohoEmployee.controller");
const employeeOtp_entity_1 = require("./employeeOtp.entity");
const token_entity_1 = require("../../sms/token.entity");
const account_entity_1 = require("../../account/account.entity");
const userRoles_service_1 = require("../prodoRoles/userRoles.service");
const prodoRoles_service_1 = require("../prodoRoles/prodoRoles.service");
const prodoRoles_entity_1 = require("../prodoRoles/prodoRoles.entity");
const EmployeeAndRoles_entity_1 = require("../prodoRoles/EmployeeAndRoles.entity");
const team_service_1 = require("../team/team.service");
const userTeam_service_1 = require("../team/userTeam.service");
const team_entity_1 = require("../team/team.entity");
const EmployeeAndTeam_entity_1 = require("../team/EmployeeAndTeam.entity");
const common_2 = require("@nestjs/common");
const middleware_1 = require("../authentication/middleware");
const prodoRolesAndPermissionGroups_entity_1 = require("../prodoPermissionAndGroup/prodoRolesAndPermissionGroups.entity");
const prodoPermissionGroup_entity_1 = require("../prodoPermissionAndGroup/prodoPermissionGroup.entity");
const rolesPermission_service_1 = require("../prodoPermissionAndGroup/rolesPermission.service");
const prodoPermission_service_1 = require("../prodoPermissionAndGroup/prodoPermission.service");
let zohoEmployeeModule = class zohoEmployeeModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude({ path: 'internal/employee/profile', method: common_2.RequestMethod.PATCH }, { path: 'internal/employee/setProfilePicture', method: common_2.RequestMethod.POST }, { path: 'internal/employee/login', method: common_2.RequestMethod.POST }, { path: 'internal/employee/forgotPassword', method: common_2.RequestMethod.POST }, { path: 'internal/employee/resetPassword', method: common_2.RequestMethod.POST }, { path: 'internal/employee/signUp', method: common_2.RequestMethod.POST }, { path: 'internal/employee/profile', method: common_2.RequestMethod.PATCH }, { path: 'internal/employee/profile', method: common_2.RequestMethod.GET }, { path: 'internal/employee/profile/password', method: common_2.RequestMethod.PATCH })
            .forRoutes(zohoEmployee_controller_1.zohoEmployeeController);
    }
};
zohoEmployeeModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([zohoEmployee_entity_1.zohoEmployee, token_entity_1.zohoToken, employeeOtp_entity_1.employeeOtp, otp_entity_1.Otp, account_entity_1.Account, salesOrderReview_entity_1.salesOrderReview, prodoRoles_entity_1.prodoRoles, EmployeeAndRoles_entity_1.UserAndRoles, team_entity_1.internalTeam, EmployeeAndTeam_entity_1.UserAndTeam, prodoRolesAndPermissionGroups_entity_1.RolesAndPermission, prodoPermissionGroup_entity_1.prodoPermissionGroup]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule, authentication_module_1.AuthenticationModule],
        controllers: [zohoEmployee_controller_1.zohoEmployeeController],
        providers: [zohoEmployee_service_1.zohoEmployeeService, userRoles_service_1.userRolesService, userRoles_service_1.userRolesService, prodoRoles_service_1.prodoRolesService, team_service_1.internalTeamService, userTeam_service_1.userTeamService, rolesPermission_service_1.rolesPermissionGroupService, prodoPermission_service_1.prodoPermissionService],
        exports: [zohoEmployee_service_1.zohoEmployeeService, userRoles_service_1.userRolesService, prodoRoles_service_1.prodoRolesService, team_service_1.internalTeamService, userTeam_service_1.userTeamService, prodoPermission_service_1.prodoPermissionService, rolesPermission_service_1.rolesPermissionGroupService, typeorm_1.TypeOrmModule.forFeature([zohoEmployee_entity_1.zohoEmployee])],
    })
], zohoEmployeeModule);
exports.zohoEmployeeModule = zohoEmployeeModule;
//# sourceMappingURL=zohoEmployee.module.js.map