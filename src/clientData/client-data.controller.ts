import { JwtAuthGuard } from './../authentication/jwt-auth.guard';
// Client Data Controller for Client Service ./../clientData/client-data.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, UploadedFile, UseInterceptors,Query } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { ClientData } from './client-data.entity';
import { AuthGuard } from '@nestjs/passport';
import { ClientDataDto } from './client-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../files/file.utils';
import { ObjectID, getRepository } from 'typeorm';
import { filterAllData } from '../common/utils';
// import { DocumentService } from "./../document/document.service";
@UseGuards(JwtAuthGuard)
@Controller('client-data')
export class ClientDataController {
    constructor(private readonly clientDataService: ClientDataService) { }
    // constructor(private readonly documentService: DocumentService) { }
    @Get()
    findAll(@Request() req, @Query() query) {
        return filterAllData(this.clientDataService,req.user);
    }


    // Get all line items for a client
    @Get('line-items')
    async getLineItems(@Request() req) {
        let clientsData = await this.findAll(req);
        let lineItems= [];
        if(clientsData){
            clientsData.forEach( async client => {
                if(client.line_items){
                    let foundLineItems =  await this.clientDataService.getLineItems(client.id);
                    lineItems.push(foundLineItems);
                    }
                
            });
            return lineItems;
        }
        return null;
        
    }
    @Get('clear-data')
    async clearData(){
        const data = await getRepository(ClientData).find(
            {
                where: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                }
            }
        );
        return data
    }
    @Get('dashboard-data')
    async getDashboardData(@Request() req) {
        let items =  await this.findAll(req);
        let data = {
            orders : {
                total : 0,
                completed : 0,
                inProgress : 0,
                cancelled : 0
            },
            payments : {
                total : 0,
                paid : 0,
                due : 0,

            },
            pieChart : [],
            barChart : []


        }

        if(items){
            items.forEach(async (item) => {
                data.payments.paid += Number(item.amount_received) || 0;; 
                data.payments.total += Number(item.invoice_amount_ex_gst) || 0;
                
                let due_amount = Number(item.invoice_amount_ex_gst) || 0 - Number(item.amount_received) || 0;
                data.payments.due += due_amount;
                if(item.status === 'Delivered'){
                    data.orders.completed++;
                }
                else {
                    data.orders.inProgress++;
                }
                // push {name : item.category_of_products, value : Number(item.invoice_amount_ex_gst)} to pieChart for all common categories
                let found = data.pieChart.find(element => element.name === item.category_of_products);
                if(found){
                    found.value += Number(item.invoice_amount_ex_gst) || 0;
                }
                else if(item.category_of_products && item.invoice_amount_ex_gst && item.invoice_amount_ex_gst > 0) {
                    
                    data.pieChart.push({name : item.category_of_products, value : Number(item.invoice_amount_ex_gst)});
                }
                // push {name : item.po_month, value : Number(item.invoice_amount_ex_gst)} to barChart for all common status
                // Convert Date Object to MMM,YY format
                let date = new Date(item.po_date);
                let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                let foundBar = data.barChart.find(element => element.name === month);
                if(foundBar){
                    foundBar.value += Number(item.invoice_amount_ex_gst) || 0;
                }
                else if(month && item.invoice_amount_ex_gst && item.invoice_amount_ex_gst > 0){
                    data.barChart.push({name : month, value : Number(item.invoice_amount_ex_gst)});
                }
            });
            data.orders.total = items.length;
    }
        return data;
    }


    @Get('filter')
    async filter(@Request() req) {
        return await this.clientDataService.filter(req.query);
    }
    @Get('updateData')
    async download(){
        return await this.clientDataService.updateDataBase();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientDataService.findOne(id);
    }

    @Post()
    save(@Body() clientData: ClientDataDto) {
        return this.clientDataService.save(clientData);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() clientData: ClientDataDto) {
        return await this.clientDataService.update(id, clientData);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        return await this.clientDataService.remove(id);
    }

    //Bulk Upload Client Data from Excel File

    @Post('bulk-upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: editFileName,
        }),
    }))
    async bulkUploadFromExcel(@UploadedFile() file) {
        return await this.clientDataService.bulkUploadFromExcel(file);
    }

    @Post('attach-file/:id')
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './files',
            filename: editFileName,
          }),
        }),
      )
    async attachFile(@Param('id') id:string, @UploadedFile() file,@Request() req) {
        const document_name = req.body.document_name;
        return await this.clientDataService.attachFile(id,file,document_name);
    }
    @Get('attach-file/:id')
    async getAttachedFiles(@Param('id') id:string){
        return await this.clientDataService.getAttachedFiles(id);
    }

    @Delete('attach-file/:id/:file_name')
    async removeFile(@Param('id') id:string,@Param('file_name') file_name:string){
        return await this.clientDataService.removeFile(id,file_name);
    }
   
}