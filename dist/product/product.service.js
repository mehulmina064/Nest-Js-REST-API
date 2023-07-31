"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const XLSX = require("xlsx");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const category_service_1 = require("../categories/category.service");
const typeorm_3 = require("typeorm");
const productRating_entity_1 = require("./productRating.entity");
const userReview_entity_1 = require("./userReview.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const crypto = require('crypto');
const node_fetch_1 = require("node-fetch");
let ProductService = class ProductService {
    constructor(productRepository, categoryService, productRatingRepository, userReviewRepository) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.productRatingRepository = productRatingRepository;
        this.userReviewRepository = userReviewRepository;
    }
    findByCategory12(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find({ where: { categoryId: id } });
        });
    }
    paginate(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let k = typeorm_3.getMongoRepository(product_entity_1.Product);
            console.log('k', k);
            const paginatedProduct = yield (nestjs_typeorm_paginate_1.paginate(this.productRepository, options));
            const product = paginatedProduct.items;
            product.forEach((item) => {
                delete item.description;
                delete item.price;
            });
            return paginatedProduct;
        });
    }
    findAllProducts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find();
        });
    }
    findAll(paginatedProduct) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let products = yield this.productRepository.find();
            const categories = yield this.categoryService.findAll();
            for (let i = 0; i < paginatedProduct.items; i++) {
                let product = paginatedProduct.items[i];
                delete paginatedProduct.items[i].price;
                delete paginatedProduct.items[i].description;
                for (let j = 0; j < categories.length; j++) {
                    if (product.categoryId === categories[j].id.toString()) {
                        products[i].categoryName = categories[j].categoryName;
                    }
                }
            }
            return paginatedProduct;
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.findOne(id);
        });
    }
    save(product) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.save(product);
        });
    }
    update(id, product) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.productRepository.update(id, product);
            return yield this.findOne(id);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findOne(id);
            yield this.productRepository.delete(id);
            return product;
        });
    }
    getProductBySku(sku) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            sku = sku.toString();
            const product = yield this.productRepository.findOne({ where: { zohoBooksProductId: sku } });
            if (product) {
                return product;
            }
            return false;
        });
    }
    findByCategory(options, categoryId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const paginatedProduct = yield (nestjs_typeorm_paginate_1.paginate(this.productRepository, options, { where: { categoryId } }));
            const categories = yield this.categoryService.findAll();
            const product = paginatedProduct.items;
            product.forEach((item) => {
                delete item.description;
                delete item.price;
            });
            return paginatedProduct;
        });
    }
    searchProducts(options, productName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            productName = decodeURIComponent(productName);
            return yield (nestjs_typeorm_paginate_1.paginate(this.productRepository, options, { where: { productName: new RegExp(productName, 'i') } }));
        });
    }
    findCategoryId(categoryName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const categoryId = yield this.categoryService.findCategoryId(categoryName);
            return categoryId;
        });
    }
    bulkUpload(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const products = [];
            const worksheet = XLSX.readFile(file.path);
            const sheet_name_list = worksheet.SheetNames;
            const data = XLSX.utils.sheet_to_json(worksheet.Sheets[sheet_name_list[1]]);
            data.forEach((item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let product = new product_entity_1.Product();
                let variants = [];
                let variant1 = { name: '', price: 0, images: [] };
                let variant2 = { name: '', price: 0, images: [] };
                let variant3 = { name: '', price: 0, images: [] };
                let variant4 = { name: '', price: 0, images: [] };
                let variant5 = { name: '', price: 0, images: [] };
                product.productName = item['Product'];
                product.categoryId = '623af51151d7f22358800ace';
                product.description = item['Description'];
                product.price = item['Default Price'];
                product.leadTime = item['Lead Time'];
                product.moq = item['MOQ'];
                product.paymentTerms = item['Payment Terms'];
                product.seo = item['TR1'];
                product.hsnCode = item['HSN Code'];
                product.whiteLabeling = item['White-labeling'];
                product.prodoExclusive = item['Prodo Exclusive'];
                product.ecoFriendly = item['Eco-friendly'];
                product.madeToOrder = item['Made-to-Order Product'];
                product.readyProduct = item['Ready Product'];
                product.productImages.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
                if (item['Variant 1 (default)']) {
                    variant1.price = item['price 1'];
                    variant1.name = item['Variant 1 (default)'];
                    variant1.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
                }
                if (item['Variant 2']) {
                    variant2.price = item['price 2'];
                    variant2.name = item['Variant 2'];
                    variant2.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
                }
                if (item['Variant 3']) {
                    variant3.price = item['price 3'];
                    variant3.name = item['Variant 3'];
                    variant3.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
                }
                if (item['Variant 4']) {
                    variant4.price = item['price 4'];
                    variant4.name = item['Variant 4'];
                    variant4.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
                }
                if (item['Variant 5']) {
                    variant5.price = item['price 5'];
                    variant5.name = item['Variant 5'];
                    variant5.images.push(`/assets/images/products/packaging/${item['Image Alt Text - 1']}`);
                }
                if (variant1.name) {
                    variants.push(variant1);
                }
                if (variant2.name) {
                    variants.push(variant2);
                }
                if (variant3.name) {
                    variants.push(variant3);
                }
                if (variant4.name) {
                    variants.push(variant4);
                }
                if (variant5.name) {
                    variants.push(variant5);
                }
                product.variants = variants;
                products.push(product);
            }));
            return yield this.productRepository.save(products);
        });
    }
    clear() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const products = yield this.productRepository.find({ categoryId: '62273e5b2dc01a1be68f004d' });
            return this.productRepository.remove(products);
        });
    }
    SaveZohoProduct(item, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            item = yield this.removeNull(item);
            if (item.images == 0) {
                item.images = [];
            }
            else {
                item.images = item.images.split(',');
            }
            if (item.ProdoExclusive) {
                item.ProdoExclusive = true;
            }
            else {
                item.ProdoExclusive = false;
            }
            if (type === 'L0') {
                let path = item.parent.fullpath;
                let pathArray = path.split('/');
                let category = pathArray[2];
                let categoryId = yield this.categoryService.findByCategoryName(category);
                let variant = {
                    "name": "Standard",
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "images": item.images,
                    "zohoId": item.id
                };
                let product = {
                    "prodoExclusive": item.ProdoExclusive ? true : false,
                    "greenProduct": item.GreenProduct ? true : false,
                    "productImages": item.images,
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "description": yield this.getDescription(item.Description),
                    "readyProduct": item.ReadyStock ? true : false,
                    "madeToOrder": item.MadeToOrder ? true : false,
                    "whiteLabeling": item.WhiteLabeled ? true : false,
                    "ecoFriendly": item.EcoFriendly ? true : false,
                    "variants": [variant],
                    "similarProductIds": [],
                    "zohoBooksProduct": true,
                    "categoryId": categoryId,
                    "productName": item.Name,
                    "zohoBooksProductId": item.id,
                    "hsnCode": item.HSN_Code,
                    "sku": item.SKU,
                    "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
                    "leadTime": item.LeadTime,
                    "moq": item.MOQ,
                    "isVisible": true
                };
                return this.pim_product_save_update(product);
            }
            else if (type === 'L1') {
                let path = item.parent.parent.fullpath;
                let pathArray = path.split('/');
                let category = pathArray[2];
                let categoryId = yield this.categoryService.findByCategoryName(category);
                let variant = {
                    "name": "Standard",
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "images": item.images,
                    "zohoId": item.id,
                    "p_typeId": item.parent.id,
                    "p_typeName": item.parent.Name
                };
                let product = {
                    "prodoExclusive": item.ProdoExclusive ? true : false,
                    "greenProduct": item.GreenProduct ? true : false,
                    "productImages": item.images,
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "description": yield this.getDescription(item.Description),
                    "readyProduct": item.ReadyStock ? true : false,
                    "madeToOrder": item.MadeToOrder ? true : false,
                    "whiteLabeling": item.WhiteLabeled ? true : false,
                    "ecoFriendly": item.EcoFriendly ? true : false,
                    "variants": [variant],
                    "similarProductIds": [],
                    "zohoBooksProduct": true,
                    "categoryId": categoryId,
                    "productName": item.Name,
                    "zohoBooksProductId": item.id,
                    "hsnCode": item.HSN_Code,
                    "sku": item.SKU,
                    "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
                    "leadTime": item.LeadTime,
                    "moq": item.MOQ,
                    "isVisible": false
                };
                return this.pim_product_save_update(product);
            }
            else if (type === 'L2') {
                let path = item.parent.parent.parent.fullpath;
                let pathArray = path.split('/');
                let category = pathArray[2];
                let categoryId = yield this.categoryService.findByCategoryName(category);
                let variant = {
                    "name": "Standard",
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "images": item.images,
                    "zohoId": item.id,
                    "brand": item.parent.Name,
                    "brandId": item.parent.id,
                    "p_typeId": item.parent.parent.id,
                    "p_typeName": item.parent.parent.Name
                };
                let product = {
                    "prodoExclusive": item.ProdoExclusive ? true : false,
                    "greenProduct": item.GreenProduct ? true : false,
                    "productImages": item.images,
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "description": yield this.getDescription(item.Description),
                    "readyProduct": item.ReadyStock ? true : false,
                    "madeToOrder": item.MadeToOrder ? true : false,
                    "whiteLabeling": item.WhiteLabeled ? true : false,
                    "ecoFriendly": item.EcoFriendly ? true : false,
                    "variants": [variant],
                    "similarProductIds": [],
                    "zohoBooksProduct": true,
                    "categoryId": categoryId,
                    "productName": item.Name,
                    "zohoBooksProductId": item.id,
                    "hsnCode": item.HSN_Code,
                    "sku": item.SKU,
                    "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
                    "leadTime": item.LeadTime,
                    "moq": item.MOQ,
                    "isVisible": false
                };
                return this.pim_product_save_update(product);
            }
            else if (type == 'L0-C') {
                let path = item.parent.fullpath;
                let pathArray = path.split('/');
                let category = pathArray[2];
                let categoryId = yield this.categoryService.findByCategoryName(category);
                let variant = {
                    "name": "Standard",
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "images": item.images,
                    "zohoId": item.id
                };
                let product = {
                    "prodoExclusive": item.ProdoExclusive ? true : false,
                    "greenProduct": item.GreenProduct ? true : false,
                    "productImages": item.images,
                    "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                    "description": yield this.getDescription(item.Description),
                    "readyProduct": item.ReadyStock ? true : false,
                    "madeToOrder": item.MadeToOrder ? true : false,
                    "whiteLabeling": item.WhiteLabeled ? true : false,
                    "ecoFriendly": item.EcoFriendly ? true : false,
                    "variants": [variant],
                    "similarProductIds": [],
                    "zohoBooksProduct": true,
                    "categoryId": categoryId,
                    "productName": item.Name,
                    "zohoBooksProductId": item.id,
                    "hsnCode": item.HSN_Code,
                    "sku": item.SKU,
                    "seo": `${item.Name}, ${category},Made-to-Order Product,Prodo Exclusive,Eco-friendly,Ready Product,White-labeling,Prodo, #ProcurementDone `,
                    "leadTime": item.LeadTime,
                    "moq": item.MOQ,
                    "isVisible": true,
                };
                product = yield this.addvariants(product, item);
                return this.pim_product_save_update(product);
            }
        });
    }
    pim_product_save_update(product) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let sku = product.zohoBooksProductId;
            let product1 = yield this.getProductBySku(sku);
            if (product1) {
                product.id = product1.id;
                product.price = Number(product1.price);
                product.zohoBooksProduct = product1.zohoBooksProduct;
                let k = yield this.productRepository.save(product);
                return { 'status': 'success', 'message': 'product updated', 'data': k };
            }
            else {
                let m = yield this.productRepository.save(product);
                return { 'status': 'success', 'message': 'product saved', 'data': m };
            }
        });
    }
    removeNull(item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let product = {};
            for (let key in item) {
                if (item[key] !== null) {
                    if (item[key]) {
                        product[key] = item[key];
                    }
                    else {
                        product[key] = 0;
                    }
                }
                else {
                    product[key] = 0;
                }
            }
            return product;
        });
    }
    getDescription(description) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (description === 0) {
                return '';
            }
            let description_json = JSON.stringify(description);
            let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
            description_json_without_html = description_json_without_html.replace(/\\n/g, '');
            return description_json_without_html;
        });
    }
    addvariants(product, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let child5 = item.children;
            for (let n = 0; n < child5.length; n++) {
                if (Object.keys(child5[n]).includes("children")) {
                    if (child5[n].children.length > 0) {
                        let child6 = child5[n].children;
                        for (let o = 0; o < child6.length; o++) {
                            let y = child6[o];
                            y = yield this.removeNull(y);
                            product = yield this.addvariant(product, y);
                        }
                    }
                    else {
                        let x = child5[n];
                        x = yield this.removeNull(x);
                        product = yield this.addvariant(product, x);
                    }
                }
            }
            return product;
        });
    }
    addvariant(product, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            item = yield this.removeNull(item);
            if (item.images == 0) {
                item.images = [];
            }
            else {
                item.images = item.images.split(',');
            }
            let variant = {
                "name": item.Name,
                "price": item.SellingPrice ? Number(item.SellingPrice) : 0,
                "images": item.images,
                "zohoId": item.id
            };
            product.variants.push(variant);
            return product;
        });
    }
    getPimData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            let kill;
            const ret = yield node_fetch_1.default('https://pim.prodo.in/pimcore-graphql-webservices/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-Key': "8f7bb0951b624784d0b08ba94a56218a"
                },
                body: JSON.stringify({ query: query })
            })
                .then(r => r.json())
                .then(data => kill = data);
            kill = kill.data.getObjectFolder.children;
            return kill;
        });
    }
    getPimProducts(kill) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = [];
            for (let i = 0; i < kill.length; i++) {
                if (Object.keys(kill[i]).includes("children")) {
                    let child = kill[i].children;
                    if (child.length > 0) {
                        for (let j = 0; j < child.length; j++) {
                            if (Object.keys(child[j]).includes("children")) {
                                let child2 = child[j].children;
                                if (child2.length > 0) {
                                    for (let k = 0; k < child2.length; k++) {
                                        if (Object.keys(child2[k]).includes("children")) {
                                            let child3 = child2[k].children;
                                            if (child3.length > 0) {
                                                for (let l = 0; l < child3.length; l++) {
                                                    if (Object.keys(child3[l]).includes("children")) {
                                                        let child4 = child3[l].children;
                                                        if (child4.length > 0) {
                                                            for (let m = 0; m < child4.length; m++) {
                                                                if (Object.keys(child4[m]).includes("children")) {
                                                                    if (child4[m].children.length > 0) {
                                                                        res.push({ type: "L0-C", data: child4[m] });
                                                                        let child5 = child4[m].children;
                                                                        for (let n = 0; n < child5.length; n++) {
                                                                            if (Object.keys(child5[n]).includes("children")) {
                                                                                if (child5[n].children.length > 0) {
                                                                                    res.push({ type: "L1-C", data: child5[n] });
                                                                                    let child6 = child5[n].children;
                                                                                    for (let o = 0; o < child6.length; o++) {
                                                                                        res.push({ type: "L2", data: child6[o] });
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    res.push({ type: "L1", data: child5[n] });
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    else {
                                                                        res.push({ type: "L0", data: child4[m] });
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
            return res;
        });
    }
    pimAllProducts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let kill = yield this.getPimData();
            let products = yield this.getPimProducts(kill);
            return products;
        });
    }
    fixData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = [];
            let products = yield this.productRepository.find();
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let Product = yield this.productRepository.findOne(product.id);
                if (Object.keys(product).includes("zohoBooksProduct")) {
                    res.push({ "hello": "zohoBooksProduct" });
                }
                else {
                    product.zohoBooksProduct = false;
                    return yield this.productRepository.save(product);
                    res.push({ "hello": "updated" });
                }
            }
            return res;
        });
    }
    zohoPtype(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {
                "custom_fields": [],
                "item_tax_preferences": [
                    {
                        "tax_specification": "inter",
                        "tax_id": "",
                    },
                    {
                        "tax_specification": "intra",
                        "tax_id": "",
                    }
                ],
                "package_details": {
                    "length": "",
                    "width": "",
                    "height": "",
                    "weight": "",
                    "weight_unit": "g",
                    "dimension_unit": "cm"
                }
            };
            let papa = item.parent.Name;
            let path = item.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            let custom_Field = {
                "api_name": typeorm_2.Any,
                "value": typeorm_2.Any
            };
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'cf_category_l0':
                        productMap.custom_fields.push({ "api_name": "cf_category_l0", "value": l0 });
                        break;
                    case 'cf_sub_category_l1':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l1", "value": l1 });
                        break;
                    case 'cf_sub_category_l2':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l2", "value": l2 });
                        break;
                    case 'cf_sub_sub_category_l3':
                        productMap.custom_fields.push({ "api_name": "cf_sub_sub_category_l3", "value": l3 });
                        break;
                    case 'product_type':
                        productMap[zohoKeys[i]] = "goods";
                        j++;
                        break;
                    case 'package_details{dimension_unit}':
                        break;
                    case 'package_details{weight_unit}':
                        break;
                    case 'is_taxable':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'package_details{length}':
                        if (item.Length) {
                            productMap.package_details.length = item.Length.value;
                        }
                        j++;
                        break;
                    case 'package_details{width}':
                        if (item.Breadth) {
                            productMap.package_details.width = item.Breadth.value;
                        }
                        j++;
                        break;
                    case 'package_details{height}':
                        if (item.Height) {
                            productMap.package_details.height = item.Height.value;
                        }
                        j++;
                        break;
                    case 'package_details{weight}':
                        if (item.Weight) {
                            productMap.package_details.weight = item.Weight.value;
                        }
                        j++;
                        break;
                    case 'name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${item[pimcoreKeys[j]]}`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'account_name':
                        productMap[zohoKeys[i]] = "Sales";
                        j++;
                        break;
                    case 'purchase_description':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'purchase_account_name':
                        productMap[zohoKeys[i]] = "Cost of Goods Sold";
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]inter':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%intra':
                        productMap.item_tax_preferences[1].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%inter':
                        productMap.item_tax_preferences[0].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]inter':
                        j++;
                        break;
                    case 'inventory_account_name':
                        productMap[zohoKeys[i]] = "Finished Goods";
                        j++;
                        break;
                    case 'track_batch_number':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'item_type':
                        productMap[zohoKeys[i]] = "inventory";
                        break;
                    case 'is_linked_with_zohocrm':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'sales_rate':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'purchase_rate':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'manufacturer':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'sku':
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    case 'cf_pimcore_id':
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": item.id });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let value = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value = "TRUE";
                                }
                                else {
                                    value = "FALSE";
                                }
                            }
                        }
                        else {
                            value = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'cf_made_to_order':
                        let value1 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value1 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value1 = "TRUE";
                                }
                                else {
                                    value1 = "FALSE";
                                }
                            }
                        }
                        else {
                            value1 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value1 });
                        j++;
                        break;
                    case 'cf_white_labeled':
                        let value3 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value3 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value3 = "TRUE";
                                }
                                else {
                                    value3 = "FALSE";
                                }
                            }
                        }
                        else {
                            value3 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value3 });
                        j++;
                        break;
                    case 'cf_biodegradable':
                        let value4 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value4 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value4 = "Yes";
                                }
                                else {
                                    value4 = "No";
                                }
                            }
                        }
                        else {
                            value4 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value4 });
                        j++;
                        break;
                    case 'cf_onetimeuse':
                        let value5 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value5 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value5 = "Yes";
                                }
                                else {
                                    value5 = "No";
                                }
                            }
                        }
                        else {
                            value5 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value5 });
                        j++;
                        break;
                    case 'description':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                let description = item[pimcoreKeys[j]];
                                let description_json = JSON.stringify(description);
                                let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
                                description_json_without_html = description_json_without_html.replace(/\\n/g, '');
                                productMap[zohoKeys[i]] = description_json_without_html;
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'cf_display_on':
                        let k = "";
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": k });
                        j++;
                        break;
                    default:
                        if (zohoKeys[i].startsWith("cf_")) {
                            let value = typeorm_2.Any;
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    value = "";
                                }
                                else {
                                    value = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                value = "";
                            }
                            productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                            j++;
                        }
                        else {
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    productMap[zohoKeys[i]] = "";
                                }
                                else {
                                    productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                productMap[zohoKeys[i]] = "";
                            }
                            j++;
                            break;
                        }
                }
            }
            return productMap;
        });
    }
    zohoBrandtype(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {
                "custom_fields": [],
                "item_tax_preferences": [
                    {
                        "tax_specification": "inter",
                        "tax_id": "",
                    },
                    {
                        "tax_specification": "intra",
                        "tax_id": "",
                    }
                ],
                "package_details": {
                    "length": "",
                    "width": "",
                    "height": "",
                    "weight": "",
                    "weight_unit": "g",
                    "dimension_unit": "cm"
                }
            };
            let papa = item.parent.Name;
            let path = item.parent.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            let custom_Field = {
                "api_name": typeorm_2.Any,
                "value": typeorm_2.Any
            };
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'cf_category_l0':
                        productMap.custom_fields.push({ "api_name": "cf_category_l0", "value": l0 });
                        break;
                    case 'cf_sub_category_l1':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l1", "value": l1 });
                        break;
                    case 'cf_sub_category_l2':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l2", "value": l2 });
                        break;
                    case 'cf_sub_sub_category_l3':
                        productMap.custom_fields.push({ "api_name": "cf_sub_sub_category_l3", "value": l3 });
                        break;
                    case 'product_type':
                        productMap[zohoKeys[i]] = "goods";
                        j++;
                        break;
                    case 'package_details{dimension_unit}':
                        break;
                    case 'package_details{weight_unit}':
                        break;
                    case 'is_taxable':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'package_details{length}':
                        if (item.Length) {
                            productMap.package_details.length = item.Length.value;
                        }
                        j++;
                        break;
                    case 'package_details{width}':
                        if (item.Breadth) {
                            productMap.package_details.width = item.Breadth.value;
                        }
                        j++;
                        break;
                    case 'package_details{height}':
                        if (item.Height) {
                            productMap.package_details.height = item.Height.value;
                        }
                        j++;
                        break;
                    case 'package_details{weight}':
                        if (item.Weight) {
                            productMap.package_details.weight = item.Weight.value;
                        }
                        j++;
                        break;
                    case 'name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${papa} (${item[pimcoreKeys[j]]})`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'account_name':
                        productMap[zohoKeys[i]] = "Sales";
                        j++;
                        break;
                    case 'purchase_description':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'purchase_account_name':
                        productMap[zohoKeys[i]] = "Cost of Goods Sold";
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]inter':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%intra':
                        productMap.item_tax_preferences[1].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%inter':
                        productMap.item_tax_preferences[0].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]inter':
                        j++;
                        break;
                    case 'inventory_account_name':
                        productMap[zohoKeys[i]] = "Finished Goods";
                        j++;
                        break;
                    case 'track_batch_number':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'item_type':
                        productMap[zohoKeys[i]] = "inventory";
                        break;
                    case 'is_linked_with_zohocrm':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'sales_rate':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'purchase_rate':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'manufacturer':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'sku':
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    case 'cf_pimcore_id':
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": item.id });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let value = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value = "TRUE";
                                }
                                else {
                                    value = "FALSE";
                                }
                            }
                        }
                        else {
                            value = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'description':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                let description = item[pimcoreKeys[j]];
                                let description_json = JSON.stringify(description);
                                let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
                                description_json_without_html = description_json_without_html.replace(/\\n/g, '');
                                productMap[zohoKeys[i]] = description_json_without_html;
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'cf_display_on':
                        let k = "";
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": k });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let v = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                v = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    v = "TRUE";
                                }
                                else {
                                    v = "FALSE";
                                }
                            }
                        }
                        else {
                            v = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'cf_made_to_order':
                        let value1 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value1 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value1 = "TRUE";
                                }
                                else {
                                    value1 = "FALSE";
                                }
                            }
                        }
                        else {
                            value1 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value1 });
                        j++;
                        break;
                    case 'cf_white_labeled':
                        let value3 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value3 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value3 = "TRUE";
                                }
                                else {
                                    value3 = "FALSE";
                                }
                            }
                        }
                        else {
                            value3 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value3 });
                        j++;
                        break;
                    case 'cf_biodegradable':
                        let value4 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value4 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value4 = "Yes";
                                }
                                else {
                                    value4 = "No";
                                }
                            }
                        }
                        else {
                            value4 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value4 });
                        j++;
                        break;
                    case 'cf_onetimeuse':
                        let value5 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value5 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value5 = "Yes";
                                }
                                else {
                                    value5 = "No";
                                }
                            }
                        }
                        else {
                            value5 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value5 });
                        j++;
                        break;
                    default:
                        if (zohoKeys[i].startsWith("cf_")) {
                            let value = typeorm_2.Any;
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    value = "";
                                }
                                else {
                                    value = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                value = "";
                            }
                            productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                            j++;
                        }
                        else {
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    productMap[zohoKeys[i]] = "";
                                }
                                else {
                                    productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                productMap[zohoKeys[i]] = "";
                            }
                            j++;
                            break;
                        }
                }
            }
            return productMap;
        });
    }
    zohoVarianttype(zohoKeys, pimcoreKeys, item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let productMap = {
                "custom_fields": [],
                "item_tax_preferences": [
                    {
                        "tax_specification": "inter",
                        "tax_id": "",
                    },
                    {
                        "tax_specification": "intra",
                        "tax_id": "",
                    }
                ],
                "package_details": {
                    "length": "",
                    "width": "",
                    "height": "",
                    "weight": "",
                    "weight_unit": "g",
                    "dimension_unit": "cm"
                }
            };
            let papa = item.parent.Name;
            let badepapa = item.parent.parent.Name;
            let path = item.parent.parent.parent.fullpath;
            let pathArray = path.split('/');
            let l0 = pathArray[2];
            let l1 = pathArray[3];
            let l2 = pathArray[4];
            let l3 = pathArray[5];
            let custom_Field = {
                "api_name": typeorm_2.Any,
                "value": typeorm_2.Any
            };
            for (let i = 0, j = 0; i < zohoKeys.length; i++) {
                switch (zohoKeys[i]) {
                    case 'cf_category_l0':
                        productMap.custom_fields.push({ "api_name": "cf_category_l0", "value": l0 });
                        break;
                    case 'cf_sub_category_l1':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l1", "value": l1 });
                        break;
                    case 'cf_sub_category_l2':
                        productMap.custom_fields.push({ "api_name": "cf_sub_category_l2", "value": l2 });
                        break;
                    case 'cf_sub_sub_category_l3':
                        productMap.custom_fields.push({ "api_name": "cf_sub_sub_category_l3", "value": l3 });
                        break;
                    case 'product_type':
                        productMap[zohoKeys[i]] = "goods";
                        j++;
                        break;
                    case 'package_details{dimension_unit}':
                        break;
                    case 'package_details{weight_unit}':
                        break;
                    case 'is_taxable':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'package_details{length}':
                        if (item.Length) {
                            productMap.package_details.length = item.Length.value;
                        }
                        j++;
                        break;
                    case 'package_details{width}':
                        if (item.Breadth) {
                            productMap.package_details.width = item.Breadth.value;
                        }
                        j++;
                        break;
                    case 'package_details{height}':
                        if (item.Height) {
                            productMap.package_details.height = item.Height.value;
                        }
                        j++;
                        break;
                    case 'package_details{weight}':
                        if (item.Weight) {
                            productMap.package_details.weight = item.Weight.value;
                        }
                        j++;
                        break;
                    case 'name':
                        if (item.Name) {
                            productMap[zohoKeys[i]] = `${badepapa} (${papa}) [${item[pimcoreKeys[j]]}]`;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'account_name':
                        productMap[zohoKeys[i]] = "Sales";
                        j++;
                        break;
                    case 'purchase_description':
                        productMap[zohoKeys[i]] = true;
                        j++;
                        break;
                    case 'purchase_account_name':
                        productMap[zohoKeys[i]] = "Cost of Goods Sold";
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_specification,tax_name}]inter':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%intra':
                        productMap.item_tax_preferences[1].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_percentage}]%inter':
                        productMap.item_tax_preferences[0].tax_id = item[pimcoreKeys[j]];
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]intra':
                        j++;
                        break;
                    case 'item_tax_preferences [{tax_type}]inter':
                        j++;
                        break;
                    case 'inventory_account_name':
                        productMap[zohoKeys[i]] = "Finished Goods";
                        j++;
                        break;
                    case 'track_batch_number':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'item_type':
                        productMap[zohoKeys[i]] = "inventory";
                        break;
                    case 'is_linked_with_zohocrm':
                        productMap[zohoKeys[i]] = true;
                        break;
                    case 'sales_rate':
                        if (item.Selling_Price) {
                            productMap[zohoKeys[i]] = item.SellingPrice.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'purchase_rate':
                        if (item.Cost_Price) {
                            productMap[zohoKeys[i]] = item.Cost_Price.value;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'manufacturer':
                        if (item.Manufacturer) {
                            productMap[zohoKeys[i]] = item.Manufacturers.Name;
                        }
                        else {
                            productMap[zohoKeys[i]] = '';
                        }
                        j++;
                        break;
                    case 'sku':
                        productMap[zohoKeys[i]] = item.id;
                        j++;
                        break;
                    case 'cf_pimcore_id':
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": item.id });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let value = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value = "TRUE";
                                }
                                else {
                                    value = "FALSE";
                                }
                            }
                        }
                        else {
                            value = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'description':
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                productMap[zohoKeys[i]] = "";
                            }
                            else {
                                let description = item[pimcoreKeys[j]];
                                let description_json = JSON.stringify(description);
                                let description_json_without_html = description_json.replace(/<[^>]*>/g, '');
                                description_json_without_html = description_json_without_html.replace(/\\n/g, '');
                                productMap[zohoKeys[i]] = description_json_without_html;
                            }
                        }
                        else {
                            productMap[zohoKeys[i]] = "";
                        }
                        j++;
                        break;
                    case 'cf_display_on':
                        let k = "";
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": k });
                        j++;
                        break;
                    case 'cf_ready_to_product':
                        let v = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                v = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    v = "TRUE";
                                }
                                else {
                                    v = "FALSE";
                                }
                            }
                        }
                        else {
                            v = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                        j++;
                        break;
                    case 'cf_made_to_order':
                        let value1 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value1 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value1 = "TRUE";
                                }
                                else {
                                    value1 = "FALSE";
                                }
                            }
                        }
                        else {
                            value1 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value1 });
                        j++;
                        break;
                    case 'cf_white_labeled':
                        let value3 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value3 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value3 = "TRUE";
                                }
                                else {
                                    value3 = "FALSE";
                                }
                            }
                        }
                        else {
                            value3 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value3 });
                        j++;
                        break;
                    case 'cf_biodegradable':
                        let value4 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value4 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value4 = "Yes";
                                }
                                else {
                                    value4 = "No";
                                }
                            }
                        }
                        else {
                            value4 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value4 });
                        j++;
                        break;
                    case 'cf_onetimeuse':
                        let value5 = typeorm_2.Any;
                        if (Object.keys(item).includes(pimcoreKeys[j])) {
                            if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                value5 = "";
                            }
                            else {
                                if (item[pimcoreKeys[j]]) {
                                    value5 = "Yes";
                                }
                                else {
                                    value5 = "No";
                                }
                            }
                        }
                        else {
                            value5 = "";
                        }
                        productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value5 });
                        j++;
                        break;
                    default:
                        if (zohoKeys[i].startsWith("cf_")) {
                            let value = typeorm_2.Any;
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    value = "";
                                }
                                else {
                                    value = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                value = "";
                            }
                            productMap.custom_fields.push({ "api_name": zohoKeys[i], "value": value });
                            j++;
                        }
                        else {
                            if (Object.keys(item).includes(pimcoreKeys[j])) {
                                if (item[pimcoreKeys[j]] == null || item[pimcoreKeys[j]] == "") {
                                    productMap[zohoKeys[i]] = "";
                                }
                                else {
                                    productMap[zohoKeys[i]] = item[pimcoreKeys[j]];
                                }
                            }
                            else {
                                productMap[zohoKeys[i]] = "";
                            }
                            j++;
                            break;
                        }
                }
            }
            return productMap;
        });
    }
    zohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.ed1558439de1a92a10ea765558341e0a.491937e36a45f1ec81808449305ed2fd',
                    'client_id': '1000.'
                    'client_secret': '3992ea3c6a7e219c3d4acfb9240ad3be1f595eff08',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            return token;
        });
    }
    mapZohoProduct(item, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoKeys = [
                "product_type",
                "unit",
                "package_details{dimension_unit}",
                "package_details{weight_unit}",
                "is_taxable",
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
                "cf_category_l0",
                "cf_sub_category_l1",
                "cf_sub_category_l2",
                "cf_sub_sub_category_l3",
                "sales_rate",
                "account_name",
                "description",
                "purchase_description",
                "purchase_rate",
                "purchase_account_name",
                "item_tax_preferences [{tax_specification,tax_name}]intra",
                "item_tax_preferences [{tax_percentage}]%intra",
                "item_tax_preferences [{tax_type}]intra",
                "item_tax_preferences [{tax_specification,tax_name}]inter",
                "item_tax_preferences [{tax_percentage}]%inter",
                "item_tax_preferences [{tax_type}]inter",
                "cf_pimcore_id",
                "cf_biodegradable",
                "cf_onetimeuse",
                "cf_seo_tags",
                "cf_country_of_origin",
                "cf_client_sku_code",
                "cf_prodo_sku_id",
                "cf_model_no",
                "inventory_account_name",
                "track_batch_number",
                "item_type",
                "is_linked_with_zohocrm",
            ];
            let pimcoreKeys = [
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
                "Biodegradable",
                "OneTimeUse",
                "Tags",
                "Country",
                "ClientSKUCode",
                "SKU",
                "ModelNo"
            ];
            if (type == "L0") {
                return yield this.zohoPtype(zohoKeys, pimcoreKeys, item);
            }
            else if (type == "L0-C") {
                return yield this.zohoPtype(zohoKeys, pimcoreKeys, item);
            }
            else if (type == "L1") {
                return yield this.zohoBrandtype(zohoKeys, pimcoreKeys, item);
            }
            else if (type == "L2") {
                return yield this.zohoVarianttype(zohoKeys, pimcoreKeys, item);
            }
            else if (type == "L1-C") {
                return yield this.zohoBrandtype(zohoKeys, pimcoreKeys, item);
            }
        });
    }
    ToZohoProduct(item, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let product = yield this.mapZohoProduct(item, type);
            return product;
            let out = [];
            let token = yield this.zohoBookToken();
            out.push(product);
            let res1 = yield this.postToZoho(product, token);
            if (res1 == "INVALID_TOKEN") {
                token = yield this.zohoBookToken();
                res1 = yield this.postToZoho(product, token);
            }
            return res1;
        });
    }
    postToZoho(item, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho1 = yield node_fetch_1.default('https://books.zoho.in/api/v3/items?organization_id=60015092519', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify(item)
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            if (zoho1.message == "The item has been added.") {
                return zoho1;
            }
            else if (zoho1.code == "120124") {
                console.log("invalid data", zoho1.message);
                return item;
            }
            else if (zoho1.code == "1001") {
                let kill;
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/items?organization_id=60015092519&search_text=${item.sku}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                if (kill.items == undefined) {
                    console.log("no item found");
                    return item;
                }
                if (!(kill.items.length > 0)) {
                    return item;
                }
                let id = kill.items[0].item_id;
                let zoho5 = yield node_fetch_1.default(`https://books.zoho.in/api/v3/items/${id}?organization_id=60015092519`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Content-Length': '904'
                    },
                    body: JSON.stringify(item)
                });
                zoho5 = yield zoho5.text();
                zoho5 = JSON.parse(zoho5);
                return zoho5.message;
            }
            else if (zoho1.code == "1002") {
                return "JSON is not well formed";
            }
            else if (zoho1.code == "4") {
                console.log("invalid data in put", zoho1.message);
                return item;
            }
            if (zoho1.code == "57" || zoho1.code == "14") {
                return "INVALID_TOKEN";
            }
        });
    }
    currentPriceUpdate(product, date, price) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            product.price = price;
            product.variants[0].price = price;
            product.date = date;
            yield this.productRepository.save(product);
            return product.price;
        });
    }
    productRating(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoId = data.zohoId;
            let k = yield this.productRatingRepository.findOne({ where: { zohoId: zohoId } });
            if (k) {
                let u = yield this.userReviewRepository.findOne({ where: { zohoId: zohoId, userId: data.userId } });
                if (u) {
                    if (1 == u.rating) {
                        k.oneStar = k.oneStar - 1;
                    }
                    else if (2 == u.rating) {
                        k.twoStar = k.twoStar - 1;
                    }
                    else if (3 == u.rating) {
                        k.threeStar = k.threeStar - 1;
                    }
                    else if (4 == u.rating) {
                        k.fourStar = k.fourStar - 1;
                    }
                    else if (5 == u.rating) {
                        k.fiveStar = k.fiveStar - 1;
                    }
                    if (data.rating == 1) {
                        k.oneStar = k.oneStar + 1;
                    }
                    else if (data.rating == 2) {
                        k.twoStar = k.twoStar + 1;
                    }
                    else if (data.rating == 3) {
                        k.threeStar = k.threeStar + 1;
                    }
                    else if (data.rating == 4) {
                        k.fourStar = k.fourStar + 1;
                    }
                    else if (data.rating == 5) {
                        k.fiveStar = k.fiveStar + 1;
                    }
                    yield this.userReviewRepository.update(u.id, data);
                    yield this.productRatingRepository.update(k.id, k);
                    return yield this.calculateRating(k);
                }
                else {
                    if (data.rating == 1) {
                        k.oneStar = k.oneStar + 1;
                    }
                    else if (data.rating == 2) {
                        k.twoStar = k.twoStar + 1;
                    }
                    else if (data.rating == 3) {
                        k.threeStar = k.threeStar + 1;
                    }
                    else if (data.rating == 4) {
                        k.fourStar = k.fourStar + 1;
                    }
                    else if (data.rating == 5) {
                        k.fiveStar = k.fiveStar + 1;
                    }
                    yield this.userReviewRepository.save(data);
                    yield this.productRatingRepository.update(k.id, k);
                }
                return yield this.calculateRating(k);
            }
            else {
                let rating = {
                    zohoId: zohoId,
                    prodoId: data.prodoId,
                    oneStar: 0,
                    twoStar: 0,
                    threeStar: 0,
                    fourStar: 0,
                    fiveStar: 0,
                };
                if (data.rating == 1) {
                    rating.oneStar = rating.oneStar + 1;
                }
                else if (data.rating == 2) {
                    rating.twoStar = rating.twoStar + 1;
                }
                else if (data.rating == 3) {
                    rating.threeStar = rating.threeStar + 1;
                }
                else if (data.rating == 4) {
                    rating.fourStar = rating.fourStar + 1;
                }
                else if (data.rating == 5) {
                    rating.fiveStar = rating.fiveStar + 1;
                }
                yield this.productRatingRepository.save(rating);
                let r = yield this.userReviewRepository.findOne({ where: { zohoId: zohoId } });
                if (r) {
                    yield this.userReviewRepository.update(r.id, data);
                }
                else {
                    yield this.userReviewRepository.save(data);
                }
                return yield this.calculateRating(rating);
            }
        });
    }
    getProductRating(zohoId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let k = yield this.productRatingRepository.findOne({ where: { zohoId: zohoId } });
            if (k) {
                return yield this.calculateRating(k);
            }
            else {
                return 0;
            }
        });
    }
    getUserReview(zohoId, user_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let k = yield this.userReviewRepository.findOne({ where: { zohoId: zohoId, userId: user_id } });
            if (k) {
                return k;
            }
            else {
                return "no review";
            }
        });
    }
    calculateRating(rating) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let totalRating = 1 * rating.oneStar + 2 * rating.twoStar + 3 * rating.threeStar + 4 * rating.fourStar + 5 * rating.fiveStar;
            let totalRating1 = rating.oneStar + rating.twoStar + rating.threeStar + rating.fourStar + rating.fiveStar;
            return totalRating / totalRating1;
        });
    }
};
ProductService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(product_entity_1.Product)),
    tslib_1.__param(2, typeorm_1.InjectRepository(productRating_entity_1.ProductRating)),
    tslib_1.__param(3, typeorm_1.InjectRepository(userReview_entity_1.UserReview)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        category_service_1.CategoryService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map