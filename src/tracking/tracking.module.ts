import { TrackingService } from './tracking.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { Tracking } from './tracking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Tracking])],
    controllers: [TrackingController],
    providers: [
        TrackingService,],
})
export class TrackingModule { }
