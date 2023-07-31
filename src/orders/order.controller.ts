import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.findAllByUser(userId);
  }
  @Get('user-summery/:userId')
  getSummeryByUser(@Param('userId') userId: string): Promise<any> {
    return this.orderService.getSummeryByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  save(@Body() category: Order) {
    return this.orderService.save(category);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() order: Order) {
    return this.orderService.update(id, order);
  }

  @Patch('cancel/:id')
  requestCancellation(@Param('id') id: string) {
    return this.orderService.update(id, {orderStatus: 'Cancellation Requested'});
  }

  @Patch('need-help/:id')
  needHelp(@Param('id') id: string, @Body() message: string) {
    console.log(message);
    // return this.orderService.needHelp(id, {orderStatus: 'Cancellation Requested'});
  }

  @Delete(':id')
  delete(@Param('id') id:any) {
    return this.orderService.remove(id);
  }
}
