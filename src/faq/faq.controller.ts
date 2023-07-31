import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { Faq } from './faq.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Faq[]> {
    return this.faqService.findAll();
  }

  @Get('type/:type')
  findAllByType(@Param('type') type: string): Promise<Faq[]> {
    return this.faqService.findAllByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() faq: Faq) {
    return this.faqService.save(faq);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() faq: Faq) {
    return this.faqService.update(id, faq);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.faqService.remove(id);
  }
}
