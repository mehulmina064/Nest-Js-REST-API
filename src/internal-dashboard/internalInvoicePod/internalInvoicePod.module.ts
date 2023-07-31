import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import { invoicePod } from './internalInvoicePod.entity';
import { invoicePodService } from './internalInvoicePod.service';
import { invoicePodController } from './internalInvoicePod.controller';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { roleMiddleware } from '../authentication/middleware';


@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,invoicePod]),zohoEmployeeModule
  ],
  controllers: [invoicePodController],
  providers: [invoicePodService],
  exports:[invoicePodService]
})
export class internalInvoicePodModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(invoicePodController);
  }

} 


