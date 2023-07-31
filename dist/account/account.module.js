"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("./account.entity");
const account_service_1 = require("./account.service");
const account_controller_1 = require("./account.controller");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const organization_entity_1 = require("../organization/organization.entity");
const passport_1 = require("@nestjs/passport");
let AccountModule = class AccountModule {
};
AccountModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([account_entity_1.Account]),
            mail_module_1.MailModule,
            authentication_module_1.AuthenticationModule,
            passport_1.PassportModule,
            typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization]),
        ],
        controllers: [account_controller_1.AccountController],
        providers: [account_service_1.AccountService],
        exports: [account_service_1.AccountService, typeorm_1.TypeOrmModule.forFeature([account_entity_1.Account])],
    })
], AccountModule);
exports.AccountModule = AccountModule;
//# sourceMappingURL=account.module.js.map