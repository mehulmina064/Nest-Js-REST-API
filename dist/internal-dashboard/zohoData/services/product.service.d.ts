import { ObjectID, Repository } from 'typeorm';
import { CategoryService } from '../../../categories/category.service';
import { Product } from '../../../product/product.entity';
import { ProductRating } from '../../../product/productRating.entity';
import { UserReview } from '../../../product/userReview.entity';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
export declare class internalProductService {
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
    currentPriceUpdate(product: any, date: any, price: any): Promise<any>;
    productRating(data: any): Promise<number>;
    getProductRating(zohoId: any): Promise<number>;
    getUserReview(zohoId: any, user_id: any): Promise<UserReview | "no review">;
    calculateRating(rating: any): Promise<number>;
    check(sku: string): Promise<boolean | Product | null>;
}
