import { ObjectID, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CategoryService } from '../categories/category.service';
import { ProductRating } from './productRating.entity';
import { UserReview } from './userReview.entity';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
export declare class ProductService {
    private readonly productRepository;
    private readonly categoryService;
    private readonly productRatingRepository;
    private readonly userReviewRepository;
    [x: string]: any;
    constructor(productRepository: Repository<Product>, categoryService: CategoryService, productRatingRepository: Repository<ProductRating>, userReviewRepository: Repository<UserReview>);
    findByCategory12(id: any): Promise<Product[]>;
    paginate(options: IPaginationOptions): Promise<Pagination<Product>>;
    findAllProducts(): Promise<Product[]>;
    findAll(paginatedProduct: any): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    save(product: Product): Promise<Product>;
    update(id: any, product: Partial<Product>): Promise<Product>;
    remove(id: ObjectID): Promise<any>;
    getProductBySku(sku: string): Promise<false | Product>;
    findByCategory(options: IPaginationOptions, categoryId: string): Promise<Pagination<Product>>;
    searchProducts(options: IPaginationOptions, productName: string): Promise<Pagination<Product>>;
    findCategoryId(categoryName: string): Promise<string>;
    bulkUpload(file: any): Promise<any[]>;
    clear(): Promise<Product[]>;
    SaveZohoProduct(item: any, type: any): Promise<{
        'status': string;
        'message': string;
        'data': any;
    } | undefined>;
    pim_product_save_update(product: any): Promise<{
        'status': string;
        'message': string;
        'data': any;
    }>;
    removeNull(item: any): Promise<{}>;
    getDescription(description: any): Promise<string>;
    addvariants(product: any, item: any): Promise<any>;
    addvariant(product: any, item: any): Promise<any>;
    getPimData(): Promise<any>;
    getPimProducts(kill: any): Promise<{
        type: string;
        data: any;
    }[]>;
    pimAllProducts(): Promise<{
        type: string;
        data: any;
    }[]>;
    fixData(): Promise<Product | {
        "hello": string;
    }[]>;
    zohoPtype(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    }>;
    zohoBrandtype(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    }>;
    zohoVarianttype(zohoKeys: string[], pimcoreKeys: string[], item: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    }>;
    zohoBookToken(): Promise<string>;
    mapZohoProduct(item: any, type: any): Promise<{
        "custom_fields": never[];
        "item_tax_preferences": {
            "tax_specification": string;
            "tax_id": string;
        }[];
        "package_details": {
            "length": string;
            "width": string;
            "height": string;
            "weight": string;
            "weight_unit": string;
            "dimension_unit": string;
        };
    } | undefined>;
    ToZohoProduct(item: any, type: any): Promise<any>;
    postToZoho(item: any, token: string): Promise<any>;
    currentPriceUpdate(product: any, date: any, price: any): Promise<any>;
    productRating(data: any): Promise<number>;
    getProductRating(zohoId: any): Promise<number>;
    getUserReview(zohoId: any, user_id: any): Promise<UserReview | "no review">;
    calculateRating(rating: any): Promise<number>;
}
