"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const zohoSalesOrder_entity_1 = require("./zohoSalesOrder.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const user_service_1 = require("../users/user.service");
const dashboardData_entity_1 = require("../users/dashboardData.entity");
const otp_entity_1 = require("../users/otp.entity");
const salesOrderReview_entity_1 = require("../users/salesOrderReview.entity");
const product_module_1 = require("./../product/product.module");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("./../mailTrigger/mailTrigger.module");
const organization_entity_1 = require("../organization/organization.entity");
const organization_service_1 = require("./../organization/organization.service");
const entity_entity_1 = require("./../entities/entity.entity");
const company_entity_1 = require("../company/company.entity");
const zohoSalesOrder_service_1 = require("./zohoSalesOrder.service");
const zohoSalesOrder_controller_1 = require("./zohoSalesOrder.controller");
const token_entity_1 = require("./../sms/token.entity");
const account_entity_1 = require("../account/account.entity");
const category_module_1 = require("./../categories/category.module");
const company_module_1 = require("./../company/company.module");
const entities_module_1 = require("./../entities/entities.module");
const tempuser_module_1 = require("../tempuser/tempuser.module");
const invoicePod_module_1 = require("./../invoice-pod/invoicePod.module");
let zohoSalesOrderModule = class zohoSalesOrderModule {
};
zohoSalesOrderModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [zohoSalesOrder_controller_1.zohoSalesOrderController],
        providers: [zohoSalesOrder_service_1.zohoSalesOrderService, user_service_1.UserService, organization_service_1.OrganizationService],
        imports: [typeorm_1.TypeOrmModule.forFeature([zohoSalesOrder_entity_1.zohoSalesOrder, organization_entity_1.Organization, company_entity_1.Company, token_entity_1.zohoToken, entity_entity_1.Entitie, user_entity_1.User, otp_entity_1.Otp, account_entity_1.Account, dashboardData_entity_1.dashboardData, salesOrderReview_entity_1.salesOrderReview]), mail_module_1.MailModule, mailTrigger_module_1.MailTriggerModule, product_module_1.ProductModule, category_module_1.CategoryModule, company_module_1.companyModule, entities_module_1.entitiesModule, tempuser_module_1.TempuserModule, invoicePod_module_1.invoicePodModule],
        exports: [zohoSalesOrder_service_1.zohoSalesOrderService, typeorm_1.TypeOrmModule.forFeature([zohoSalesOrder_entity_1.zohoSalesOrder])],
    })
], zohoSalesOrderModule);
exports.zohoSalesOrderModule = zohoSalesOrderModule;
//# sourceMappingURL=zohoSalesOrder.module.js.map