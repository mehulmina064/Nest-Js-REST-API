"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../sms/token.entity");
const zohoEmployee_module_1 = require("../zohoEmployee/zohoEmployee.module");
const team_entity_1 = require("./team.entity");
const EmployeeAndTeam_entity_1 = require("./EmployeeAndTeam.entity");
const team_service_1 = require("./team.service");
const team_controller_1 = require("./team.controller");
const userTeam_controller_1 = require("./userTeam.controller");
const userTeam_service_1 = require("./userTeam.service");
const middleware_1 = require("../authentication/middleware");
let InternalTeamModule = class InternalTeamModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.roleMiddleware)
            .exclude()
            .forRoutes(team_controller_1.prodoRolesController, userTeam_controller_1.userTeamController);
    }
};
InternalTeamModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken, team_entity_1.internalTeam, EmployeeAndTeam_entity_1.UserAndTeam]), zohoEmployee_module_1.zohoEmployeeModule
        ],
        controllers: [team_controller_1.prodoRolesController, userTeam_controller_1.userTeamController],
        providers: [team_service_1.internalTeamService, userTeam_service_1.userTeamService],
        exports: [team_service_1.internalTeamService, userTeam_service_1.userTeamService]
    })
], InternalTeamModule);
exports.InternalTeamModule = InternalTeamModule;
//# sourceMappingURL=team.module.js.map