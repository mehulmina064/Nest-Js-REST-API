// import { Category } from './../categories/category.entity';
// import * as XLSX from 'xlsx';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Any, EntityRepository, MongoRepository, ObjectID, Repository } from 'typeorm';
// import { Product } from './product.entity';
// import { CategoryService } from '../categories/category.service';
// import { ProductList } from './product-interface';
// import {
//   paginate,
//   Pagination,
//   IPaginationOptions,
// } from 'nestjs-typeorm-paginate';
// import { ProductVariant } from './product-variant.entity';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';


// tslint:disable-next-line:no-var-requires
// const crypto = require('crypto');

// @Injectable()
export class S3Service {
  [x: string]: any;
  constructor(
    // @InjectRepository(Product)
    // private readonly productRepository: Repository<Product>,
    // private readonly categoryService: CategoryService,
  ) {
  }
  async S3UniversalUpload (file: any, s3config: any) {
    // console.log(file);
    // console.log('s3config',typeof s3config,JSON.stringify(s3config));
    const s3 = new S3()
        // console.log('upload',s3config)
        const uploadedImage = await s3.upload({
            "Bucket": s3config['Bucket'],
            "Key": `${uuid()}-${file.originalname}`,
            "Content-Type": file.mimetype,
            "Body": file.buffer,
            "ACL": s3config['ACL'],
            "Inline":s3config['Inline'], // required to be false
        }).promise()

        return await {name:file.originalname, url:uploadedImage.Location}
        ;

  }

}

