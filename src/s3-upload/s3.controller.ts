import { Category } from './../categories/category.entity';
import { getMongoRepository, getRepository } from 'typeorm';
import { editFileName } from './../files/file.utils';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Query, UploadedFile, UseInterceptors,Request } from '@nestjs/common';
// import { Product } from './product.entity';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
// import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
// import { ProductList } from './product-interface';
var request = require('request')
var fs = require('fs')

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3service : S3Service) {}
  @Post('Universal')  /// post request for creating univeral buckets
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file:any,@Body('Bucket') bucket : any,@Body('ACL') acl : any,@Body('Inline') inline : any) {
    let s3config = {
      Bucket: bucket?bucket:process.env.AWS_S3_BUCKET_NAME,
      ACL: acl?acl:'public-read',
      Inline:inline?inline:true,
    }
    return this.s3service.S3UniversalUpload(file, s3config);
  }
 
  
}  
