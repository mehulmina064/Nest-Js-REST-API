import { Warehouse } from './../inventory/entities/warehouse.entity';
import { Territory } from './territory.entity';
import { diskStorage } from 'multer';
import { editFileName } from './../files/file.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './../authentication/jwt-auth.guard';
import { UseGuards, Controller, Get, Request, Query, Param, Post, Patch, Delete, Body, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { filterAllData, filterSingleObject } from '../common/utils';
import { TerritoryService } from './territory.service';
import { getRepository } from 'typeorm';
// Create Controller for Territories and add the following code:
@UseGuards(JwtAuthGuard)
@Controller('territories')
export class TerritoryController {
    constructor(private readonly territoryService: TerritoryService) { }

    @Get()
    async findAll(@Request() req) {
        return await this.territoryService.findAll(req.user);
    }


    @Get('filter')
    async filter(@Query() query) {
        return await this.territoryService.filter(query);
    }

    @Get('territorybyid/:id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.territoryService.findOne(id);
    }

    @Get('territorybyname/:name')
    findOneByName(@Param('name') name: string, @Request() req) {

        return filterSingleObject(this.territoryService, req.user);
    }
    
    @Post()
    async save(@Body() territory: any, @Request() req) {
        // console.log('territory',territory);
        territory.createdBy = req.user.id;
        return await this.territoryService.save(territory);
    }

    @Patch('update')
    async update(@Body() territory: any, @Request() req) {
        territory.updatedBy = req.user.id;
        return await this.territoryService.update(territory.id, territory);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req) {
        return await this.territoryService.delete(id);
    }

    // Get tree data for the given territory
    @Get('tree/')
    async findTree(@Param('organizationId') organizationId: string, @Request() req) {
        return await this.territoryService.getTerritoryTree();

    }

    @Get('parent/:id')
    async findByParent(@Param('id') id: string, @Request() req) {
        return await this.territoryService.findByParent(id);
    }

    @Get('territorybyname/:name')
    async findByName(@Param('name') name: string, @Request() req) {
        return await this.territoryService.findByName(name);
    }

    @Get('territorybycode/:code')
    async findByCode(@Param('code') code: string, @Request() req) {
        return await this.territoryService.findByCode(code);
    }
    

    @Get('ancestors/:id')
    async findByAncestors(@Param('id') id: string, @Request() req) {
        return await this.territoryService.findAncestors(id);
    }

    @Get('descendants/:id')
    async findByDescendants(@Param('id') id: string, @Request() req) {
        return await this.territoryService.getChildren(id); 
    }

    // Get all territories for the given organization
    // @Get('organization/:organizationId')
    // async findByOrganization(@Param('organizationId') organizationId: string, @Request() req) {
    //     return await this.territoryService.findByOrganization(organizationId);
    // }

    @Post('upload-unimove-hubs')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
              }),
        }),
    )
    async uploadUnimoveHubs(@Request() req, @UploadedFile() file) {
        return await this.territoryService.uploadUnimoveHubs(file);
    }

    @Get('delete-unimove-hubs')
    async deleteUnimoveHubs() {
        return await this.territoryService.deleteTerritories();
    }

//     @Get('fix-hubs')
//     async fixHubsName() {
//         const hubs = await getRepository(Territory).find()
//         hubs.forEach(async hub => {
//             const old_name = hub.name
//             hub.name = hub.code
//             hub.code = old_name
//             await getRepository(Territory).save(hub)
//     })

//     return hubs
// }
// @Get('fix-warehouse')
// async fixWarehouseName() {
// const warehouses = await getRepository(Warehouse).find()
// warehouses.forEach(async warehouse => {
//     const old_name = warehouse.name
//     warehouse.name = warehouse.code
//     warehouse.code = old_name
//     await getRepository(Warehouse).save(warehouse)

// })
// return warehouses
// }




}

