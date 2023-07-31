import { Category } from './../categories/category.entity';
import { getMongoRepository, getRepository } from 'typeorm';
import { editFileName } from './../files/file.utils';
import { diskStorage } from 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import {HttpException,HttpStatus } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Delete, Get, Param,Request, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { zohoPurchaseOrder } from './../zohoPurchaseOrder/zohoPurchaseOrder.entity';
import { zohoSalesOrder } from './../zohoSalesOrder/zohoSalesOrder.entity';
import { ProductList } from './product-interface';
import {HttpException,HttpStatus } from '@nestjs/common'; 
import {  NotFoundException } from '@nestjs/common';
import { realpathSync } from 'fs';
import { ItemService } from 'dist/item/item.service';
import { name } from 'ejs';
var request = require('request')
var fs = require('fs')

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService,
    @InjectRepository(zohoPurchaseOrder)
    private readonly zohoPurchaseOrderRepository: Repository<zohoPurchaseOrder>,
    @InjectRepository(zohoSalesOrder)
    private readonly zohoSalesOrderRepository: Repository<zohoSalesOrder>,
    ) {
  }
  @Get('Pimcore-product-save-to-prodo')
  async Test() {
   let pimAllProducts= await this.productService.pimAllProducts()
   let products=[]
    for (let i = 0; i < pimAllProducts.length; i++) {
      if(pimAllProducts[i].type == 'L0'){
        products.push(await this.productService.SaveZohoProduct(pimAllProducts[i].data,'L0'))
      }
      else if(pimAllProducts[i].type == 'L1'){
        products.push(await this.productService.SaveZohoProduct(pimAllProducts[i].data,'L1'))
      }
      else if(pimAllProducts[i].type == 'L2'){
        products.push(await this.productService.SaveZohoProduct(pimAllProducts[i].data,'L2'))
      }
      else if (pimAllProducts[i].type == 'L0-C') {
        products.push(await this.productService.SaveZohoProduct(pimAllProducts[i].data,'L0-C'))
      }
    }
    return products
  }
  @Post('review')
  @UseGuards(JwtAuthGuard)
  @Post()
  review(@Body() data: any,@Request() req:any) {
    data.userId=req.user.id
    return this.productService.productRating(data);
  }
  @Get('rating/:id')
  async getRating(@Param('id') zohoId: string) {
    return await this.productService.getProductRating(zohoId);
  }
  @Get('review/:id')
  @UseGuards(JwtAuthGuard)
  getReview(@Param('id') id: string,@Request() req:any) {
    return this.productService.getUserReview(id,req.user.id);
  }

  @Get('fix-data')
  async fixData() {
    let res=[]
    let products = await this.productService.findAllProducts();
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
        product.date= "2020-08-02"
        res.push({name:product.productName,details:await this.productService.update(product.id, product)});
    }
    return res;
  } 
  @Get('pimcore-product-save-to-zoho')
  async pimcoreProductSaveToZoho() {
    let pimAllProducts= await this.productService.pimAllProducts()
    let products=[]
    for (let i = 0; i < pimAllProducts.length; i++) {
      if(pimAllProducts[i].type == 'L0'){
        products.push(await this.productService.ToZohoProduct(pimAllProducts[i].data,'L0'))
      }
      else if(pimAllProducts[i].type == 'L1'){
        products.push(await this.productService.ToZohoProduct(pimAllProducts[i].data,'L1'))
      }
      else if(pimAllProducts[i].type == 'L2'){
        products.push(await this.productService.ToZohoProduct(pimAllProducts[i].data,'L2'))
      }
      else if (pimAllProducts[i].type == 'L0-C') {
        products.push(await this.productService.ToZohoProduct(pimAllProducts[i].data,'L0-C'))
      }
      else if (pimAllProducts[i].type == 'L1-C') {
        products.push(await this.productService.ToZohoProduct(pimAllProducts[i].data,'L1-C'))
      }
    }
    return products
  }
  @Get('bySku/:sku')
  async getProductBySku(@Param('sku') sku: string) {
    return await this.productService.getProductBySku(sku);
  }
  @Get('Pimcore-All-Products')
  async pimAllProducts() {
    let pimAllProducts= await this.productService.pimAllProducts()
    return pimAllProducts
    //for check imagaes url of prdoucts which not have aws link
  //   let out=[]
  //   for (let i = 0; i < pimAllProducts.length; i++) {
  //     if(pimAllProducts[i].data.images){
  //     if(pimAllProducts[i].data.images.startsWith('https://ibb.co')){
  //       out.push({id:pimAllProducts[i].data.id,link:pimAllProducts[i].data.images,rasta:pimAllProducts[i].data.parent}) 
  //     }
  //   }
  //   else{
  //     out.push({id:pimAllProducts[i].data.id,link:'No link',rasta:pimAllProducts[i].data.parent})
  //   }
  // }
  //   return out
  }
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search', new DefaultValuePipe(''), ) search: string = "",
    // @Query('category', new DefaultValuePipe(''), ParseStringPipe) category: string = "",
  ): Promise<Pagination<Product>> {
    console.log('q',page)
    limit = limit > 100 ? 100 : limit;
    if(search){
      const query = {
        where: { 
          $or: [
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            {seo:{$regex:search,$options:'i'}},
            {sku:{$regex:search,$options:'i'}},
            {zohoBooksProductId:{$regex:search,$options:'i'}}
          ]
        },
        take: 10,
      }
      const query1 = {
        where: { 
          $or: [
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            {seo:{$regex:search,$options:'i'}},
            {sku:{$regex:search,$options:'i'}},
            {zohoBooksProductId:{$regex:search,$options:'i'}}
          ]
        }
      }
    let items= await getMongoRepository(Product).find(query);
    let total=await getMongoRepository(Product).find(query1);
      let result={
        items:items,
        meta: {
          "totalItems": total.length,
          "itemCount": 10,
          "itemsPerPage": 10,
          "totalPages": total.length%10?((total.length-total.length%10)/10)+1:(total.length/10?total.length/10:1),
          "currentPage": 1
      },
      links: {
        "first": "/products?limit=10",
        "previous": "",
        "next": "/products?page=2&limit=10",
        "last": "/products?page=137&limit=10"
        }
      }
      return result
    }
    else{
    return this.productService.paginate({
      page,
      limit,
      route: '/products',
    });
    }
  }
  @Get('filtered')
  async filteredResults(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('category', new DefaultValuePipe(''),) category: string = "",
    @Query('search', new DefaultValuePipe(''), ) search: string = "",
    @Query( 'f-price-min', new DefaultValuePipe(0), ParseIntPipe) fPriceMin: number = 0,
    @Query( 'f-price-max', new DefaultValuePipe(1000000), ParseIntPipe) fPriceMax: number = 100000,
    @Query( 'f-type', new DefaultValuePipe(''), ) fType: string = "",
    @Query( 'f-attr', new DefaultValuePipe(''), ) fAttr: string = "",
    @Query('orderPrice', new DefaultValuePipe(1), ) order: any = 1,
    @Query('zohoBooksProduct',new DefaultValuePipe(false),) zohoBooksProduct: true,
    // "readyProduct": "true",
    //         "madeToOrder": "true",
    //         "whiteLabeling": "true",
    @Query('readyProduct') readyProduct: boolean,
    @Query('madeToOrder') madeToOrder: boolean, 
    @Query('whiteLabeling') whiteLabeling: boolean,
  ) {
    console.log('category', category)
    console.log('search', search)
    console.log('order', order)
    console.log('fPriceMin', fPriceMin)
    console.log('fPriceMax', fPriceMax)
    console.log('fType', fType)
    console.log('fAttr', fAttr)
    console.log('readyProduct', Boolean(readyProduct))
    console.log('madeToOrder', madeToOrder)
    console.log('whiteLabeling', whiteLabeling)
    console.log('zohoBooksProduct', zohoBooksProduct)
    limit = limit > 100 ? 100 : limit;
    const attrFilter = []
    if (readyProduct) {
      attrFilter.push({
        "readyProduct": Boolean(readyProduct)
      })
    }
    if (madeToOrder) {
      attrFilter.push({
        "madeToOrder": Boolean(madeToOrder)
      })
    }
    if (whiteLabeling) {
      attrFilter.push({
        "whiteLabeling": Boolean(whiteLabeling)
      })
    }
    if(category) {
      attrFilter.push({
        "categoryId": category
      })
    }
       
      attrFilter.push({ zohoBooksProduct: { $eq: false } })
      attrFilter.push({ isVisible:{ $eq: true } }) 
// console.log('attrFilter', ...attrFilter)
    const query = {
        where: { 
          $or: [
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            {seo:{$regex:search,$options:'i'}}
             
            
          ],
          $and: [
            { price: { $gte: fPriceMin } },
            { price: { $lte: fPriceMax } },
            // { zohoBooksProduct: { $eq: false } },
            // { isVisible:{ $eq: true } }, 
            // { isVisible:true },
            // { attributes: { $regex: fAttr, $options: 'i' } },
            ...attrFilter
            
          ],
  
        },
        order: {
          price: order, 
        },
        skip: (page - 1) * limit,
        take: limit,
      }
      // console.log('query', query, query.where.$or)
    // return getMongoRepository(Product).find(query);
    return getMongoRepository(Product).findAndCount(query);

    
  }
    // @Query('category', new DefaultValuePipe(''), ParseStringPipe) category: string = "",
  
  // findAll(): Promise<Product[]> {
  //   return this.productService.findAll();
  // }


  // @Get('category/:categoryId')
  // // findbyCategory(@Param('categoryId') categoryId: string) {
  //   findbyCategory(
  //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  //     @Param('categoryId') categoryId: string
  // ): Promise<Pagination<Product>> {
  //   return this.productService.findByCategory12(categoryId);
  //   limit = limit > 100 ? 100 : limit;
  //   return this.productService.findByCategory({
  //     page,
  //     limit,
  //     route: `/products/category/${categoryId}`,
  //   },categoryId);
  // }

  @Get('category/:categoryId')
  // findbyCategory(@Param('categoryId') categoryId: string) {
    findbyCategory(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
      @Param('categoryId') categoryId: string
  ): Promise<Pagination<Product>> {
    // return this.productService.findByCategory(categoryId);
    limit = limit > 100 ? 100 : limit;
    return this.productService.findByCategory({
      page,
      limit,
      route: `/products/category/${categoryId}`,
    },categoryId);
  }

  @Get('searchProduct')
  async searchProductBydata(
    @Query('search', new DefaultValuePipe(''), ) search: string = "",
  ){
    const query = {
      where: { 
        $or: [
          { productName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          {seo:{$regex:search,$options:'i'}},
          {sku:{$regex:search,$options:'i'}},
          {zohoBooksProductId:{$regex:search,$options:'i'}}
        ]
      }
    }
    // console.log('query', query, query.where.$or)
  // return getMongoRepository(Product).find(query);
  return await getMongoRepository(Product).findAndCount(query);

  }
 
  @Get('search/:productName')
  // searchProducts(@Param('productName') productName: string) {
  //   return this.productService.searchProducts(productName);
  // }
  searchProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Param('productName') productName: string
): Promise<Pagination<Product>> {
  // return this.productService.findByCategory(categoryId);
  limit = limit > 100 ? 100 : limit;
  return this.productService.searchProducts({
    page,
    limit,
    route: `/products/search/${productName}`,
  },productName);
}

  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() product: Product) {
    if(!product.productName){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide product name"
      }, HttpStatus.BAD_REQUEST);
    }
    if(product.variants.length<1){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide default variant "
      }, HttpStatus.BAD_REQUEST);
    }
    if(product.productImages.length<1){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST',
        message: "Please Provide one image "
      }, HttpStatus.BAD_REQUEST);
    }
    
    return this.productService.save(product);
  }
  @Get('update-prices')
  async updatePrices() {
    return await getMongoRepository(Product).find().then(products => {
      products.forEach(product => {
        console.log('product-old', product)
        product.price = Number(product.price)
        product.whiteLabeling = Boolean(product.whiteLabeling)
        product.madeToOrder = Boolean(product.madeToOrder)
        product.readyProduct = Boolean(product.readyProduct)
        product.ecoFriendly = Boolean(product.ecoFriendly)
        product.greenProduct = Boolean(product.greenProduct)
        product.prodoExclusive = Boolean(product.prodoExclusive)
        console.log('product', product)
        getMongoRepository(Product).save(product)
      })
      return products
    }
    )
  }
    
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: any) {
    // console.log('id', id)
    return this.productService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() product: Product) {
    return this.productService.update(id, product);
  }

  @Post('bulk-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  bulkUpload(@UploadedFile() file) {
    return this.productService.bulkUpload(file);
  }
 
  @Get('product-by-categories')
  async getProductByCategories() {
    const categories = await getMongoRepository(Category).find()
    const products = await getMongoRepository(Product).find()
    categories.forEach(category => {
      const productsByCategory = products.filter(product => product.categoryId === category.id)
      category.products = productsByCategory
    })
    return categories
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('sales/combinedData/:sku')
  async combinedData(@Param('sku') sku: string) {
    let combinedData={
      purchaseOrders:[],
      poCount:0,
      salesOrders:[],
      soCount:0
    }
    let poData = await this.zohoPurchaseOrderRepository.findAndCount(({ 
       "line_items.sku": sku
      })
      )
    combinedData.purchaseOrders=poData[0]
    combinedData.poCount=poData[1]
    let soData = await this.zohoSalesOrderRepository.findAndCount(({  
      "line_items.sku": sku 
     })
     )
   combinedData.salesOrders=soData[0]
   combinedData.soCount=soData[1]
  //  return {statusCode:200,message:"Combined Sales data for this sku",data:combinedData,soCount:combinedData.soCount,poCount:combinedData.poCount} 
  let product={
    sku:sku
  }
   let p1=await this.productService.getProductBySku(sku)
   if(!p1){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'NOT_FOUND',
      message: "Product not found",
    }, HttpStatus.NOT_FOUND);
   }
   else{
    product.prodoId=p1.id
    product.buyingPrices=[]
    product.sellingPrices=[]
    for(let s of soData[0]){
      // console.log(s.line_items)
      let sell=s.line_items.find(s => s.sku==sku) 
      if(sell){
      product.sellingPrices.push({
        sellPrice:sell.rate,
        name:sell.name,
        quantity:sell.quantity,
        hsn_or_sac:sell.hsn_or_sac,
        shipment_status:sell.shipment_status,
        prodo_images:sell.prodo_images,
        customerName:s.customerName,
        customerId:s.customerId,
        salesOrderNumber:s.salesorderNumber,
        salesOrderId:s.salesorderId,
        salespersonName:s.salespersonName,
        zohoItemId:sell.item_id
          })
       }
    }
    for(let p of poData[0]){
      // console.log(s.line_items)
      let purchase=p.line_items.find(p => p.sku==sku)
      if(purchase){
      product.buyingPrices.push({
        buyPrice:purchase.rate,
        name:purchase.name,
        quantity:purchase.quantity,
        hsn_or_sac:purchase.hsn_or_sac,
        vendorName:p.vendor_name,
        vendorId:p.vendor_id,
        purchaseOrderNumber:p.purchaseorder_number,
        purchaseOrderId:p.purchaseorder_id,
        zohoItemId:purchase.item_id,
        submitted_by:p.submitted_by,
      
          })
       }
    }

   }
    return {statusCode:200,message:"Combined Sales data for this sku",soCount:combinedData.soCount,poCount:combinedData.poCount,data:product} 
  }
  
} 
