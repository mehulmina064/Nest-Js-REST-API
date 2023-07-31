"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const zohoInvoice_entity_1 = require("./zohoInvoice.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const user_service_1 = require("../users/user.service");
const dashboardData_entity_1 = require("../users/dashboardData.entity");
const otp_entity_1 = require("../users/otp.entity");
const salesOrderReview_entity_1 = require("../users/salesOrderReview.entity");
const product_module_1 = require("../product/product.module");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("../mailTrigger/mailTrigger.module");
const organization_entity_1 = require("../organization/organization.entity");
const organization_service_1 = require("../organization/organization.service");
const entity_entity_1 = require("../entities/entity.entity");
const company_entity_1 = require("../company/company.entity");
const zohoInvoice_service_1 = require("./zohoInvoice.service");
const zohoInvoice_controller_1 = require("./zohoInvoice.controller");
const token_entity_1 = require("../sms/token.entity");
const account_entity_1 = require("../account/account.entity");
const category_module_1 = require("../categories/category.module");
const company_module_1 = require("../company/company.module");
const entities_module_1 = require("../entities/entities.module");
const tempuser_module_1 = require("../tempuser/tempuser.module");
let zohoInvoiceModule = class zohoInvoiceModule {
};
zohoInvoiceModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [zohoInvoice_controller_1.zohoInvoiceController],
        providers: [zohoInvoice_service_1.zohoInvoiceService, user_service_1.UserService, organization_service_1.OrganizationService],
        imports: [typeorm_1.TypeOrmModule.forFeature([zohoInvoice_entity_1.zohoInvoice, organization_entity_1.Organization, company_entity_1.Company, token_entity_1.zohoToken, entity_entity_1.Entitie, user_entity_1.User, otp_entity_1.Otp, account_entity_1.Account, dashboardData_entity_1.dashboardData, salesOrderReview_entity_1.salesOrderReview]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule, product_module_1.ProductModule, category_module_1.CategoryModule, company_module_1.companyModule, entities_module_1.entitiesModule, tempuser_module_1.TempuserModule],
        exports: [zohoInvoice_service_1.zohoInvoiceService, typeorm_1.TypeOrmModule.forFeature([zohoInvoice_entity_1.zohoInvoice])],
    })
], zohoInvoiceModule);
exports.zohoInvoiceModule = zohoInvoiceModule;
//# sourceMappingURL=zohoInvoice.module.js.map