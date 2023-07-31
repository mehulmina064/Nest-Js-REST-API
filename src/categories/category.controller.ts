import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Query  } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import {Pagination,} from 'nestjs-typeorm-paginate';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }

  // @Get()
  // async index(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  // ): Promise<Pagination<Category>> {
  //   limit = limit > 100 ? 100 : limit;
  //   return this.categoryService.paginate({
  //     page,
  //     limit,
  //     route: '/categories',
  //   });
  // }
@Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() category: Category) {
    return this.categoryService.save(category);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() category: Category) {
    return this.categoryService.update(id, category);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.categoryService.remove(id);
  }

 
}
