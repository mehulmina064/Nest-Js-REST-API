import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { Status, BatchItem,BatchItemProcess } from './batchItem.entity';
import { batchItemService } from './batchItem.service'
import {  batch,BatchItemConnection} from '../batches/batch.entity';
import { batchService } from '../batches/batch.service'
import { batchItemController } from './batchItem.controller';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';

import { process } from '../process/process.entity';
import { processService } from '../process/process.service'
import { batchItemProcessController } from './batchItemProcess.controller';
import { batchItemProcessService } from './batchItemProcess.service'
import { roleMiddleware } from '../authentication/middleware';

import {internalPurchaseOrderService} from '../zohoData/services/purchaseOrder.service'
import { zohoPurchaseOrder } from './../../zohoPurchaseOrder/zohoPurchaseOrder.entity';

import { ProductPSku } from '../zohoData/entity/ProductPSku.entity';
import {ProductPSkuService} from '../zohoData/services/productPSku.service'



@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,BatchItem,BatchItemProcess,process,batch,zohoPurchaseOrder,ProductPSku]),zohoEmployeeModule
  ],
  controllers: [batchItemController,batchItemProcessController],
  providers: [batchItemService,processService,batchItemProcessService,batchService,internalPurchaseOrderService,ProductPSkuService],
  exports:[batchItemService,processService,batchItemProcessService,batchService,internalPurchaseOrderService,ProductPSkuService]
})
export class batchItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(batchItemController,batchItemProcessController);
  }

} 

