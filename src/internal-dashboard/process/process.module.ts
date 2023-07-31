import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
// import { Status, productPType } from './pType.entity';
import { Status, process,PSkuProcess } from './process.entity';
import { processService } from './process.service'
import { processController } from './process.controller';
import {PSkuProcessService} from './pSkuProcess.service'
import {PSkuProcessController} from './pSkuProcess.controller'

import {parentSkuService} from '../parentSku/parentSku.service'
import { parentSku } from '../parentSku/parentSku.entity';

import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { roleMiddleware } from '../authentication/middleware';

import {TestProcess,Test} from '../processTest/test.entity';

import { TestService } from '../processTest/test.service'

import { testProcessService } from '../processTest/testProcess.service'

@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,process,parentSku,PSkuProcess,TestProcess,Test]),zohoEmployeeModule
  ],
  controllers: [processController,PSkuProcessController],
  providers: [processService,parentSkuService,PSkuProcessService,testProcessService,TestService],
  exports:[processService,parentSkuService,PSkuProcessService,testProcessService,TestService]
})
export class processModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(processController,PSkuProcessController);
  }

} 

