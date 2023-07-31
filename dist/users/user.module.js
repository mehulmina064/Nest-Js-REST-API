"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./user.entity");
const user_controller_1 = require("./user.controller");
const otp_entity_1 = require("./otp.entity");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const account_entity_1 = require("../account/account.entity");
const organization_entity_1 = require("../organization/organization.entity");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
const dashboardData_entity_1 = require("./dashboardData.entity");
const product_module_1 = require("./../product/product.module");
const category_module_1 = require("./../categories/category.module");
const salesOrderReview_entity_1 = require("./salesOrderReview.entity");
const organization_service_1 = require("./../organization/organization.service");
const company_module_1 = require("./../company/company.module");
const entities_module_1 = require("./../entities/entities.module");
const entities_service_1 = require("./../entities/entities.service");
const company_service_1 = require("./../company/company.service");
const tempuser_module_1 = require("../tempuser/tempuser.module");
const zohoEmployee_module_1 = require("../internal-dashboard/zohoEmployee/zohoEmployee.module");
let UserModule = class UserModule {
};
UserModule = tslib_1.__decorate([
    common_1.Module({
        imports: [common_1.forwardRef(() => authentication_module_1.AuthenticationModule), typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, otp_entity_1.Otp, dashboardData_entity_1.dashboardData, salesOrderReview_entity_1.salesOrderReview]), mail_module_1.MailModule, typeorm_1.TypeOrmModule.forFeature([account_entity_1.Account, organization_entity_1.Organization]), mailTrigger_module_1.MailTriggerModule, product_module_1.ProductModule, category_module_1.CategoryModule, company_module_1.companyModule, entities_module_1.entitiesModule, tempuser_module_1.TempuserModule, zohoEmployee_module_1.zohoEmployeeModule],
        providers: [user_service_1.UserService, organization_service_1.OrganizationService, entities_service_1.entitiesService, company_service_1.companyService],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService, entities_service_1.entitiesService, company_service_1.companyService, zohoEmployee_module_1.zohoEmployeeModule],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map