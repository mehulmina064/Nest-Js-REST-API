import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './wishlist.entity';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Promise<Wishlist[]> {
    return this.wishlistService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(id);
  }

  @Post()
  save(@Body() category: Wishlist) {
    return this.wishlistService.save(category);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.wishlistService.remove(id);
  }
}
