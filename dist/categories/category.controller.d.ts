import { CategoryService } from './category.service';
import { Category } from './category.entity';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    save(category: Category): Promise<Category>;
    update(id: string, category: Category): Promise<Category>;
    delete(id: any): Promise<void>;
}
