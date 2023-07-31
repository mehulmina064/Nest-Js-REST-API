"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const XLSX = require("xlsx");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_service_1 = require("../../../categories/category.service");
const typeorm_3 = require("typeorm");
const product_entity_1 = require("../../../product/product.entity");
const productRating_entity_1 = require("../../../product/productRating.entity");
const userReview_entity_1 = require("../../../product/userReview.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const crypto = require('crypto');
const node_fetch_1 = require("node-fetch");
let internalProductService = class internalProductService {
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
    check(sku) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.productRepository.findOne({ where: { zohoBooksProductId: sku } }).then((res1) => {
                return res1;
            }).catch((err) => {
                return false;
            });
            return check;
        });
    }
};
internalProductService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(product_entity_1.Product)),
    tslib_1.__param(2, typeorm_1.InjectRepository(productRating_entity_1.ProductRating)),
    tslib_1.__param(3, typeorm_1.InjectRepository(userReview_entity_1.UserReview)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        category_service_1.CategoryService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], internalProductService);
exports.internalProductService = internalProductService;
//# sourceMappingURL=product.service.js.map