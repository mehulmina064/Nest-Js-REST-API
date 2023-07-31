"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_entity_1 = require("./employee.entity");
const employee_service_1 = require("./employee.service");
const employee_controller_1 = require("./employee.controller");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const passport_1 = require("@nestjs/passport");
const organization_entity_1 = require("../organization/organization.entity");
let EmployeeModule = class EmployeeModule {
};
EmployeeModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee]),
            mail_module_1.MailModule,
            authentication_module_1.AuthenticationModule,
            passport_1.PassportModule,
            typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization]),
        ],
        controllers: [employee_controller_1.EmployeeController],
        providers: [employee_service_1.EmployeeService],
        exports: [employee_service_1.EmployeeService, typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee])],
    })
], EmployeeModule);
exports.EmployeeModule = EmployeeModule;
//# sourceMappingURL=employee.module.js.map