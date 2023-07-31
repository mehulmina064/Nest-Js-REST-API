import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {
  }

  @Get()
  findAll(): Promise<Setting[]> {
    return this.settingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingService.findOne(id);
  }

  @Post()
  save(@Body() category: Setting) {
    return this.settingService.save(category);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.settingService.remove(id);
  }
}
