import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
// import { Status, productPType } from './pType.entity';
import { Status,Test,TestProcess } from './test.entity';
import { TestService } from '../processTest/test.service'
import { TestController } from '../processTest/test.controller';
import { testProcessController } from '../processTest/testProcess.controller';
import { testProcessService } from '../processTest/testProcess.service'
import { processService } from '../process/process.service'
import { process } from '../process/process.entity';



import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { roleMiddleware } from '../authentication/middleware';


@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,Test,TestProcess,process]),zohoEmployeeModule
  ],
  controllers: [TestController,testProcessController],
  providers: [TestService,testProcessService,processService],
  exports:[TestService,testProcessService,processService]
})
export class testModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(TestController,testProcessController);
  }

} 

