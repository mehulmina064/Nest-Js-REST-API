import { Category } from './../categories/category.entity';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { zohoPurchaseOrder } from './../zohoPurchaseOrder/zohoPurchaseOrder.entity';
import { zohoSalesOrder } from './../zohoSalesOrder/zohoSalesOrder.entity';
export declare class ProductController {
    private readonly productService;
    private readonly zohoPurchaseOrderRepository;
    private readonly zohoSalesOrderRepository;
    constructor(productService: ProductService, zohoPurchaseOrderRepository: Repository<zohoPurchaseOrder>, zohoSalesOrderRepository: Repository<zohoSalesOrder>);
    Test(): Promise<({
        'status': string;
        'message': string;
        'data': any;
    } | undefined)[]>;
    review(data: any, req: any): Promise<number>;
    getRating(zohoId: string): Promise<number>;
    getReview(id: string, req: any): Promise<import("./userReview.entity").UserReview | "no review">;
    fixData(): Promise<{
        name: string;
        details: Product;
    }[]>;
    pimcoreProductSaveToZoho(): Promise<any[]>;
    getProductBySku(sku: string): Promise<false | Product>;
    pimAllProducts(): Promise<{
        type: string;
        data: any;
    }[]>;
    index(page?: number, limit?: number, search?: string): Promise<Pagination<Product>>;
    filteredResults(page: number | undefined, limit: number | undefined, category: string | undefined, search: string | undefined, fPriceMin: number | undefined, fPriceMax: number | undefined, fType: string | undefined, fAttr: string | undefined, order: any, zohoBooksProduct: true, readyProduct: boolean, madeToOrder: boolean, whiteLabeling: boolean): Promise<[Product[], number]>;
    findbyCategory(page: number | undefined, limit: number | undefined, categoryId: string): Promise<Pagination<Product>>;
    searchProductBydata(search?: string): Promise<[Product[], number]>;
    searchProducts(page: number | undefined, limit: number | undefined, productName: string): Promise<Pagination<Product>>;
    save(product: Product): Promise<Product>;
    updatePrices(): Promise<Product[]>;
    delete(id: any): Promise<any>;
    update(id: string, product: Product): Promise<Product>;
    bulkUpload(file: any): Promise<any[]>;
    getProductByCategories(): Promise<Category[]>;
    findOne(id: string): Promise<Product>;
    combinedData(sku: string): Promise<{
        statusCode: number;
        message: string;
        soCount: number;
        poCount: number;
        data: {
            sku: string;
        };
    }>;
}
