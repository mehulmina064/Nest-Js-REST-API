import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
// import { Status, productPType } from './pType.entity';
import { Status, parentSku } from './parentSku.entity';
import { parentSkuService } from './parentSku.service'
import { parentSkuController } from './parentSku.controller';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { roleMiddleware } from '../authentication/middleware';

import { process,PSkuProcess } from '../process/process.entity';
import { processService } from '../process/process.service'
import {PSkuProcessService} from '../process/pSkuProcess.service'

@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,parentSku,process,PSkuProcess]),zohoEmployeeModule
  ],
  controllers: [parentSkuController],
  providers: [parentSkuService,processService,PSkuProcessService],
  exports:[parentSkuService,PSkuProcessService,processService]
})
export class parentSkuModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(parentSkuController);
  }

} 

