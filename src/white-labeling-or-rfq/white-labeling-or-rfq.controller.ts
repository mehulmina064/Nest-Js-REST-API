import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WhiteLabelingOrRfqService } from './white-labeling-or-rfq.service';
import { WhiteLabelingOrRfq } from './white-labeling-or-rfq.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('white-labeling-rfq')
export class WhiteLabelingOrRfqController {
  constructor(private readonly whiteLabelingOrRfqService: WhiteLabelingOrRfqService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<WhiteLabelingOrRfq[]> {
    return this.whiteLabelingOrRfqService.findAll();
  }

  @Get(':type/user/:userId')
  findTypeByUser(@Param('type') type: string, @Param('userId') userId: string): Promise<WhiteLabelingOrRfq[]> {
    return this.whiteLabelingOrRfqService.findTypeByUser(type, userId);
  }
  @Get('/user/:userId')
  findAllByUser( @Param('userId') userId: string): Promise<WhiteLabelingOrRfq[]> {
    return this.whiteLabelingOrRfqService.findAllByUser( userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whiteLabelingOrRfqService.findOne(id);
  }

  @Post()
  save(@Body() category: WhiteLabelingOrRfq) {
    return this.whiteLabelingOrRfqService.save(category);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() rfq: WhiteLabelingOrRfq) {

    return this.whiteLabelingOrRfqService.update(id, rfq);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.whiteLabelingOrRfqService.remove(id);
  }
}
