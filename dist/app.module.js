"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tracking_module_1 = require("./tracking/tracking.module");
const files_module_1 = require("./files/files.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const user_module_1 = require("./users/user.module");
const account_module_1 = require("./account/account.module");
const organization_module_1 = require("./organization/organization.module");
const product_module_1 = require("./product/product.module");
const address_module_1 = require("./addresses/address.module");
const category_module_1 = require("./categories/category.module");
const order_module_1 = require("./orders/order.module");
const setting_module_1 = require("./settings/setting.module");
const white_labeling_or_rfq_module_1 = require("./white-labeling-or-rfq/white-labeling-or-rfq.module");
const get_in_touch_module_1 = require("./get-in-touch/get-in-touch.module");
const prodo_partner_module_1 = require("./prodo-partner/prodo-partner.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const authentication_module_1 = require("./authentication/authentication.module");
const faq_module_1 = require("./faq/faq.module");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const mail_module_1 = require("./mail/mail.module");
const contact_form_module_1 = require("./contact-form/contact-form.module");
const client_data_module_1 = require("./clientData/client-data.module");
const document_module_1 = require("./document/document.module");
const attachment_module_1 = require("./attachments/attachment.module");
const employee_module_1 = require("./employee/employee.module");
const gst_module_1 = require("./gst/gst.module");
const supplychain_module_1 = require("./supplychain/supplychain.module");
const item_module_1 = require("./item/item.module");
const shipment_module_1 = require("./shipment/shipment.module");
const inventory_module_1 = require("./inventory/inventory.module");
const territory_module_1 = require("./territory/territory.module");
const sms_module_1 = require("./sms/sms.module");
const team_module_1 = require("./team/team.module");
const mailTrigger_module_1 = require("./mailTrigger/mailTrigger.module");
const s3_module_1 = require("./s3-upload/s3.module");
const tickets_module_1 = require("./tickets/tickets.module");
const salesorders_module_1 = require("./salesorders/salesorders.module");
const invoicePod_module_1 = require("./invoice-pod/invoicePod.module");
const rfqBid_module_1 = require("./rfqBid/rfqBid.module");
const company_module_1 = require("./company/company.module");
const entities_module_1 = require("./entities/entities.module");
const manufacture_module_1 = require("./manufacture/manufacture.module");
const zohoSalesOrder_module_1 = require("./zohoSalesOrder/zohoSalesOrder.module");
const zohoPurchaseOrder_module_1 = require("./zohoPurchaseOrder/zohoPurchaseOrder.module");
const zohoBill_module_1 = require("./zohoBill/zohoBill.module");
const zohoInvoice_module_1 = require("./zohoInvoice/zohoInvoice.module");
const tempuser_module_1 = require("./tempuser/tempuser.module");
const zohoEmployee_module_1 = require("./internal-dashboard/zohoEmployee/zohoEmployee.module");
const prodoRoles_module_1 = require("./internal-dashboard/prodoRoles/prodoRoles.module");
const prodoPermission_module_1 = require("./internal-dashboard/prodoPermissionAndGroup/prodoPermission.module");
const internalInvoicePod_module_1 = require("./internal-dashboard/internalInvoicePod/internalInvoicePod.module");
const team_module_2 = require("./internal-dashboard/team/team.module");
const data_module_1 = require("./internal-dashboard/zohoData/data.module");
const logistics_module_1 = require("./internal-dashboard/logistics/logistics.module");
const ptype_module_1 = require("./internal-dashboard/productPType/ptype.module");
const parentSku_module_1 = require("./internal-dashboard/parentSku/parentSku.module");
const process_module_1 = require("./internal-dashboard/process/process.module");
const test_module_1 = require("./internal-dashboard/processTest/test.module");
const batch_module_1 = require("./internal-dashboard/batches/batch.module");
const batchItem_module_1 = require("./internal-dashboard/batchItems/batchItem.module");
const fulfillment_module_1 = require("./internal-dashboard/fulfillmentTracker/fulfillment.module");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            platform_express_1.MulterModule.register({
                dest: './files',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mongodb',
                url: process.env.MONGO_DB_OLD,
                database: process.env.MONGO_DB_NAME_MAIN,
                entities: [path_1.join(__dirname, '**/**.entity{.ts,.js}')],
                synchronize: false,
                useNewUrlParser: true,
                ssl: true,
            }),
            mail_module_1.MailModule,
            files_module_1.FilesModule,
            tracking_module_1.TrackingModule,
            user_module_1.UserModule,
            account_module_1.AccountModule,
            organization_module_1.OrganizationModule,
            address_module_1.AddressModule,
            category_module_1.CategoryModule,
            order_module_1.OrderModule,
            product_module_1.ProductModule,
            setting_module_1.SettingModule,
            user_module_1.UserModule,
            white_labeling_or_rfq_module_1.WhiteLabelingOrRfqModule,
            get_in_touch_module_1.GetInTouchModule,
            prodo_partner_module_1.ProdoPartnerModule,
            wishlist_module_1.WishlistModule,
            authentication_module_1.AuthenticationModule,
            faq_module_1.FaqModule,
            client_data_module_1.ClientDataModule,
            document_module_1.DocumentModule,
            attachment_module_1.AttachmentModule,
            employee_module_1.EmployeeModule,
            gst_module_1.GstModule,
            supplychain_module_1.SupplyChainModule,
            territory_module_1.TerritoryModule,
            item_module_1.ItemModule,
            shipment_module_1.ShipmentModule,
            contact_form_module_1.ContactFormModule,
            inventory_module_1.InventoryModule,
            sms_module_1.SmsModule,
            team_module_1.TeamModule,
            mailTrigger_module_1.MailTriggerModule,
            s3_module_1.S3Module,
            tickets_module_1.TicketsModule,
            salesorders_module_1.SalesordersModule,
            invoicePod_module_1.invoicePodModule,
            rfqBid_module_1.rfqBidModule,
            manufacture_module_1.ManufactureModule,
            company_module_1.companyModule,
            entities_module_1.entitiesModule,
            manufacture_module_1.ManufactureModule,
            zohoSalesOrder_module_1.zohoSalesOrderModule,
            zohoPurchaseOrder_module_1.zohoPurchaseOrderModule,
            zohoBill_module_1.zohoBillModule,
            zohoInvoice_module_1.zohoInvoiceModule,
            tempuser_module_1.TempuserModule,
            prodoRoles_module_1.prodoRolesModule,
            prodoPermission_module_1.prodoPermissionAndGroupModule,
            internalInvoicePod_module_1.internalInvoicePodModule,
            zohoEmployee_module_1.zohoEmployeeModule,
            team_module_2.InternalTeamModule,
            data_module_1.zohoDataModule,
            logistics_module_1.logisticsModule,
            ptype_module_1.pTypeModule,
            parentSku_module_1.parentSkuModule,
            process_module_1.processModule,
            test_module_1.testModule,
            batch_module_1.batchModule,
            batchItem_module_1.batchItemModule,
            fulfillment_module_1.fulfillmentTrackerModule
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map