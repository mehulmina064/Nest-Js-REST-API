// Controller for Gst Service
import { Controller, Get, Param, Post, Body, Delete, Put, UseGuards, HttpCode, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { GstService } from './gst.service';
import { Gst } from './gst.entity';

import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../files/file.utils';


@Controller('gst')
export class GstController {

    constructor(private readonly gstService: GstService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<Gst[]> {
        return await this.gstService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('byid/:id')
    async findOne(@Param('id') id: string): Promise<Gst> {
        return await this.gstService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(201)
    async save(@Body() gst: Gst): Promise<Gst> {
        return await this.gstService.save(gst);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Gst> {
        return await this.gstService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() gst: Gst): Promise<Gst> {
        return await this.gstService.update(id, gst);
    }

    @Post(':type/bulk-upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: editFileName,
        }),
    }))
    async bulkUploadFromExcel(@UploadedFile() file,@Param('type') type: string): Promise<any> {
        if (type === 'gst') {
            return await this.gstService.bulkInsertFromExcelGST(file);
        }
        if (type === 'hsnsac') {
            return await this.gstService.bulkInsertFromExcelHSNSAC(file);
        }
        return { "message": 'Invalid Type' };

    }

    @Get('gethsnsaccodes')
    async searchHSNCode(@Query() query: any): Promise<any> {
        if (query.description){
            return await this.gstService.SearchHSNSACCodeByDescription(query.description);
        }
        if (query.hsnCode){
            return await this.gstService.SearchDescriptionFromHsnCode(query.hsnCode);
        }
        return { "message": 'Invalid Query' };
    }
@Get('get-gst-from-hsn-code')
    async getGSTCode(@Query() query: any): Promise<any> {
        if (query.hsnCode){
            return await this.gstService.findByHSNCode(query.hsnCode);
        }
        return { "message": 'Invalid Query' };
    }
  

}
