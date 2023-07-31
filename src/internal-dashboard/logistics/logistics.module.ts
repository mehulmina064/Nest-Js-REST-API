import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { Status, logistics } from './logistics.entity';
import { logisticsService } from './logistics.service'
import { logisticsController } from './logistics.controller';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { roleMiddleware } from '../authentication/middleware';


@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,logistics]),zohoEmployeeModule
  ],
  controllers: [logisticsController],
  providers: [logisticsService],
  exports:[logisticsService]
})
export class logisticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(logisticsController);
  }

} 

