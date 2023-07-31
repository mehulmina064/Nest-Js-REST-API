import { Category } from './../categories/category.entity';
import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, EntityRepository, MongoRepository, ObjectID, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CategoryService } from '../categories/category.service';
import { ProductList } from './product-interface';
import { getMongoRepository, getRepository } from 'typeorm';
import { ProductRating } from './productRating.entity';
import { UserReview } from './userReview.entity';
import {HttpException,HttpStatus } from '@nestjs/common';


import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ProductVariant } from './product-variant.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');
import fetch from 'node-fetch'
import { type } from 'os';

@Injectable()
export class ProductService {
  [x: string]: any;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    @InjectRepository(ProductRating)
    private readonly productRatingRepository: Repository<ProductRating>,
    @InjectRepository(UserReview)
    private readonly userReviewRepository: Repository<UserReview>,
  ) {
  }

  async findByCategory12(id:any){
    return await this.productRepository.find({where:{categoryId:id}});
  }
  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    let k=getMongoRepository(Product);
    //filter repository datq with query filter
    // let products = await k.find({ categoryId: '62273e5b2dc01a1be68f004d' });
    // let k = await this.productRepository.createQueryBuilder('p');
    // k.where({isVisible:true});
    // let k= await this.productRepository.find({where:{  $and: [ {isVisible:true}] }})
    // let [k,total]= await this.productRepository.findAndCount({where:{ $and:[{isVisible:true}]}})
    console.log('k',k)
    const paginatedProduct = await (paginate<Product>(this.productRepository, options));
    // const categories = await this.categoryService.findAll();
    // tslint:disable-next-line:prefer-for-of
    const  product = paginatedProduct.items;
    product.forEach((item)=>{
      delete item.description
      delete item.price
    })
    return  paginatedProduct;
  }
 async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
 }
  async findAll( paginatedProduct): Promise<Product[]> {
    let products  = await this.productRepository.find();
    // console.log('p-1',products)
    const categories = await this.categoryService.findAll();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < paginatedProduct.items; i++) {
      let product = paginatedProduct.items[i] ;
      delete paginatedProduct.items[i].price
      // console.log('p',product)
      delete paginatedProduct.items[i].description
    
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < categories.length; j++) {
        if (product.categoryId === categories[j].id.toString()) {
          // @ts-ignore
          products[i].categoryName = categories[j].categoryName;
        }
      }
    }
    return   paginatedProduct;
    
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOne(id);
  }

  async save(product: Product) {
    return await this.productRepository.save(product);
  }
  
  async update(id, product: Partial<Product>) {
    await this.productRepository.update(id, product);
    return await this.findOne(id);
  }

  async remove(id: ObjectID) {
    const product = await this.productRepository.findOne(id);
    await this.productRepository.delete(id);
    return product;
    /*this.findAll().then((result) => {
      result.forEach(_ => this.productRepository.delete(_));
    });*/
    /*const user = this.productRepository.findOne(id).then(result => {
      this.productRepository.delete(result);
    });*/
  }
  async getProductBySku(sku: string){
    // console.log('p -sku',sku)
    //make sku string
    sku = sku.toString();
    // let find = await this.productRepository.find({where:{ zohoBooksProductId: sku }})
    // if(find.length>1){
    //   console.log("product more than one sku-",sku,"length",find.length)
    //  for(let i = 1; i < find.length; i++) {
    //        await this.productRepository.delete(find[i].id)
    //  }
    // }
    const product = await this.productRepository.findOne({where:{ zohoBooksProductId: sku }});
    // console.log('product',product) 
    if(product){
      return product
    }
    return false;
  }

  async findByCategory(options: IPaginationOptions,categoryId: string): Promise<Pagination<Product>> {
  //  const products =  this.productRepository.find({ categoryId });
  const paginatedProduct = await (paginate<Product>(this.productRepository, options, {where:{categoryId}}));
  const categories = await this.categoryService.findAll();
  // tslint:disable-next-line:prefer-for-of
  const  product = paginatedProduct.items;
  product.forEach((item)=>{ 
    delete item.description
    delete item.price
  })
  return  paginatedProduct;
     

    // return await this.productRepository.find({ categoryId });
  }

  async searchProducts(options: IPaginationOptions,productName: string): Promise<Pagination<Product>> {
    productName = decodeURIComponent(productName);
    // @ts-ignore
    return await (paginate<Product>(this.productRepository, options, {where:{ productName: new RegExp(productName, 'i') }}));
    // return await this.productRepository.find({ productName: new RegExp(productName, 'i') });
  }
  async findCategoryId(categoryName:string): Promise<string> {
    const categoryId = await this.categoryService.findCategoryId(categoryName); 
    return categoryId
  }

  async bulkUpload(file) {
    // Bulk Upload Products and Create Their Variants and Upload Images from Google Drive
//     Category 	Product	Website tags 	Industry tags 	SEO Tags/ Product Tag 	TR1	Payment Terms 	Description	Lead Time 	MOQ 	Default Price	Additional Size Variations	Variant 1 (default)	price 1	variant 2	price 2	Variant 3	price 3	Variant 4 	price 4	variant 5 	price 5	Image Alt Text - 1	Image Alt Text - 2	Image Alt Text - 3	Image Alt Text - 4	Image Alt Text - 5	Ready Product	Made-to-Order Product	White-labeling	Prodo Exclusive	Eco-friendly	Image link - Variant 1	Image Link Variant 2	Image Link Variant 3	Image Link Variant 4		Suggestions - Sant 
// Wellness Disposables	"3 ply surgical mask- with meltblown filter

// Pack of 2500"	Wellness Disposables, Ready Product, Made-to-Order Product, White-labeling 	Healthcare, Wellness, Manufacturing, F&B, Real Estate 	3 Ply Mask, Surgical Mask, Prodo Mask, Best quality mask, Mask with meltblown filter, Disposable mask, Buy facemask in bulk, Prodo, #ProcurementDone 	3 Ply Mask, Surgical Mask, Prodo Mask, Best quality mask, Mask with meltblown filter, Disposable mask, Buy facemask in bulk, Prodo, #ProcurementDone , Wellness Disposables, Ready Product, Made-to-Order Product, White-labeling 	Prepaid	"• 3 Ply Face Mask: Prodo’s SITRA lab-certified facemasks are made of high-quality non-woven fabric. These masks provide more than 95% microorganisms filtration when worn appropriately. The outer layer of the flat with non-woven fabric, followed by a melt-blown polypropylene filtration layer and a soft absorbent non-woven inner filter layer. Protection level: FFP2≥ 95% 
// • Embedded Nose Clip: Made with embedded & adjustable wire nose Clip, to make your mask more fitted to your face. This clip is also helpful if you wear glasses as it helps prevent some of the fogging of your lenses you get when wearing masks without this option. 
// • 3-Ply Protection Masks: Outer layer is a water-resistant layer, blocks the splashing liquid; the middle layer (melt-blown fabric) is a filtering layer, blocks particles up to 0.3 Microns. The inner layer is a water-absorbing layer, which can absorb the moisture from the breath of the wearer, avoid the filtering layer from getting wet. 
// • Sturdy Elastic Ear Loop/non-woven ties: Choose your variant as per your requirement. Single-Use Only (Disposable) 

// • Recommended: for General Use. 

// • Disposal: Dispose of preferably in Biohazard Waste bins Eco-Friendly.

// • Mask: These masks are 100% biodegradable and eco-friendly. (Nonwovens are usually not biodegradable; Suggest we stay muted here) 

// • All Prodo products are made in India."	3	1000	1.8		Earloop 	1.8	Ties 	3							3 ply surgical mask- with Meltblown filter earloop.jpg	3-ply surgical mask – without meltblown fabric tied-100.jpg				TRUE	FALSE	TRUE	FALSE	TRUE	https://drive.google.com/drive/u/3/folders/1zz6DLoGJgKN3celH3mkj1j4UAGpLWkOB	https://drive.google.com/drive/u/3/folders/1QwGu9P2jRqD_129zK-dFZy2IklVtniNm				Suggest: We segment out Coveralls for user industries as "Recommended Use". e.g. Non Laminated: For Airlines Passengers; wheras for Crew (as they have longer exposure levels); we should recommend Laminated with Tape; For Hospital Staff in Emergency Care Gowns of SSMMS Type are suitable where as for general wards Gowns of SMMS or even SMS type would do. It is not always weight or GSM so to say that will increase protection level. SSMMS (5 layered) are only 50-55 GSM just for example.
    
    // tslint:disable-next-line:prefer-for-of
    const products = [];
        const worksheet = XLSX.readFile(file.path);
    const sheet_name_list = worksheet.SheetNames;
    const data = XLSX.utils.sheet_to_json(worksheet.Sheets[sheet_name_list[1]]);
    // console.log(data);



    data.forEach(async (item) => {
      let product = new Product();
      let variants = [];
      let variant1 = { name: '', price: 0, images:[] };
      let variant2 = { name: '', price: 0, images:[] };
      let variant3 = { name: '', price: 0, images:[] };
      let variant4 = { name: '', price: 0, images:[] };
      let variant5 = { name: '', price: 0, images:[] };
      
      // console.log('item', item);
      product.productName = item['Product'];
      product.categoryId = '623af51151d7f22358800ace';
      product.description = item['Description'];
      product.price = item['Default Price'];
      product.leadTime = item['Lead Time'];
      product.moq = item['MOQ'];
      product.paymentTerms = item['Payment Terms'];
      product.seo = item['TR1'];
      product.hsnCode = item['HSN Code'];
      product.whiteLabeling = item['White-labeling']
      product.prodoExclusive = item['Prodo Exclusive']
      product.ecoFriendly = item['Eco-friendly']
      product.madeToOrder = item['Made-to-Order Product']
      product.readyProduct = item['Ready Product']
      product.productImages.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`)
      if( item['Variant 1 (default)'] ){
      variant1.price = item['price 1'];
      variant1.name = item['Variant 1 (default)'];
      variant1.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
      }
      if( item['Variant 2'] ){
      variant2.price = item['price 2'];
      variant2.name = item['Variant 2'];
      variant2.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
      }
      if( item['Variant 3'] ){
      variant3.price = item['price 3'];
      variant3.name = item['Variant 3'];
      variant3.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
      }
      if( item['Variant 4'] ){
      variant4.price = item['price 4'];
      variant4.name = item['Variant 4'];
      variant4.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
      }
      if( item['Variant 5'] ){
      variant5.price = item['price 5'];
      variant5.name = item['Variant 5'];
      variant5.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
      }
      if( variant1.name ){
        variants.push(variant1);
      }
      if( variant2.name ){
        variants.push(variant2);
      }
      if( variant3.name ){
        variants.push(variant3);
      }
      if( variant4.name ){
        variants.push(variant4);
      }
      if( variant5.name ){
        variants.push(variant5);
      }
      product.variants = variants;
      // console.log('product', product);
      products.push(product);
    
    })  
    return await this.productRepository.save(products);
  }
  async clear(){
   const products = await this.productRepository.find({ categoryId: '62273e5b2dc01a1be68f004d' });
    return this.productRepository.remove(products);
  }
  async SaveZohoProduct(item,type){
    item = await this.removeNull(item)
    if(item.images==0){
      item.images = []
    }
    else{
      item.images = item.images.split(',')
    }
    // console.log('item.prodoExclusive',item.ProdoExclusive)
    if(item.ProdoExclusive){
      item.ProdoExclusive = true
    }
    else{
      item.ProdoExclusive = false
    }
    if(type === 'L0'){
    let path= item.parent.fullpath;
    let pathArray=path.split('/')
    let category = pathArray[2]
    // console.log('l0',category)
    let categoryId = await this.categoryService.findByCategoryName(category);
    // console.log('categoryId',categoryId,item.id,category)
    let variant= {
       "name": "Standard",
       "price": item.SellingPrice?Number(item.SellingPrice):0,
       "images":item.images,
       "zohoId": item.id
    }
    let product = {
      "prodoExclusive": item.ProdoExclusive?true:false,
      "greenProduct": item.GreenProduct?true:false,
     "productImages": item.images,
     "price": item.SellingPrice?Number(item.SellingPrice):0,
     "description": await this.getDescription(item.Description),
     "readyProduct": item.ReadyStock?true:false,
     "madeToOrder": item.MadeToOrder?true:false,
     "whiteLabeling": item.WhiteLabeled?true:false,
     "ecoFriendly": item.EcoFriendly?true:false,
     "variants": [variant],
     "similarProductIds": [],
     "zohoBooksProduct": true,
     "categoryId": categoryId,
     "productName": item.Name,
     "zohoBooksProductId":item.id,
     "hsnCode": item.HSN_Code,
     "sku": item.SKU,
     "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
     "leadTime": item.LeadTime,
     "moq": item.MOQ,
     "isVisible": true
 }
 return this.pim_product_save_update(product);
//  return product

  }
  else if(type === 'L1'){
    let path= item.parent.parent.fullpath;
    let pathArray=path.split('/')
    let category = pathArray[2]
    // console.log('l0',category)
    let categoryId = await this.categoryService.findByCategoryName(category);
    // console.log('categoryId',categoryId)
    // console.log('categoryId',categoryId,item.sku,item.category)
    // console.log('categoryId',categoryId,item.id,category)


    let variant= {
       "name": "Standard",
       "price": item.SellingPrice?Number(item.SellingPrice):0,
       "images": item.images,
       "zohoId": item.id,
       "p_typeId": item.parent.id,
       "p_typeName": item.parent.Name
    }
    let product = {
      "prodoExclusive": item.ProdoExclusive?true:false,
     "greenProduct": item.GreenProduct?true:false,
     "productImages": item.images,
     "price": item.SellingPrice?Number(item.SellingPrice):0,
     "description": await this.getDescription(item.Description),
     "readyProduct": item.ReadyStock?true:false,
     "madeToOrder": item.MadeToOrder?true:false,
     "whiteLabeling": item.WhiteLabeled?true:false,
     "ecoFriendly": item.EcoFriendly?true:false,
     "variants": [variant],
     "similarProductIds": [],
     "zohoBooksProduct": true,
     "categoryId": categoryId,
     "productName": item.Name,
     "zohoBooksProductId":item.id,
     "hsnCode": item.HSN_Code,
     "sku": item.SKU,
     "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
     "leadTime": item.LeadTime,
     "moq": item.MOQ,
     "isVisible": false
 }
 return this.pim_product_save_update(product);
//  return product
  }
  else if(type === 'L2'){
    let path= item.parent.parent.parent.fullpath;
    let pathArray=path.split('/')
    let category = pathArray[2]
    // console.log('l0',category)
    let categoryId = await this.categoryService.findByCategoryName(category);
    // console.log('categoryId',categoryId)
    // console.log('categoryId',categoryId,item.sku,item.category)
    // console.log('categoryId',categoryId,item.id,category)


    let variant= {
       "name": "Standard",
       "price": item.SellingPrice?Number(item.SellingPrice):0,
       "images": item.images,
       "zohoId": item.id,
       "brand": item.parent.Name,
       "brandId": item.parent.id,
       "p_typeId": item.parent.parent.id,
       "p_typeName": item.parent.parent.Name
    }
    let product = {
      "prodoExclusive": item.ProdoExclusive?true:false,
     "greenProduct": item.GreenProduct?true:false,
     "productImages": item.images,
     "price": item.SellingPrice?Number(item.SellingPrice):0,
     "description": await this.getDescription(item.Description),
     "readyProduct": item.ReadyStock?true:false,
     "madeToOrder": item.MadeToOrder?true:false,
     "whiteLabeling": item.WhiteLabeled?true:false,
     "ecoFriendly": item.EcoFriendly?true:false,
     "variants": [variant],
     "similarProductIds": [],
     "zohoBooksProduct": true,
     "categoryId": categoryId,
     "productName": item.Name,
     "zohoBooksProductId":item.id,
     "hsnCode": item.HSN_Code,
     "sku": item.SKU,
     "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
     "leadTime": item.LeadTime,
     "moq": item.MOQ,
     "isVisible": false
 }
 return this.pim_product_save_update(product);

//  return product
  }
  else if(type =='L0-C'){
    let path= item.parent.fullpath;
    let pathArray=path.split('/')
    let category = pathArray[2]
    // console.log('l0',category)
    let categoryId = await this.categoryService.findByCategoryName(category);
    // console.log('categoryId',categoryId) 
    // console.log('categoryId',categoryId,item.sku,item.category)
    // console.log('categoryId',categoryId,item.id,category)

    let variant= {
      "name": "Standard",
       "price": item.SellingPrice?Number(item.SellingPrice):0,
       "images": item.images,
       "zohoId": item.id
    }
    let product = {
     "prodoExclusive": item.ProdoExclusive?true:false, 
     "greenProduct": item.GreenProduct?true:false,
     "productImages": item.images,
     "price": item.SellingPrice?Number(item.SellingPrice):0,
     "description": await this.getDescription(item.Description),
     "readyProduct": item.ReadyStock?true:false,
     "madeToOrder": item.MadeToOrder?true:false,
     "whiteLabeling": item.WhiteLabeled?true:false,
     "ecoFriendly": item.EcoFriendly?true:false,
     "variants": [variant],
     "similarProductIds": [],
     "zohoBooksProduct": true,
     "categoryId": categoryId,
     "productName": item.Name,
     "zohoBooksProductId":item.id,
     "hsnCode": item.HSN_Code,
     "sku": item.SKU,
     "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
     "leadTime": item.LeadTime,
     "moq": item.MOQ,
     "isVisible": true,
 }
 product= await this.addvariants(product,item)
 return this.pim_product_save_update(product);
//  return this.productRepository.save(product);
//  return product
  }

}

async pim_product_save_update(product){
  let sku = product.zohoBooksProductId;
  let product1 = await this.getProductBySku(sku);
  if(product1){
    // console.log('product-found',product1)
    product.id  = product1.id;
    product.price = Number(product1.price);
    product.zohoBooksProduct=product1.zohoBooksProduct
    // console.log('product-for-update',product)
    let k = await this.productRepository.save(product);
    return {'status':'success','message':'product updated','data':k};
  }
  else{
    // console.log('product for save',product)
    let m =await this.productRepository.save(product);
    return {'status':'success','message':'product saved','data':m};
  }

}
async removeNull(item){ 
  let product = {};
  for(let key in item){
    if(item[key] !== null){
      if(item[key]){
      product[key] = item[key];
      }
      else
      {
        product[key] = 0;
      }
    }
    else{
      product[key] = 0;
    }
  }
  return product;
}

async getDescription(description){
  //check if description is null
  if(description === 0){
    return ''
  }
  let description_json=JSON.stringify(description)
  let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
  description_json_without_html=description_json_without_html.replace(/\\n/g, '')
  return description_json_without_html
}


async addvariants(product,item){
  let child5=item.children//l5
  for(let n=0;n<child5.length;n++)
  {               
    if(Object.keys(child5[n]).includes("children"))
    {             
      if(child5[n].children.length>0){
        let child6=child5[n].children//l6
        for(let o=0;o<child6.length;o++)
        { 
          let y = child6[o]
          y=await this.removeNull(y)
          product = await this.addvariant(product,y)                                                              
        }
      }
      else{
        let x= child5[n]
          x=await this.removeNull(x)
          product = await this.addvariant(product,x)   
      }
    }
  }
  return product
}

async addvariant(product,item){
  item = await this.removeNull(item)
  if(item.images==0){
    item.images = []
  }
  else{
    item.images = item.images.split(',')
  }
  let variant= {
     "name": item.Name,
     //"price": item.SellingPrice, check if price is ""
     "price": item.SellingPrice?Number(item.SellingPrice):0,
     "images": item.images,
     "zohoId": item.id
  }
  product.variants.push(variant)
  return product
}


async getPimData(){
  const query = `{
    getObjectFolder(id:1189){
...on object_folder{
id
key
index
childrenSortBy
fullpath
modificationDateDate
children{
  ...on object_folder{
    id
    index
    creationDate
    fullpath
    key
    children{
      ... on object_folder{
        id
        index
        fullpath
        key
        children{
          ... on object_folder{
            id
            index
            fullpath
            key
            children{
              ... on object_folder{
                id
                index
                fullpath
                key
                children{
                  __typename
                  ... on object_GeneralClass{
                          Name
                          images
                        id
                        Description
                        SKU
                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Country
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                        Country
                        ClientSKUCode

                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                         ... on object_folder{
                                fullpath
                              }
                        }
                    children(objectTypes:["variant","object"]){
                      __typename
                      ... on object_GeneralClass{
                        Name
                        id
                        Description
                        SKU
                        images

                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                       
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                        
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                           Country
                    ClientSKUCode
                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                          ... on object_GeneralClass{
                            id
                            Name
                            parent{
                              ... on object_folder{
                                fullpath
                              }
                            }
                          }
                        }
                       
                      children(objectTypes:["variant","object"]){
                        __typename
                        ... on object_GeneralClass{
                          Name
                        id
                        Description
                        SKU
                        images

                        DisplayOn
                        Tags
                        HSN_Code
                        EcoFriendly
                        ReadyStock
                        GreenProduct
                        GoodsOrService
                        ProdoExclusive
                        TrackInventory
                        AdvancedInventoryTracking
                        LeadTime
                        MOQ
                        Unit
                        Fragile
                        Biodegradable
                        OneTimeUse
                        Tags
                       
                        AdvancedInventoryTracking
                        TrackInventory
                        InterStateGSTRate
                        IntraStateGSTRate
                          
                        DisplayOn
                        ProdoExclusive
                        EcoFriendly
                        WhiteLabeled
                        MadeToOrder
                        LeadTime
                        ISBN
                        EAN
                        MPN
                        TaxPreferance
                        HSNCode
                        Brand
                        ModelNo
                        Weight{
                          value
                        }
                        Height{
                          value
                        }
                        Breadth{
                          value
                        }
                         Length{
                          value
                        }
                       
                        SellingPrice
                        CostPrice
                           Country
                    ClientSKUCode
                        Manufacturers{
                          ... on object_GeneralClass{
                            id
                            Name
                          }
                        }
                        parent{
                          __typename
                          ... on object_GeneralClass{
                            id
                            Name
                            parent{
                              __typename
                              ... on object_GeneralClass{
                                Name
                                id
                                parent{
                               ... on object_folder{
                                fullpath
                              }
                                }
                              }
                  
                            }
                          }
                        }
                       
                        }
                        
                      }
                      }
                      
                      
                    }
                 
                }
                 
                }
               
              }
            }
          }
        }
       
      }
    }
  }
}
}
}
}`;
let kill
const ret = await fetch('https://pim.prodo.in/pimcore-graphql-webservices/products', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // 'Authorization': `Bearer '8f7bb0951b624784d0b08ba94a56218a'`,
  'X-API-Key' : "8f7bb0951b624784d0b08ba94a56218a"
},
body: JSON.stringify({query: query})
})
.then(r => r.json())
.then(data =>  kill=data);
// return kill
kill=kill.data.getObjectFolder.children 
return kill
}

async getPimProducts(kill){
 let res=[]
for(let i=0;i<kill.length;i++)
{
  if(Object.keys(kill[i]).includes("children"))
  {
    let child=kill[i].children//l1
    if(child.length>0)
    {
      for(let j=0;j<child.length;j++)
      {
            if(Object.keys(child[j]).includes("children"))
            {
              let child2=child[j].children//l2
              if(child2.length>0)
              {
                    for(let k=0;k<child2.length;k++)
                    {  
                        if(Object.keys(child2[k]).includes("children"))
                        {
                          let child3=child2[k].children//l3
                          if(child3.length>0)
                          {
                            for(let l=0;l<child3.length;l++)
                              {     
                                if(Object.keys(child3[l]).includes("children"))
                                {
                                    let child4=child3[l].children//l4
                                    if(child4.length>0)
                                    {
                                      for(let m=0;m<child4.length;m++)
                                        {
                                          if(Object.keys(child4[m]).includes("children"))
                                          { 
                                            // let out=[]
                                            // let data =  child4[m]
                                            if(child4[m].children.length>0){
                                              res.push({type:"L0-C",data:child4[m]})
                                              let child5=child4[m].children//l5
                                              for(let n=0;n<child5.length;n++)
                                              {               
                                                if(Object.keys(child5[n]).includes("children"))
                                                {             
                                                              if(child5[n].children.length>0){
                                                                res.push({type:"L1-C",data:child5[n]})
                                                                let child6=child5[n].children//l6
                                                                for(let o=0;o<child6.length;o++)
                                                                {
                                                                    res.push({type:"L2",data:child6[o]})                                                                
                                                                }
                                                              }
                                                              else{
                                                              res.push({type:"L1",data:child5[n]})
                                                              }
                                                             
                                                }
                                              }
                                            }
                                            else{
                                              res.push({type:"L0",data:child4[m]})
                                            }
                                           
                                        }  
                                      }
                                    }
                               }
                            }
                         }
                        }
                    }
              } 
      
    }
  }
}
}
}
return res
}


async pimAllProducts(){
  let kill = await this.getPimData()
  let products = await this.getPimProducts(kill)
  return products
}
async fixData(){
  let res=[]
  let products=await this.productRepository.find()
  for(let i=0;i<products.length;i++)
  {
    let product=products[i]
    let Product=await this.productRepository.findOne(product.id)
    if(Object.keys(product).includes("zohoBooksProduct"))
    {
      res.push({"hello":"zohoBooksProduct"})
    }
    else 
    {
      // console.log("inelse")
      product.zohoBooksProduct=false
      return await this.productRepository.save(product)
      res.push({"hello":"updated"})
    }
  }
  return res
}


async zohoPtype(zohoKeys:string[],pimcoreKeys:string[],item:any){
  let productMap={
    "custom_fields":[],
    "item_tax_preferences":[
      {
        "tax_specification": "inter",
        "tax_id": "",
    },
    {
        "tax_specification": "intra",
        "tax_id": "",
    }
    ],
    "package_details":{
      "length": "",
      "width": "",
      "height": "",
      "weight": "",
      "weight_unit": "g",
      "dimension_unit": "cm"
    }
  }

  // let papa=item.parent.Name
  // let path=item.parent.parent.fullpath
  let papa=item.parent.Name
  let path=item.parent.fullpath
  // let pathArray=["0","1","2","3"]
  let pathArray=path.split('/')
  let l0 = pathArray[2]
  let l1 = pathArray[3]
  let l2 = pathArray[4]
  let l3 = pathArray[5]
  let custom_Field={
    "api_name":Any,
    "value":Any
  }
  for(let i=0,j=0;i<zohoKeys.length;i++){
    //switch case on zohoKeys[i]
    switch(zohoKeys[i]){
      // case 'category_name':
      //   productMap[zohoKeys[i]]=l0
      //   break;
      case 'cf_category_l0':
 
        // custom_Field.api_name="cf_category_l0"
        // custom_Field.value=l0
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_category_l0","value":l0})
        break
      case 'cf_sub_category_l1':
        // custom_Field.api_name="cf_sub_category_l1"
        // custom_Field.value=l1
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l1","value":l1})
        break;
      case 'cf_sub_category_l2':
        // custom_Field.api_name="cf_sub_category_l2"
        // custom_Field.value=l2
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l2","value":l2})
        break;
      case 'cf_sub_sub_category_l3':
        // custom_Field.api_name="cf_sub_sub_category_l3"
        // custom_Field.value=l3
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_sub_category_l3","value":l3})
        break;
      case 'product_type':
        productMap[zohoKeys[i]]="goods"
        j++
        break;
      // case 'unit':
      //   productMap[zohoKeys[i]]="pcs"
      //   j++
      //   break;
      case 'package_details{dimension_unit}':
        break;
      case 'package_details{weight_unit}':
        break;
      case 'is_taxable'
       productMap[zohoKeys[i]]=true
       j++
       break;
      case 'package_details{length}':
        if(item.Length)
        {
          productMap.package_details.length=item.Length.value
        }
        j++
        break;
      case 'package_details{width}':
        if(item.Breadth)
        {
          productMap.package_details.width=item.Breadth.value
        }
        j++
        break;
      case 'package_details{height}':
        if(item.Height)
        {
          productMap.package_details.height=item.Height.value
        }
        j++
        break;
      case 'package_details{weight}':
          if(item.Weight)
          {
            productMap.package_details.weight=item.Weight.value
          }
          j++
          break;      
      case 'name':
        if(item.Name){                   
          // productMap[zohoKeys[i]]=`${papa} (${item[pimcoreKeys[j]]})`
          productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`

        }
        else
        {
            productMap[zohoKeys[i]]=''
        }
       j++
       break;
      // case 'sales_information':
      //   // custom_Field.api_name="cf_sales_information"
      //   // custom_Field.value=true
      //   // productMap.custom_fields.push(custom_Field)
      //   // productMap.custom_fields.push({"api_name":"cf_sales_information","value":true})
      //   productMap[zohoKeys[i]]=true
      //   j++
      //   break;
      case 'account_name':
        productMap[zohoKeys[i]]="Sales"
        j++
        break;
      case 'purchase_description':
        productMap[zohoKeys[i]]=true
        j++
        break;
      case 'purchase_account_name':
        productMap[zohoKeys[i]]="Cost of Goods Sold"
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]inter':
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%intra':
        productMap.item_tax_preferences[1].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%inter':
        productMap.item_tax_preferences[0].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_type}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_type}]inter':
        j++
        break;
      case 'inventory_account_name':
        productMap[zohoKeys[i]]="Finished Goods"
        j++
        break;
      // case 'cf_activitystatus':
      //   console.log("conunt")
      //   // custom_Field.api_name="cf_activitystatus"
      //   // custom_Field.value="Active"
      //   // productMap.custom_fields.push(custom_Field)
      //   productMap.custom_fields.push({"api_name":"cf_activitystatus","value":"Active"})
      //   break;
      case 'track_batch_number':
        productMap[zohoKeys[i]]=true
        break;
      case 'item_type':
        productMap[zohoKeys[i]]="inventory"
        break;
      case 'is_linked_with_zohocrm':
        productMap[zohoKeys[i]]=true
        break;

      case 'sales_rate':
        
        // console.log('value',item)
          if(item.Selling_Price){                   
              productMap[zohoKeys[i]]=item.SellingPrice.value
          }
          else
          {
                productMap[zohoKeys[i]]=''
          }
        j++
        break;
      case 'purchase_rate':
        if(item.Cost_Price){
          productMap[zohoKeys[i]]=item.Cost_Price.value
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      case 'manufacturer':
        if(item.Manufacturer)
        {
          productMap[zohoKeys[i]]=item.Manufacturers.Name
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      // case 'brand':
      //   if(item.Brand)
      //   {
      //     productMap[zohoKeys[i]]=item.Brands.value
      //   }
      //   else
      //   {
      //     productMap[zohoKeys[i]]=''
      //   }
      //   j++
      //   break;
      case 'sku':
          // console.log(pimcoreKeys[j])
          // console.log("hello id",item.id)
          productMap[zohoKeys[i]]=item.id
        j++
        break;
      case 'cf_pimcore_id':
        // custom_Field.api_name=zohoKeys[i]
        // custom_Field.value=item.id
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":item.id})
        j++
        break;
      // case 'cf_returnable_item':
      //   productMap[zohoKeys[i]]=item.Returnable
      //   j++
      //   break;
      case 'cf_ready_to_product':
        let value=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value="TRUE"
            }
            else{
              value="FALSE"
            }
          }
        }
        else {
          value=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'cf_made_to_order':
        let value1=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value1=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value1="TRUE"
            }
            else{
              value1="FALSE"
            }
          }
        }
        else {
          value1=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value1})
        j++
        break;
      case 'cf_white_labeled':
        let value3=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value3=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value3="TRUE"
            }
            else{
              value3="FALSE"
            }
          }
        }
        else {
          value3=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value3})
        j++
        break;
      case 'cf_biodegradable':
        let value4=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value4=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value4="Yes"
            }
            else{
              value4="No"
            }
          }
        }
        else {
          value4=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value4})
        j++
        break;
      case 'cf_onetimeuse':
        let value5=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value5=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value5="Yes"
            }
            else{
              value5="No"
            }
          }
        }
        else {
          value5=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value5})
        j++
        break;


        case 'description':
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
            productMap[zohoKeys[i]]=""
            }
            else {
              let description=item[pimcoreKeys[j]]
              let description_json=JSON.stringify(description)
              let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
              description_json_without_html=description_json_without_html.replace(/\\n/g, '')
              productMap[zohoKeys[i]]=description_json_without_html
            }
          }
          else {
            productMap[zohoKeys[i]]=""
          }
          j++
          break;
          case 'cf_display_on':
            let k=""
           productMap.custom_fields.push({"api_name":zohoKeys[i],"value":k})
           j++
           break;
      default:
        // console.log(pimcoreKeys[j],zohoKeys[i])
        //check zohokeys[i] iss start with cf_
        // console.log("hello default",zohoKeys[i])
        if(zohoKeys[i].startsWith("cf_")){
          let value=Any
          // console.log("hello in cf case ",zohoKeys[i])
          // custom_Field.api_name=zohoKeys[i]
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value=""
            }
            else {
              value=item[pimcoreKeys[j]]
            }
          }
          else {
            value=""
          }
          // custom_Field.value=item[pimcoreKeys[j]]
          // console.log("hello in cf case ",custom_Field)
          // productMap.custom_fields.push(custom_Field)
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
          j++
        }
        else{
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
           productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      }
    }
  }
  // console.log('productMap',productMap)
  return productMap

}
async zohoBrandtype(zohoKeys:string[],pimcoreKeys:string[],item:any){
  let productMap={
    "custom_fields":[],
    "item_tax_preferences":[
      {
        "tax_specification": "inter",
        "tax_id": "",
    },
    {
        "tax_specification": "intra",
        "tax_id": "",
    }
    ],
    "package_details":{
      "length": "",
      "width": "",
      "height": "",
      "weight": "",
      "weight_unit": "g",
      "dimension_unit": "cm"
    }
  }

  let papa=item.parent.Name
  let path=item.parent.parent.fullpath
  // let papa=item.parent.Name
  // let path=item.parent.fullpath
  // let pathArray=["0","1","2","3"]
  let pathArray=path.split('/')
  let l0 = pathArray[2]
  let l1 = pathArray[3]
  let l2 = pathArray[4]
  let l3 = pathArray[5]
  let custom_Field={
    "api_name":Any,
    "value":Any
  }
  for(let i=0,j=0;i<zohoKeys.length;i++){
    //switch case on zohoKeys[i]
    switch(zohoKeys[i]){
      // case 'category_name':
      //   productMap[zohoKeys[i]]=l0
      //   break;
      case 'cf_category_l0':
 
        // custom_Field.api_name="cf_category_l0"
        // custom_Field.value=l0
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_category_l0","value":l0})
        break
      case 'cf_sub_category_l1':
        // custom_Field.api_name="cf_sub_category_l1"
        // custom_Field.value=l1
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l1","value":l1})
        break;
      case 'cf_sub_category_l2':
        // custom_Field.api_name="cf_sub_category_l2"
        // custom_Field.value=l2
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l2","value":l2})
        break;
      case 'cf_sub_sub_category_l3':
        // custom_Field.api_name="cf_sub_sub_category_l3"
        // custom_Field.value=l3
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_sub_category_l3","value":l3})
        break;
      case 'product_type':
        productMap[zohoKeys[i]]="goods"
        j++
        break;
      // case 'unit':
      //   productMap[zohoKeys[i]]="pcs"
      //   j++
      //   break;
      case 'package_details{dimension_unit}':
        break;
      case 'package_details{weight_unit}':
        break;
      case 'is_taxable'
       productMap[zohoKeys[i]]=true
       j++
       break;
      case 'package_details{length}':
        if(item.Length)
        {
          productMap.package_details.length=item.Length.value
        }
        j++
        break;
      case 'package_details{width}':
        if(item.Breadth)
        {
          productMap.package_details.width=item.Breadth.value
        }
        j++
        break;
      case 'package_details{height}':
        if(item.Height)
        {
          productMap.package_details.height=item.Height.value
        }
        j++
        break;
      case 'package_details{weight}':
          if(item.Weight)
          {
            productMap.package_details.weight=item.Weight.value
          }
          j++
          break;      
      case 'name':
        if(item.Name){                   
          productMap[zohoKeys[i]]=`${papa} (${item[pimcoreKeys[j]]})`
          // productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`

        }
        else
        {
            productMap[zohoKeys[i]]=''
        }
       j++
       break;
      // case 'sales_information':
      //   // custom_Field.api_name="cf_sales_information"
      //   // custom_Field.value=true
      //   // productMap.custom_fields.push(custom_Field)
      //   // productMap.custom_fields.push({"api_name":"cf_sales_information","value":true})
      //   productMap[zohoKeys[i]]=true
      //   j++
      //   break;
      case 'account_name':
        productMap[zohoKeys[i]]="Sales"
        j++
        break;
      case 'purchase_description':
        productMap[zohoKeys[i]]=true
        j++
        break;
      case 'purchase_account_name':
        productMap[zohoKeys[i]]="Cost of Goods Sold"
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]inter':
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%intra':
        productMap.item_tax_preferences[1].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%inter':
        productMap.item_tax_preferences[0].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_type}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_type}]inter':
        j++
        break;
      case 'inventory_account_name':
        productMap[zohoKeys[i]]="Finished Goods"
        j++
        break;
      // case 'cf_activitystatus':
      //   console.log("conunt")
      //   // custom_Field.api_name="cf_activitystatus"
      //   // custom_Field.value="Active"
      //   // productMap.custom_fields.push(custom_Field)
      //   productMap.custom_fields.push({"api_name":"cf_activitystatus","value":"Active"})
      //   break;
      case 'track_batch_number':
        productMap[zohoKeys[i]]=true
        break;
      case 'item_type':
        productMap[zohoKeys[i]]="inventory"
        break;
      case 'is_linked_with_zohocrm':
        productMap[zohoKeys[i]]=true
        break;

      case 'sales_rate':
        
        // console.log('value',item)
          if(item.Selling_Price){                   
              productMap[zohoKeys[i]]=item.SellingPrice.value
          }
          else
          {
                productMap[zohoKeys[i]]=''
          }
        j++
        break;
      case 'purchase_rate':
        if(item.Cost_Price){
          productMap[zohoKeys[i]]=item.Cost_Price.value
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      case 'manufacturer':
        if(item.Manufacturer)
        {
          productMap[zohoKeys[i]]=item.Manufacturers.Name
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      // case 'brand':
      //   if(item.Brand)
      //   {
      //     productMap[zohoKeys[i]]=item.Brands.value
      //   }
      //   else
      //   {
      //     productMap[zohoKeys[i]]=''
      //   }
      //   j++
      //   break;
      case 'sku':
          // console.log(pimcoreKeys[j])
          // console.log("hello id",item.id)
          productMap[zohoKeys[i]]=item.id
        j++
        break;
      case 'cf_pimcore_id':
        // custom_Field.api_name=zohoKeys[i]
        // custom_Field.value=item.id
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":item.id})
        j++
        break;
      // case 'cf_returnable_item':
      //   productMap[zohoKeys[i]]=item.Returnable
      //   j++
      //   break;
      case 'cf_ready_to_product':
        let value=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value="TRUE"
            }
            else{
              value="FALSE"
            }
          }
        }
        else {
          value=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'description':
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
            //convert item.Description to string
            let description=item[pimcoreKeys[j]]
            let description_json=JSON.stringify(description)
            let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
            description_json_without_html=description_json_without_html.replace(/\\n/g, '')
            productMap[zohoKeys[i]]=description_json_without_html
            // productMap[zohoKeys[i]]=JSON.stringify(item[pimcoreKeys[j]])

            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]].toString()
          //  productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      case 'cf_display_on':
          let k=""
         productMap.custom_fields.push({"api_name":zohoKeys[i],"value":k})
         j++
         break;
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'cf_ready_to_product':
        let v=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            v=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              v="TRUE"
            }
            else{
              v="FALSE"
            }
          }
        }
        else {
          v=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'cf_made_to_order':
        let value1=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value1=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value1="TRUE"
            }
            else{
              value1="FALSE"
            }
          }
        }
        else {
          value1=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value1})
        j++
        break;
      case 'cf_white_labeled':
        let value3=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value3=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value3="TRUE"
            }
            else{
              value3="FALSE"
            }
          }
        }
        else {
          value3=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value3})
        j++
        break;
        case 'cf_biodegradable':
          let value4=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value4=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value4="Yes"
              }
              else{
                value4="No"
              }
            }
          }
          else {
            value4=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value4})
          j++
          break;
        case 'cf_onetimeuse':
          let value5=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value5=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value5="Yes"
              }
              else{
                value5="No"
              }
            }
          }
          else {
            value5=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value5})
          j++
          break;
          

      default:
        // console.log(pimcoreKeys[j],zohoKeys[i])
        //check zohokeys[i] iss start with cf_
        // console.log("hello default",zohoKeys[i])
        if(zohoKeys[i].startsWith("cf_")){
          let value=Any
          // console.log("hello in cf case ",zohoKeys[i])
          // custom_Field.api_name=zohoKeys[i]
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value=""
            }
            else {
              value=item[pimcoreKeys[j]]
            }
          }
          else {
            value=""
          }
          // custom_Field.value=item[pimcoreKeys[j]]
          // console.log("hello in cf case ",custom_Field)
          // productMap.custom_fields.push(custom_Field)
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
          j++
        }
        else{
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
           productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      }
    }
  }
  // console.log('productMap',productMap)
  return productMap
}
async zohoVarianttype(zohoKeys:string[],pimcoreKeys:string[],item:any){
  let productMap={
    "custom_fields":[],
    "item_tax_preferences":[
      {
        "tax_specification": "inter",
        "tax_id": "",
    },
    {
        "tax_specification": "intra",
        "tax_id": "",
    }
    ],
    "package_details":{
      "length": "",
      "width": "",
      "height": "",
      "weight": "",
      "weight_unit": "g",
      "dimension_unit": "cm"
    }
  }

  let papa=item.parent.Name
  // console.log("papa-var",papa)
  let badepapa = item.parent.parent.Name
  // console.log("badepapa",badepapa)
  let path=item.parent.parent.parent.fullpath
  // let papa=item.parent.Name
  // let path=item.parent.fullpath
  // let pathArray=["0","1","2","3"]
  let pathArray=path.split('/')
  let l0 = pathArray[2]
  let l1 = pathArray[3]
  let l2 = pathArray[4]
  let l3 = pathArray[5]
  let custom_Field={
    "api_name":Any,
    "value":Any
  }
  for(let i=0,j=0;i<zohoKeys.length;i++){
    //switch case on zohoKeys[i]
    switch(zohoKeys[i]){
      // case 'category_name':
      //   productMap[zohoKeys[i]]=l0
      //   break;
      case 'cf_category_l0':
 
        // custom_Field.api_name="cf_category_l0"
        // custom_Field.value=l0
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_category_l0","value":l0})
        break
      case 'cf_sub_category_l1':
        // custom_Field.api_name="cf_sub_category_l1"
        // custom_Field.value=l1
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l1","value":l1})
        break;
      case 'cf_sub_category_l2':
        // custom_Field.api_name="cf_sub_category_l2"
        // custom_Field.value=l2
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_category_l2","value":l2})
        break;
      case 'cf_sub_sub_category_l3':
        // custom_Field.api_name="cf_sub_sub_category_l3"
        // custom_Field.value=l3
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":"cf_sub_sub_category_l3","value":l3})
        break;
      case 'product_type':
        productMap[zohoKeys[i]]="goods"
        j++
        break;
      // case 'unit':
      //   productMap[zohoKeys[i]]="pcs"
      //   j++
      //   break;
      case 'package_details{dimension_unit}':
        break;
      case 'package_details{weight_unit}':
        break;
      case 'is_taxable'
       productMap[zohoKeys[i]]=true
       j++
       break;
      case 'package_details{length}':
        if(item.Length)
        {
          productMap.package_details.length=item.Length.value
        }
        j++
        break;
      case 'package_details{width}':
        if(item.Breadth)
        {
          productMap.package_details.width=item.Breadth.value
        }
        j++
        break;
      case 'package_details{height}':
        if(item.Height)
        {
          productMap.package_details.height=item.Height.value
        }
        j++
        break;
      case 'package_details{weight}':
          if(item.Weight)
          {
            productMap.package_details.weight=item.Weight.value
          }
          j++
          break;      
      case 'name':
        if(item.Name){                   
          productMap[zohoKeys[i]]=`${badepapa} (${papa}) [${item[pimcoreKeys[j]]}]`
          // productMap[zohoKeys[i]]=`${item[pimcoreKeys[j]]}`
        }
        else
        {
            productMap[zohoKeys[i]]=''
        }
       j++
       break;
      // case 'sales_information':
      //   // custom_Field.api_name="cf_sales_information"
      //   // custom_Field.value=true
      //   // productMap.custom_fields.push(custom_Field)
      //   // productMap.custom_fields.push({"api_name":"cf_sales_information","value":true})
      //   productMap[zohoKeys[i]]=true
      //   j++
      //   break;
      case 'account_name':
        productMap[zohoKeys[i]]="Sales"
        j++
        break;
      case 'purchase_description':
        productMap[zohoKeys[i]]=true
        j++
        break;
      case 'purchase_account_name':
        productMap[zohoKeys[i]]="Cost of Goods Sold"
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_specification,tax_name}]inter':
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%intra':
        productMap.item_tax_preferences[1].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_percentage}]%inter':
        productMap.item_tax_preferences[0].tax_id=item[pimcoreKeys[j]]
        j++
        break;
      case 'item_tax_preferences [{tax_type}]intra':
        j++
        break;
      case 'item_tax_preferences [{tax_type}]inter':
        j++
        break;
      case 'inventory_account_name':
        productMap[zohoKeys[i]]="Finished Goods"
        j++
        break;
      // case 'cf_activitystatus':
      //   console.log("conunt")
      //   // custom_Field.api_name="cf_activitystatus"
      //   // custom_Field.value="Active"
      //   // productMap.custom_fields.push(custom_Field)
      //   productMap.custom_fields.push({"api_name":"cf_activitystatus","value":"Active"})
      //   break;
      case 'track_batch_number':
        productMap[zohoKeys[i]]=true
        break;
      case 'item_type':
        productMap[zohoKeys[i]]="inventory"
        break;
      case 'is_linked_with_zohocrm':
        productMap[zohoKeys[i]]=true
        break;

      case 'sales_rate':
        
        // console.log('value',item)
          if(item.Selling_Price){                   
              productMap[zohoKeys[i]]=item.SellingPrice.value
          }
          else
          {
                productMap[zohoKeys[i]]=''
          }
        j++
        break;
      case 'purchase_rate':
        if(item.Cost_Price){
          productMap[zohoKeys[i]]=item.Cost_Price.value
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      case 'manufacturer':
        if(item.Manufacturer)
        {
          productMap[zohoKeys[i]]=item.Manufacturers.Name
        }
        else
        {
          productMap[zohoKeys[i]]=''
        }
        j++
        break;
      // case 'brand':
      //   if(item.Brand)
      //   {
      //     productMap[zohoKeys[i]]=item.Brands.value
      //   }
      //   else
      //   {
      //     productMap[zohoKeys[i]]=''
      //   }
      //   j++
      //   break;
      case 'sku':
          // console.log(pimcoreKeys[j])
          // console.log("hello id",item.id)
          productMap[zohoKeys[i]]=item.id
        j++
        break;
      case 'cf_pimcore_id':
        // custom_Field.api_name=zohoKeys[i]
        // custom_Field.value=item.id
        // productMap.custom_fields.push(custom_Field)
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":item.id})
        j++
        break;
      // case 'cf_returnable_item':
      //   productMap[zohoKeys[i]]=item.Returnable
      //   j++
      //   break;
      case 'cf_ready_to_product':
        let value=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value="TRUE"
            }
            else{
              value="FALSE"
            }
          }
        }
        else {
          value=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'description':
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
            //convert item.Description to string
            let description=item[pimcoreKeys[j]]
            let description_json=JSON.stringify(description)
            let description_json_without_html=description_json.replace(/<[^>]*>/g, '')
            description_json_without_html=description_json_without_html.replace(/\\n/g, '')
            productMap[zohoKeys[i]]=description_json_without_html
            // productMap[zohoKeys[i]]=JSON.stringify(item[pimcoreKeys[j]])

            // productMap[zohoKeys[i]]=item[pimcoreKeys[j]].toString()
          //  productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      case 'cf_display_on':
          let k=""
         productMap.custom_fields.push({"api_name":zohoKeys[i],"value":k})
         j++
         break;
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'cf_ready_to_product':
        let v=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            v=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              v="TRUE"
            }
            else{
              v="FALSE"
            }
          }
        }
        else {
          v=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
        j++
        break;
      case 'cf_made_to_order':
        let value1=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value1=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value1="TRUE"
            }
            else{
              value1="FALSE"
            }
          }
        }
        else {
          value1=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value1})
        j++
        break;
      case 'cf_white_labeled':
        let value3=Any
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
            value3=""
          }
          else {
            if(item[pimcoreKeys[j]]){
              value3="TRUE"
            }
            else{
              value3="FALSE"
            }
          }
        }
        else {
          value3=""
        }
        productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value3})
        j++
        break;
        case 'cf_biodegradable':
          let value4=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value4=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value4="Yes"
              }
              else{
                value4="No"
              }
            }
          }
          else {
            value4=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value4})
          j++
          break;
        case 'cf_onetimeuse':
          let value5=Any
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value5=""
            }
            else {
              if(item[pimcoreKeys[j]]){
                value5="Yes"
              }
              else{
                value5="No"
              }
            }
          }
          else {
            value5=""
          }
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value5})
          j++
          break;
          

      default:
        // console.log(pimcoreKeys[j],zohoKeys[i])
        //check zohokeys[i] iss start with cf_
        // console.log("hello default",zohoKeys[i])
        if(zohoKeys[i].startsWith("cf_")){
          let value=Any
          // console.log("hello in cf case ",zohoKeys[i])
          // custom_Field.api_name=zohoKeys[i]
          if(Object.keys(item).includes(pimcoreKeys[j])){
            if(item[pimcoreKeys[j]]==null || item[pimcoreKeys[j]]==""){
              value=""
            }
            else {
              value=item[pimcoreKeys[j]]
            }
          }
          else {
            value=""
          }
          // custom_Field.value=item[pimcoreKeys[j]]
          // console.log("hello in cf case ",custom_Field)
          // productMap.custom_fields.push(custom_Field)
          productMap.custom_fields.push({"api_name":zohoKeys[i],"value":value})
          j++
        }
        else{
        if(Object.keys(item).includes(pimcoreKeys[j])){
          if(item[pimcoreKeys[j]]==null ||item[pimcoreKeys[j]]==""){
          productMap[zohoKeys[i]]=""
          }
          else {
           productMap[zohoKeys[i]]=item[pimcoreKeys[j]]
          }
        }
        else {
          productMap[zohoKeys[i]]=""
        }
        j++
        break;
      }
    }
  }
  // console.log('productMap',productMap)
  return productMap
}

