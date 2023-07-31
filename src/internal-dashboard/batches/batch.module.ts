import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { Status, batch,BatchItemConnection} from './batch.entity';
import { batchService } from './batch.service'
import { batchController } from './batch.controller';
import {batchItemConnectionController} from './batchItemConnection.controller'
import { batchItemConnectionService } from './batchItemConnection.service'
import {  BatchItem } from '../batchItems/batchItem.entity';
import { batchItemService } from '../batchItems/batchItem.service'
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';

import {zohoSalesOrder} from './../../zohoSalesOrder/zohoSalesOrder.entity';
//zoho services imports
import {internalSalesOrderService} from '../zohoData/services/salesOrder.service'
import { roleMiddleware } from '../authentication/middleware';

@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,batch,BatchItem,BatchItemConnection,zohoSalesOrder]),zohoEmployeeModule
  ],
  controllers: [batchController,batchItemConnectionController],
  providers: [batchService,batchItemService,batchItemConnectionService,internalSalesOrderService],
  exports:[batchService,batchItemService,batchItemConnectionService,internalSalesOrderService]
})
export class batchModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(batchController,batchItemConnectionController);
  }

} 

