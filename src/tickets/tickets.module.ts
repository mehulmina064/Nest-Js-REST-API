import { HttpModule, Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UserModule } from './../users/user.module';
import { zohoToken } from './../sms/token.entity';
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports : [UserModule,HttpModule,
    TypeOrmModule.forFeature([zohoToken])
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports:[TicketsService]
})
export class TicketsModule {}
