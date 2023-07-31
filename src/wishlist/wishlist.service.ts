import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { ProductService } from '../product/product.service';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private productService: ProductService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find();
  }

  async findByUser(userId): Promise<Wishlist[]> {
    const wishlist = await this.wishlistRepository.find({userId});
    const wishlistItems = [];
    return await this.wishlistRepository.find({userId});
  }

  async findOne(id: string): Promise<Wishlist> {
    return await this.wishlistRepository.findOne(id);
  }

  async save(wishlist: Wishlist) {
    this.wishlistRepository.findOne({ userId: wishlist.userId }).then(result => {
      this.wishlistRepository.delete(result);
    });
    return await this.wishlistRepository.save(wishlist);
  }

  async remove(id) {
    const user = this.wishlistRepository.findOne(id).then(result => {
      this.wishlistRepository.delete(result);
    });
  }
}
