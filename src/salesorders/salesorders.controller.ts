import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesordersService } from './salesorders.service';


@Controller('salesSheet')
export class SalesordersController {
  constructor(private readonly salesOrdersService: SalesordersService) {}

  @Post("sync-data")
 async  syncSalesData() {
    return await this.salesOrdersService.salesOrdersSheetDataSync();
  }
  @Post("set-auto-sync-data")
 async  autoSyncSalesData(@Body() body:any) {
    return await this.salesOrdersService.autuSyncShedule();
  // if(body.second||body.minute||body.hour||body.second==0||body.minute==0||body.hour==0){
  //   return await this.salesOrdersService.autuSyncShedule(body.second?body.second:0,body.minute?body.minute:0,body.hour?body.hour:0);
  // }
  // else {
  //   throw new HttpException({  
  //     status: HttpStatus.BAD_REQUEST,
  //     error: 'BAD_REQUEST', 
  //     message: "Please Provide atleast one from second,minute.hour"
  //   }, HttpStatus.BAD_REQUEST);
  // }

  }

}
