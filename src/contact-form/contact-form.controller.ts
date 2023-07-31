import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ContactFormService } from './contact-form.service';
import { ContactForm } from './contact-form.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('contact-form')
export class ContactFormController {
  constructor(private readonly contactFormService: ContactFormService) {
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<ContactForm[]> {
    return this.contactFormService.findAll();
  }

  @Get('type/:type')
  findAllByType(@Param('type') type: string): Promise<ContactForm[]> {
    return this.contactFormService.findAllByType(type);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactFormService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() Form: ContactForm) {
    return this.contactFormService.save(Form);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() Form: ContactForm) {
    return this.contactFormService.update(id, Form);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.contactFormService.remove(id);
  }
}
