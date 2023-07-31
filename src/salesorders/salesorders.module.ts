import { Module } from '@nestjs/common';
import { SalesordersService } from './salesorders.service';
import { SalesordersController } from './salesorders.controller';

@Module({
  controllers: [SalesordersController],
  providers: [SalesordersService]
})
export class SalesordersModule {}
