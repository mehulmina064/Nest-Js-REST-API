import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProdoPowerClubService } from './prodo-power-club.service';
import { ProdoPowerClub } from './prodo-power-club.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('prodo-partner')
export class ProdoPowerClubController {
  constructor(private readonly prodoPartnerService: ProdoPowerClubService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<ProdoPowerClub[]> {
    return this.prodoPartnerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prodoPartnerService.findOne(id);
  }

  @Post()
  save(@Body() prodoPowerClub: ProdoPowerClub) {
    return this.prodoPartnerService.save(prodoPowerClub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.prodoPartnerService.remove(id);
  }
}
