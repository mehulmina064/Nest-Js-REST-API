import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, EntityRepository, MongoRepository, ObjectID, Repository } from 'typeorm';
import { Category } from '../../../categories/category.entity';
import { CategoryService } from '../../../categories/category.service';
import { getMongoRepository, getRepository } from 'typeorm';
import { Product } from '../../../product/product.entity';
import { ProductRating } from '../../../product/productRating.entity';
import { UserReview } from '../../../product/userReview.entity';
import {HttpException,HttpStatus } from '@nestjs/common';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');
import fetch from 'node-fetch'
import { type } from 'os';

@Injectable()
export class internalProductService {
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

async check(sku: string){
  let check = await this.productRepository.findOne({where:{ zohoBooksProductId: sku }}).then((res1)=>{
    return res1
  }).catch((err)=>{
    return false
  })
  return check
}
}
