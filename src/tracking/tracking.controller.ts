/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Tracking } from './tracking.entity';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) {
    }
  
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<Tracking[]> {
      return await this.trackingService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Tracking> {
      
      return await this.trackingService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async save(@Body() tracking: Tracking): Promise<Tracking> {
      return await this.trackingService.save(tracking);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Tracking> {
      return await this.trackingService.remove(id);
    }

    
 }
