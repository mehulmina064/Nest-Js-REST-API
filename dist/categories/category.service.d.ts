import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    paginate(options: IPaginationOptions): Promise<Pagination<Category>>;
    findAll(): Promise<Category[]>;
    findByParent(parent: string): Promise<Category[]>;
    categoryName(id: string): Promise<string>;
    findOne(id: string): Promise<Category>;
    findCategoryId(categoryName: string): Promise<string>;
    save(category: Category): Promise<Category>;
    update(id: any, category: Partial<Category>): Promise<Category>;
    remove(id: any): Promise<void>;
    findByCategoryName(categoryName: string): Promise<string | null>;
}
