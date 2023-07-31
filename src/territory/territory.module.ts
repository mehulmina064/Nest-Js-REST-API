// Module for Territory

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Territory } from './territory.entity';
import { TerritoryService } from './territory.service';
import { TerritoryController } from './territory.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Territory])],
    providers: [TerritoryService],
    controllers: [TerritoryController],
    exports: [TerritoryService]
})
export class TerritoryModule {}
