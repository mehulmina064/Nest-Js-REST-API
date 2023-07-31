import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../categories/category.module';
import { ProductRating } from './productRating.entity';
import { UserReview } from './userReview.entity';

import { zohoPurchaseOrder } from './../zohoPurchaseOrder/zohoPurchaseOrder.entity';

import { zohoSalesOrder } from './../zohoSalesOrder/zohoSalesOrder.entity';



@Module({
  imports: [CategoryModule, TypeOrmModule.forFeature([Product,ProductRating,UserReview,zohoPurchaseOrder,zohoSalesOrder])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
