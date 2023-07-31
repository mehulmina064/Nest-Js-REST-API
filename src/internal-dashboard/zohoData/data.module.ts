import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { zohoSalesOrderByUser } from '../../sms/zohoSalesOrderByUser.entity';
import { UserModule } from '../../users/user.module';
import { prodoRoles } from '../prodoRoles/prodoRoles.entity';
import { UserAndRoles } from '../prodoRoles/EmployeeAndRoles.entity';
import { invoicePod } from '../internalInvoicePod/internalInvoicePod.entity';
import { invoicePodService } from '../internalInvoicePod/internalInvoicePod.service';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import {zohoDataController} from './data.controller'
import {zohoDataService} from './data.service'

//import roll and permission modules
import { prodoRolesService } from '../prodoRoles/prodoRoles.service'
import { userRolesService } from '../prodoRoles/userRoles.service'

//product module imports
import { Product } from './../../product/product.entity';
import { ProductRating } from './../../product/productRating.entity';
import { UserReview } from './../../product/userReview.entity';
import { Category } from './../../categories/category.entity';
import { CategoryService } from './../../categories/category.service';
import {internalProductService} from './services/product.service'

//ParentSku and Product mapping import
import { parentSku } from '../parentSku/parentSku.entity';
import {parentSkuService} from '../parentSku/parentSku.service'
import { ProductPSku } from './entity/ProductPSku.entity';
import {ProductPSkuService} from './services/productPSku.service'
import {ProductPSkuController} from './productPSku.controller'


//zoho entity imports
import { zohoBill } from './../../zohoBill/zohoBill.entity';
import { zohoInvoice } from './../../zohoInvoice/zohoInvoice.entity';
import { zohoPurchaseOrder } from './../../zohoPurchaseOrder/zohoPurchaseOrder.entity';
import {zohoSalesOrder} from './../../zohoSalesOrder/zohoSalesOrder.entity';
//zoho services imports
import {internalSalesOrderService} from './services/salesOrder.service'
import {internalBillService} from './services/bill.service' 
import {internalInvoiceService} from './services/invoice.service'
import {internalPurchaseOrderService} from './services/purchaseOrder.service'

//fulfillments service imports
import { FulfillmentTracker } from '../fulfillmentTracker/fulfillmentTracker.entity';
import { fulfillmentTrackerService } from '../fulfillmentTracker/fulfillmentTracker.service'
import { roleMiddleware } from '../authentication/middleware';

//Batch Items import
import { Status, BatchItem} from '../batchItems/batchItem.entity';
import { batchItemService } from '../batchItems/batchItem.service'


@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,zohoSalesOrder,zohoSalesOrderByUser,zohoBill,invoicePod,prodoRoles,UserAndRoles,Product
    ,ProductRating,UserReview,Category,zohoInvoice,zohoPurchaseOrder,parentSku,ProductPSku,FulfillmentTracker,BatchItem]),UserModule,zohoEmployeeModule
  ],
  controllers: [zohoDataController,ProductPSkuController],
  providers: [invoicePodService,zohoDataService,prodoRolesService,userRolesService,internalProductService
    ,CategoryService,internalBillService,internalInvoiceService,internalPurchaseOrderService,internalSalesOrderService,parentSkuService,ProductPSkuService,fulfillmentTrackerService,batchItemService],
  exports:[invoicePodService,zohoDataService,prodoRolesService,userRolesService,internalProductService
    ,CategoryService,internalBillService,internalInvoiceService,internalPurchaseOrderService,internalSalesOrderService,parentSkuService,ProductPSkuService,fulfillmentTrackerService,batchItemService]
})
export class zohoDataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(zohoDataController,ProductPSkuController);
  }

} 