async zohoBookToken(){
  let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        'refresh_token':'1000.ed1558439de1a92a10ea765558341e0a.491937e36a45f1ec81808449305ed2fd',
        'client_id':'1000.RSJXXGBXUBDSTFQP3MWRPB0V0W7JVO',
        'client_secret':'3992ea3c6a7e219c3d4acfb9240ad3be1f595eff08',
        'grant_type': 'refresh_token' 
    })
});
zoho=await zoho.text()
zoho=JSON.parse(zoho)
let token="Zoho-oauthtoken "
token=token+zoho.access_token
return token
}

async mapZohoProduct(item,type){
  let zohoKeys=[
    "product_type",//goods
  "unit",//pcs
  "package_details{dimension_unit}",//cm NP
  "package_details{weight_unit}",//g NP
  "is_taxable",//TRUE
  "name",
  "sku",
  "cf_returnable_item",
  "hsn_or_sac",
  "package_details{length}",
  "package_details{width}",
  "package_details{height}",
  "package_details{weight}",
  "brand",
  "manufacturer",
  "upc",
  "cf_mpn",
  "ean",
  "isbn",
  "cf_lead_time",
  "cf_made_to_order",
  "cf_ready_to_product",
  "cf_white_labeled",
  "cf_green_product",
  "cf_eco_friendly",
  "cf_prodo_exclusive",
  "cf_minimum_order_quantity",
  "cf_display_on",
  "cf_variant_description",
  "cf_category_l0",//NP
  "cf_sub_category_l1",//NP
  "cf_sub_category_l2",//NP
  "cf_sub_sub_category_l3",//NP
  // "cf_sales_information",//TRUE
  "sales_rate",
  "account_name",//Sales 
  "description",
  "purchase_description",//TRUE
  "purchase_rate",
  "purchase_account_name",//Cost of Goods Sold
  "item_tax_preferences [{tax_specification,tax_name}]intra",//GST12
  "item_tax_preferences [{tax_percentage}]%intra",
  "item_tax_preferences [{tax_type}]intra",//Group
  "item_tax_preferences [{tax_specification,tax_name}]inter",//IGST12
  "item_tax_preferences [{tax_percentage}]%inter",
  "item_tax_preferences [{tax_type}]inter",//Simple
  "cf_pimcore_id",
  // "cf_fragile",
  "cf_biodegradable",
  "cf_onetimeuse",
  "cf_seo_tags",
  "cf_country_of_origin",
  "cf_client_sku_code",
  "cf_prodo_sku_id",
  "cf_model_no",
  "inventory_account_name",//Finished Goods NP
  // "cf_activitystatus",//Active NP
  "track_batch_number",//TRUE NP
  "item_type",//Sales and Purchases NP
  "is_linked_with_zohocrm",//TRUE NP
  // "category_name"
  ]

let pimcoreKeys=[
  "GoodsOrService",
  "Unit",
  "TaxPreferance",
  "Name",
  "ID",
  "Returnable",
  "HSNCode",
  "Length",
  "Breadth",
  "Height",
  "Weight",
  "Brand",
  "Manufacurers",
  "UPC",
  "MPN",
  "EAN",
  "ISBN",
  "LeadTime",
  "MadeToOrder",
  "ReadyStock",
  "WhiteLabeled",
  "GreenProduct",
  "EcoFriendly",
  "ProdoExclusive",
  "MOQ",
  "DisplayOn",
  "SalesDescription",
  // "SalesInformation",
  "SellingPrice",
  "SalesAccount",
  "Description",
  "PurchaseInformation",
  "CostPrice",
  "PurchaseAccount",
  "Intra",
  "IntraStateGSTRate",
  "IntraType",
  "Inter",
  "InterStateGSTRate",
  "interType",
  "ID",
  // "Fragile",
  "Biodegradable",
  "OneTimeUse",
  "Tags",
  // "TrackInventory",
  "Country",
  "ClientSKUCode",
  "SKU",
  "ModelNo"
]
if(type=="L0"){
  // console.log('L0')
  return await this.zohoPtype(zohoKeys,pimcoreKeys,item)
}
else if(type=="L0-C"){
  // console.log('L0-C')
  return await this.zohoPtype(zohoKeys,pimcoreKeys,item)
}
else if(type=="L1"){
  // console.log('L1')
  return await this.zohoBrandtype(zohoKeys,pimcoreKeys,item)
}
else if(type=="L2"){
  // console.log('L2')
  return await this.zohoVarianttype(zohoKeys,pimcoreKeys,item)
}
else if (type=="L1-C") {
  // console.log('L1-C')
  return await this.zohoBrandtype(zohoKeys,pimcoreKeys,item)
}
}

