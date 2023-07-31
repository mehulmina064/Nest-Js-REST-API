//nestjs module for item


import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService],
    controllers: [ItemController]
})
export class ItemModule { }
