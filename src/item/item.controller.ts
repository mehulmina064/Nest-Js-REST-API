import { UserRole } from './../users/roles.constants';
import { JwtAuthGuard } from './../authentication/jwt-auth.guard';
// nestjs controller for item.service

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { RolesGuard } from '../authentication/roles.guard';
import { filterAllData,filterSingleObject } from '../common/utils';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {

    constructor(private readonly itemService: ItemService) { }

    @Get()
    async getAllItems(@Request() req,@Query() query): Promise<Item[]> {

        return await filterAllData(this.itemService, req)
    }
    @Get(':id')
    async getItem(@Param('id') id: number,@Request() req): Promise<Item> {
        const item = await this.itemService.findOne(id);
        return await filterSingleObject(req.user,item);
    }
    @Post()
    async addItem(@Body() item: Item,@Request() req): Promise<Item> {
          item.organization_id = req.user.organization_id;     
        return await this.itemService.create(item);
    }

    @Put(':id')
    async updateItem(@Param('id') id: number, @Body() item: Item): Promise<Item> {
           return await this.itemService.update(id, item);
    }

    @Delete(':id')
    async deleteItem(@Param('id') id: number): Promise<Item> {
        return await this.itemService.delete(id);
    }
}
    