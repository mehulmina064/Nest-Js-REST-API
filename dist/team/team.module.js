"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const team_entity_1 = require("./team.entity");
const team_service_1 = require("./team.service");
const team_controller_1 = require("./team.controller");
const authentication_module_1 = require("../authentication/authentication.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
const user_module_1 = require("./../users/user.module");
let TeamModule = class TeamModule {
};
TeamModule = tslib_1.__decorate([
    common_1.Module({
        imports: [authentication_module_1.AuthenticationModule, typeorm_1.TypeOrmModule.forFeature([team_entity_1.Team]), mailTrigger_module_1.MailTriggerModule, user_module_1.UserModule],
        providers: [team_service_1.TeamService],
        controllers: [team_controller_1.TeamController],
        exports: [team_service_1.TeamService],
    })
], TeamModule);
exports.TeamModule = TeamModule;
//# sourceMappingURL=team.module.js.map