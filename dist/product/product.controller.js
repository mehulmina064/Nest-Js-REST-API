"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const category_entity_1 = require("./../categories/category.entity");
const typeorm_1 = require("typeorm");
const file_utils_1 = require("./../files/file.utils");
const multer_1 = require("multer");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const product_entity_1 = require("./product.entity");
const product_service_1 = require("./product.service");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const zohoPurchaseOrder_entity_1 = require("./../zohoPurchaseOrder/zohoPurchaseOrder.entity");
const zohoSalesOrder_entity_1 = require("./../zohoSalesOrder/zohoSalesOrder.entity");
const common_2 = require("@nestjs/common");
var request = require('request');
var fs = require('fs');
let ProductController = class ProductController {
    constructor(productService, zohoPurchaseOrderRepository, zohoSalesOrderRepository) {
        this.productService = productService;
        this.zohoPurchaseOrderRepository = zohoPurchaseOrderRepository;
        this.zohoSalesOrderRepository = zohoSalesOrderRepository;
    }
    Test() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pimAllProducts = yield this.productService.pimAllProducts();
            let products = [];
            for (let i = 0; i < pimAllProducts.length; i++) {
                if (pimAllProducts[i].type == 'L0') {
                    products.push(yield this.productService.SaveZohoProduct(pimAllProducts[i].data, 'L0'));
                }
                else if (pimAllProducts[i].type == 'L1') {
                    products.push(yield this.productService.SaveZohoProduct(pimAllProducts[i].data, 'L1'));
                }
                else if (pimAllProducts[i].type == 'L2') {
                    products.push(yield this.productService.SaveZohoProduct(pimAllProducts[i].data, 'L2'));
                }
                else if (pimAllProducts[i].type == 'L0-C') {
                    products.push(yield this.productService.SaveZohoProduct(pimAllProducts[i].data, 'L0-C'));
                }
            }
            return products;
        });
    }
    review(data, req) {
        data.userId = req.user.id;
        return this.productService.productRating(data);
    }
    getRating(zohoId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.productService.getProductRating(zohoId);
        });
    }
    getReview(id, req) {
        return this.productService.getUserReview(id, req.user.id);
    }
    fixData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = [];
            let products = yield this.productService.findAllProducts();
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                product.date = "2020-08-02";
                res.push({ name: product.productName, details: yield this.productService.update(product.id, product) });
            }
            return res;
        });
    }
    pimcoreProductSaveToZoho() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pimAllProducts = yield this.productService.pimAllProducts();
            let products = [];
            for (let i = 0; i < pimAllProducts.length; i++) {
                if (pimAllProducts[i].type == 'L0') {
                    products.push(yield this.productService.ToZohoProduct(pimAllProducts[i].data, 'L0'));
                }
                else if (pimAllProducts[i].type == 'L1') {
                    products.push(yield this.productService.ToZohoProduct(pimAllProducts[i].data, 'L1'));
                }
                else if (pimAllProducts[i].type == 'L2') {
                    products.push(yield this.productService.ToZohoProduct(pimAllProducts[i].data, 'L2'));
                }
                else if (pimAllProducts[i].type == 'L0-C') {
                    products.push(yield this.productService.ToZohoProduct(pimAllProducts[i].data, 'L0-C'));
                }
                else if (pimAllProducts[i].type == 'L1-C') {
                    products.push(yield this.productService.ToZohoProduct(pimAllProducts[i].data, 'L1-C'));
                }
            }
            return products;
        });
    }
    getProductBySku(sku) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.productService.getProductBySku(sku);
        });
    }
    pimAllProducts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pimAllProducts = yield this.productService.pimAllProducts();
            return pimAllProducts;
        });
    }
    index(page = 1, limit = 10, search = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('q', page);
            limit = limit > 100 ? 100 : limit;
            if (search) {
                const query = {
                    where: {
                        $or: [
                            { productName: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { seo: { $regex: search, $options: 'i' } },
                            { sku: { $regex: search, $options: 'i' } },
                            { zohoBooksProductId: { $regex: search, $options: 'i' } }
                        ]
                    },
                    take: 10,
                };
                const query1 = {
                    where: {
                        $or: [
                            { productName: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { seo: { $regex: search, $options: 'i' } },
                            { sku: { $regex: search, $options: 'i' } },
                            { zohoBooksProductId: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
                let items = yield typeorm_1.getMongoRepository(product_entity_1.Product).find(query);
                let total = yield typeorm_1.getMongoRepository(product_entity_1.Product).find(query1);
                let result = {
                    items: items,
                    meta: {
                        "totalItems": total.length,
                        "itemCount": 10,
                        "itemsPerPage": 10,
                        "totalPages": total.length % 10 ? ((total.length - total.length % 10) / 10) + 1 : (total.length / 10 ? total.length / 10 : 1),
                        "currentPage": 1
                    },
                    links: {
                        "first": "/products?limit=10",
                        "previous": "",
                        "next": "/products?page=2&limit=10",
                        "last": "/products?page=137&limit=10"
                    }
                };
                return result;
            }
            else {
                return this.productService.paginate({
                    page,
                    limit,
                    route: '/products',
                });
            }
        });
    }
    filteredResults(page = 1, limit = 10, category = "", search = "", fPriceMin = 0, fPriceMax = 100000, fType = "", fAttr = "", order = 1, zohoBooksProduct, readyProduct, madeToOrder, whiteLabeling) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('category', category);
            console.log('search', search);
            console.log('order', order);
            console.log('fPriceMin', fPriceMin);
            console.log('fPriceMax', fPriceMax);
            console.log('fType', fType);
            console.log('fAttr', fAttr);
            console.log('readyProduct', Boolean(readyProduct));
            console.log('madeToOrder', madeToOrder);
            console.log('whiteLabeling', whiteLabeling);
            console.log('zohoBooksProduct', zohoBooksProduct);
            limit = limit > 100 ? 100 : limit;
            const attrFilter = [];
            if (readyProduct) {
                attrFilter.push({
                    "readyProduct": Boolean(readyProduct)
                });
            }
            if (madeToOrder) {
                attrFilter.push({
                    "madeToOrder": Boolean(madeToOrder)
                });
            }
            if (whiteLabeling) {
                attrFilter.push({
                    "whiteLabeling": Boolean(whiteLabeling)
                });
            }
            if (category) {
                attrFilter.push({
                    "categoryId": category
                });
            }
            attrFilter.push({ zohoBooksProduct: { $eq: false } });
            attrFilter.push({ isVisible: { $eq: true } });
            const query = {
                where: {
                    $or: [
                        { productName: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { seo: { $regex: search, $options: 'i' } }
                    ],
                    $and: [
                        { price: { $gte: fPriceMin } },
                        { price: { $lte: fPriceMax } },
                        ...attrFilter
                    ],
                },
                order: {
                    price: order,
                },
                skip: (page - 1) * limit,
                take: limit,
            };
            return typeorm_1.getMongoRepository(product_entity_1.Product).findAndCount(query);
        });
    }
    findbyCategory(page = 1, limit = 10, categoryId) {
        limit = limit > 100 ? 100 : limit;
        return this.productService.findByCategory({
            page,
            limit,
            route: `/products/category/${categoryId}`,
        }, categoryId);
    }
    searchProductBydata(search = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const query = {
                where: {
                    $or: [
                        { productName: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { seo: { $regex: search, $options: 'i' } },
                        { sku: { $regex: search, $options: 'i' } },
                        { zohoBooksProductId: { $regex: search, $options: 'i' } }
                    ]
                }
            };
            return yield typeorm_1.getMongoRepository(product_entity_1.Product).findAndCount(query);
        });
    }
    searchProducts(page = 1, limit = 10, productName) {
        limit = limit > 100 ? 100 : limit;
        return this.productService.searchProducts({
            page,
            limit,
            route: `/products/search/${productName}`,
        }, productName);
    }
    save(product) {
        if (!product.productName) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide product name"
            }, common_2.HttpStatus.BAD_REQUEST);
        }
        if (product.variants.length < 1) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide default variant "
            }, common_2.HttpStatus.BAD_REQUEST);
        }
        if (product.productImages.length < 1) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.BAD_REQUEST,
                error: 'BAD_REQUEST',
                message: "Please Provide one image "
            }, common_2.HttpStatus.BAD_REQUEST);
        }
        return this.productService.save(product);
    }
    updatePrices() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(product_entity_1.Product).find().then(products => {
                products.forEach(product => {
                    console.log('product-old', product);
                    product.price = Number(product.price);
                    product.whiteLabeling = Boolean(product.whiteLabeling);
                    product.madeToOrder = Boolean(product.madeToOrder);
                    product.readyProduct = Boolean(product.readyProduct);
                    product.ecoFriendly = Boolean(product.ecoFriendly);
                    product.greenProduct = Boolean(product.greenProduct);
                    product.prodoExclusive = Boolean(product.prodoExclusive);
                    console.log('product', product);
                    typeorm_1.getMongoRepository(product_entity_1.Product).save(product);
                });
                return products;
            });
        });
    }
    delete(id) {
        return this.productService.remove(id);
    }
    update(id, product) {
        return this.productService.update(id, product);
    }
    bulkUpload(file) {
        return this.productService.bulkUpload(file);
    }
    getProductByCategories() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const categories = yield typeorm_1.getMongoRepository(category_entity_1.Category).find();
            const products = yield typeorm_1.getMongoRepository(product_entity_1.Product).find();
            categories.forEach(category => {
                const productsByCategory = products.filter(product => product.categoryId === category.id);
                category.products = productsByCategory;
            });
            return categories;
        });
    }
    findOne(id) {
        return this.productService.findOne(id);
    }
    combinedData(sku) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let combinedData = {
                purchaseOrders: [],
                poCount: 0,
                salesOrders: [],
                soCount: 0
            };
            let poData = yield this.zohoPurchaseOrderRepository.findAndCount(({
                "line_items.sku": sku
            }));
            combinedData.purchaseOrders = poData[0];
            combinedData.poCount = poData[1];
            let soData = yield this.zohoSalesOrderRepository.findAndCount(({
                "line_items.sku": sku
            }));
            combinedData.salesOrders = soData[0];
            combinedData.soCount = soData[1];
            let product = {
                sku: sku
            };
            let p1 = yield this.productService.getProductBySku(sku);
            if (!p1) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "Product not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            else {
                product.prodoId = p1.id;
                product.buyingPrices = [];
                product.sellingPrices = [];
                for (let s of soData[0]) {
                    let sell = s.line_items.find(s => s.sku == sku);
                    if (sell) {
                        product.sellingPrices.push({
                            sellPrice: sell.rate,
                            name: sell.name,
                            quantity: sell.quantity,
                            hsn_or_sac: sell.hsn_or_sac,
                            shipment_status: sell.shipment_status,
                            prodo_images: sell.prodo_images,
                            customerName: s.customerName,
                            customerId: s.customerId,
                            salesOrderNumber: s.salesorderNumber,
                            salesOrderId: s.salesorderId,
                            salespersonName: s.salespersonName,
                            zohoItemId: sell.item_id
                        });
                    }
                }
                for (let p of poData[0]) {
                    let purchase = p.line_items.find(p => p.sku == sku);
                    if (purchase) {
                        product.buyingPrices.push({
                            buyPrice: purchase.rate,
                            name: purchase.name,
                            quantity: purchase.quantity,
                            hsn_or_sac: purchase.hsn_or_sac,
                            vendorName: p.vendor_name,
                            vendorId: p.vendor_id,
                            purchaseOrderNumber: p.purchaseorder_number,
                            purchaseOrderId: p.purchaseorder_id,
                            zohoItemId: purchase.item_id,
                            submitted_by: p.submitted_by,
                        });
                    }
                }
            }
            return { statusCode: 200, message: "Combined Sales data for this sku", soCount: combinedData.soCount, poCount: combinedData.poCount, data: product };
        });
    }
};
tslib_1.__decorate([
    common_1.Get('Pimcore-product-save-to-prodo'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "Test", null);
tslib_1.__decorate([
    common_1.Post('review'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "review", null);
tslib_1.__decorate([
    common_1.Get('rating/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "getRating", null);
tslib_1.__decorate([
    common_1.Get('review/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "getReview", null);
tslib_1.__decorate([
    common_1.Get('fix-data'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "fixData", null);
tslib_1.__decorate([
    common_1.Get('pimcore-product-save-to-zoho'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "pimcoreProductSaveToZoho", null);
tslib_1.__decorate([
    common_1.Get('bySku/:sku'),
    tslib_1.__param(0, common_1.Param('sku')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "getProductBySku", null);
tslib_1.__decorate([
    common_1.Get('Pimcore-All-Products'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "pimAllProducts", null);
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "index", null);
tslib_1.__decorate([
    common_1.Get('filtered'),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Query('category', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(3, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(4, common_1.Query('f-price-min', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('f-price-max', new common_1.DefaultValuePipe(1000000), common_1.ParseIntPipe)),
    tslib_1.__param(6, common_1.Query('f-type', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(7, common_1.Query('f-attr', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(8, common_1.Query('orderPrice', new common_1.DefaultValuePipe(1))),
    tslib_1.__param(9, common_1.Query('zohoBooksProduct', new common_1.DefaultValuePipe(false))),
    tslib_1.__param(10, common_1.Query('readyProduct')),
    tslib_1.__param(11, common_1.Query('madeToOrder')),
    tslib_1.__param(12, common_1.Query('whiteLabeling')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String, String, Number, Number, String, String, Object, Boolean, Boolean, Boolean, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "filteredResults", null);
tslib_1.__decorate([
    common_1.Get('category/:categoryId'),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Param('categoryId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findbyCategory", null);
tslib_1.__decorate([
    common_1.Get('searchProduct'),
    tslib_1.__param(0, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "searchProductBydata", null);
tslib_1.__decorate([
    common_1.Get('search/:productName'),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Param('productName')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [product_entity_1.Product]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Get('update-prices'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "updatePrices", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, product_entity_1.Product]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Post('bulk-upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.UploadedFile()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "bulkUpload", null);
tslib_1.__decorate([
    common_1.Get('product-by-categories'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "getProductByCategories", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('sales/combinedData/:sku'),
    tslib_1.__param(0, common_1.Param('sku')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "combinedData", null);
ProductController = tslib_1.__decorate([
    common_1.Controller('products'),
    tslib_1.__param(1, typeorm_2.InjectRepository(zohoPurchaseOrder_entity_1.zohoPurchaseOrder)),
    tslib_1.__param(2, typeorm_2.InjectRepository(zohoSalesOrder_entity_1.zohoSalesOrder)),
    tslib_1.__metadata("design:paramtypes", [product_service_1.ProductService,
        typeorm_3.Repository,
        typeorm_3.Repository])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map