import { TrackingModule } from './tracking/tracking.module';
import { FilesModule } from './files/files.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './users/user.module';
import { AccountModule } from './account/account.module';
import { OrganizationModule } from './organization/organization.module';
import { ProductModule } from './product/product.module';
import { AddressModule } from './addresses/address.module';
import { CategoryModule } from './categories/category.module';
import { OrderModule } from './orders/order.module';
import { SettingModule } from './settings/setting.module';
import { WhiteLabelingOrRfqModule } from './white-labeling-or-rfq/white-labeling-or-rfq.module';
import { GetInTouchModule } from './get-in-touch/get-in-touch.module';
import { ProdoPartnerModule } from './prodo-partner/prodo-partner.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { FaqModule } from './faq/faq.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ClientDataModule } from './clientData/client-data.module';
import { DocumentModule } from './document/document.module';
import { AttachmentModule } from './attachments/attachment.module';
import { EmployeeModule } from './employee/employee.module';
import { GstModule } from './gst/gst.module';
import { SupplyChainModule } from './supplychain/supplychain.module';
import { ItemModule } from './item/item.module';
import { ShipmentModule } from './shipment/shipment.module';
import { InventoryModule } from './inventory/inventory.module';
import {TerritoryModule} from './territory/territory.module';
import { SmsModule } from './sms/sms.module';
import { TeamModule } from './team/team.module';
import { MailTriggerModule } from './mailTrigger/mailTrigger.module';
import {S3Module} from './s3-upload/s3.module';
import { TicketsModule } from './tickets/tickets.module';
import {SalesordersModule} from './salesorders/salesorders.module'
import { invoicePodModule } from './invoice-pod/invoicePod.module';
import { rfqBidModule } from './rfqBid/rfqBid.module';
import { companyModule } from './company/company.module';
import { entitiesModule } from './entities/entities.module';
import { ManufactureModule } from './manufacture/manufacture.module';
import {zohoSalesOrderModule} from './zohoSalesOrder/zohoSalesOrder.module'
import {zohoPurchaseOrderModule} from './zohoPurchaseOrder/zohoPurchaseOrder.module'
import { zohoBillModule } from './zohoBill/zohoBill.module';
import { zohoInvoiceModule } from './zohoInvoice/zohoInvoice.module';
import { TempuserModule } from './tempuser/tempuser.module';



//internal dashboard modules import
import {zohoEmployeeModule} from './internal-dashboard/zohoEmployee/zohoEmployee.module';
import {prodoRolesModule} from './internal-dashboard/prodoRoles/prodoRoles.module';
import {prodoPermissionAndGroupModule} from './internal-dashboard/prodoPermissionAndGroup/prodoPermission.module';
import {internalInvoicePodModule} from './internal-dashboard/internalInvoicePod/internalInvoicePod.module';
import {InternalTeamModule} from './internal-dashboard/team/team.module';
import {zohoDataModule} from './internal-dashboard/zohoData/data.module';
import {logisticsModule} from './internal-dashboard/logistics/logistics.module';
import {pTypeModule} from './internal-dashboard/productPType/ptype.module';
import {parentSkuModule} from './internal-dashboard/parentSku/parentSku.module';
import {processModule} from './internal-dashboard/process/process.module';
import {testModule} from './internal-dashboard/processTest/test.module';
import {batchModule} from './internal-dashboard/batches/batch.module';
import {batchItemModule} from './internal-dashboard/batchItems/batchItem.module';
import {fulfillmentTrackerModule} from './internal-dashboard/fulfillmentTracker/fulfillment.module';















@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  

    MulterModule.register({
      dest: './files',
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_DB_OLD,
      // url: process.env.MONGO_DB_TEST,
  
      database: process.env.MONGO_DB_NAME_MAIN,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: false,
      useNewUrlParser: true,
      ssl: true, 
      // AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      // AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
       
    }),
    MailModule,
    FilesModule,
    TrackingModule,
    UserModule,
    AccountModule,
    OrganizationModule,
    AddressModule,
    CategoryModule,
    OrderModule,
    ProductModule,
    SettingModule,
    UserModule,
    WhiteLabelingOrRfqModule,
    GetInTouchModule,
    ProdoPartnerModule,
    WishlistModule,
    AuthenticationModule,
    FaqModule,
    ClientDataModule,
    DocumentModule,
    AttachmentModule,
    EmployeeModule,
    GstModule,
    SupplyChainModule, 
    TerritoryModule,
    ItemModule,
    ShipmentModule,
    ContactFormModule,  
    InventoryModule,
    SmsModule,
    TeamModule,
    MailTriggerModule,
    S3Module,
    TicketsModule,
    SalesordersModule,
    invoicePodModule,
    rfqBidModule,
    // companyModule,
    ManufactureModule,
    companyModule,
    entitiesModule,
    ManufactureModule,
    zohoSalesOrderModule,
    zohoPurchaseOrderModule,
    zohoBillModule,
    zohoInvoiceModule,
    TempuserModule,
    // AccessControl


    //internal dashboard modules import
    prodoRolesModule,
    prodoPermissionAndGroupModule,
    internalInvoicePodModule,
    zohoEmployeeModule,
    InternalTeamModule,
    zohoDataModule,
    logisticsModule,
    pTypeModule,
    parentSkuModule,
    processModule,
    testModule,
    batchModule,
    batchItemModule,
    fulfillmentTrackerModule
 

  ]
})  

export class AppModule { }