async ToZohoProduct(item,type){
    let product = await this.mapZohoProduct(item,type)
    return product
    let out =[]
    let token=await this.zohoBookToken()
    out.push(product)
    let res1=await this.postToZoho(product,token)
    if(res1=="INVALID_TOKEN"){
    token = await this.zohoBookToken()
    res1=await this.postToZoho(product,token)
    }
    return res1
}

async postToZoho(item:any,token:string){
  let zoho1 = await fetch('https://books.zoho.in/api/v3/items?organization_id=60015092519', {
  method: 'POST',
   headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },   
  // body: out
  body:JSON.stringify(item)
});

zoho1=await zoho1.text() 
zoho1=JSON.parse(zoho1)
if(zoho1.message=="The item has been added."){
  // console.log("zoho item aded")
  return zoho1
}
else if(zoho1.code=="120124"){
  console.log("invalid data",zoho1.message)
  return item
}
else if (zoho1.code=="1001") {
  // console.log("in put",item.sku)
 
let kill
let res = await fetch(`https://books.zoho.in/api/v3/items?organization_id=60015092519&search_text=${item.sku}`, {
// let res=await fetch('https://books.zoho.in/api/v3/items?organization_id=60015092519&search_text=3458',{
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json()) 
  .then(data=>
      kill=data
  );
  // console.log("data",kill) 
  if(kill.items==undefined){
    console.log("no item found")
    return item
  }
  if(!(kill.items.length>0)){
  return item
  }
  let id=kill.items[0].item_id
  let zoho5 = await fetch(`https://books.zoho.in/api/v3/items/${id}?organization_id=60015092519`, {
  method: 'PUT',
  headers:{
    'Authorization':`${token}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Content-Length':'904'
  },
  // body: out
  body:JSON.stringify(item)
  });
  zoho5=await zoho5.text() 
  zoho5=JSON.parse(zoho5)
  // console.log("zoho product put",zoho5.code,zoho5.message)
  return zoho5.message
}
else if(zoho1.code=="1002"){
  // console.log("in put",item)
  return "JSON is not well formed"
}
else if(zoho1.code=="4"){
  console.log("invalid data in put",zoho1.message)
  return item
} if(zoho1.code=="57"||zoho1.code=="14"){
  // console.log("invalid token",zoho1.message)
  return "INVALID_TOKEN"
}

}
async currentPriceUpdate(product:any,date:any,price:any){
  product.price=price
  product.variants[0].price=price
  product.date=date
 await this.productRepository.save(product)
 return product.price
}

async productRating(data){
  // console.log("product rating",data)
   let zohoId=data.zohoId
   let k=await this.productRatingRepository.findOne({where:{zohoId:zohoId}})
  //  console.log("product rating",k)
   if(k){    
      let u= await this.userReviewRepository.findOne({where:{zohoId:zohoId,userId:data.userId}})
      // console.log("user review",u)
      if(u){
        if(1==u.rating){
          k.oneStar=k.oneStar-1
        }
        else if(2==u.rating){
          k.twoStar=k.twoStar-1
        }
        else if(3==u.rating){
          k.threeStar=k.threeStar-1
        }
        else if(4==u.rating){
          k.fourStar=k.fourStar-1
        }
        else if(5==u.rating){
          k.fiveStar=k.fiveStar-1
        }
        if(data.rating==1){
          k.oneStar=k.oneStar+1
        }
        else if(data.rating==2){
          k.twoStar=k.twoStar+1
        }
        else if(data.rating==3){
          k.threeStar=k.threeStar+1
        }
        else if(data.rating==4){
          k.fourStar=k.fourStar+1
        }
        else if(data.rating==5){
          k.fiveStar=k.fiveStar+1
        }
        await this.userReviewRepository.update(u.id,data)
        await this.productRatingRepository.update(k.id,k)
        // console.log("updated ",k)
       return await this.calculateRating(k)
      }
      else{
       
        if(data.rating==1){
          k.oneStar=k.oneStar+1
        }
        else if(data.rating==2){
          k.twoStar=k.twoStar+1
        }
        else if(data.rating==3){
          k.threeStar=k.threeStar+1
        }
        else if(data.rating==4){
          k.fourStar=k.fourStar+1
        }
        else if(data.rating==5){
          k.fiveStar=k.fiveStar+1
        }
        await this.userReviewRepository.save(data)
        await this.productRatingRepository.update(k.id,k)
      }
      return await this.calculateRating(k)
   }
   else{
      let rating={
        zohoId: zohoId,
        prodoId: data.prodoId,
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
    }
    if(data.rating==1){
      rating.oneStar=rating.oneStar+1
    }
    else if(data.rating==2){
      rating.twoStar=rating.twoStar+1
    }
    else if(data.rating==3){
      rating.threeStar=rating.threeStar+1
    }
    else if(data.rating==4){
      rating.fourStar=rating.fourStar+1
    }
    else if(data.rating==5){
      rating.fiveStar=rating.fiveStar+1
    }
    // console.log("rating",rating)
    await this.productRatingRepository.save(rating)
    let r=await this.userReviewRepository.findOne({where:{zohoId:zohoId}})
    if(r){
      await this.userReviewRepository.update(r.id,data)
    }
    else{
      await this.userReviewRepository.save(data)
    }
    // await this.productReviewRepository.save(data)
    return await this.calculateRating(rating)
   }
}
async getProductRating(zohoId){
  let k=await this.productRatingRepository.findOne({where:{zohoId:zohoId}})
  if(k){
      return await this.calculateRating(k)
  }
  else{
    return 0
  }
}
async getUserReview(zohoId,user_id){
  let k=await this.userReviewRepository.findOne({where:{zohoId:zohoId,userId:user_id}})
  if(k){
    return k
  }
  else{
    return "no review"
  }
}
async calculateRating(rating){
  // console.log("rating-gh",rating)
  let totalRating=1*rating.oneStar+2*rating.twoStar+3*rating.threeStar+4*rating.fourStar+5*rating.fiveStar
  let totalRating1=rating.oneStar+rating.twoStar+rating.threeStar+rating.fourStar+rating.fiveStar
  return totalRating/totalRating1
}
}
