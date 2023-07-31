import { Module } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import { ErrorLogController } from './error-log.controller';
import { ErrorLog } from './error-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ErrorLog])],
    providers: [ErrorLogService],
    controllers: [ErrorLogController],
    exports: [ErrorLogService],
})
export class ErrorLogModule {}
