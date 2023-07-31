import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { Status, productPType } from './pType.entity';
import { pTypeService } from './pType.service'
import { pTypeController } from './pType.controller';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { roleMiddleware } from '../authentication/middleware';


@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,productPType]),zohoEmployeeModule
  ],
  controllers: [pTypeController],
  providers: [pTypeService],
  exports:[pTypeService]
})
export class pTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(pTypeController);
  }

} 

