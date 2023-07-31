import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { Status, FulfillmentTracker } from './fulfillmentTracker.entity';
import { fulfillmentTrackerService } from './fulfillmentTracker.service'
import { fulfillmentTrackerController } from './fulfillment.cntroller'
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';

//import batches
import { batch} from '../batches/batch.entity';
import { batchService } from '../batches/batch.service'

//import so
import {zohoSalesOrder} from './../../zohoSalesOrder/zohoSalesOrder.entity';
//zoho services imports
import {internalSalesOrderService} from '../zohoData/services/salesOrder.service'
import { roleMiddleware } from '../authentication/middleware';

@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,FulfillmentTracker,batch,zohoSalesOrder]),zohoEmployeeModule
  ],
  controllers: [fulfillmentTrackerController],
  providers: [fulfillmentTrackerService,batchService,internalSalesOrderService],
  exports:[fulfillmentTrackerService,batchService,internalSalesOrderService]
})
export class fulfillmentTrackerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(fulfillmentTrackerController);
  }

} 

