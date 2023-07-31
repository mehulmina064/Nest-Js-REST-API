import { Repository } from 'typeorm';
import { ProductPSku } from '../entity/ProductPSku.entity';
import { CreateProductPSkuDto } from '../entity/ProductPSku.dto';
export declare class ProductPSkuService {
    private readonly connectionRepository;
    constructor(connectionRepository: Repository<ProductPSku>);
    findOne(id: string): Promise<any>;
    save(role: CreateProductPSkuDto): Promise<CreateProductPSkuDto & ProductPSku>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<ProductPSku>): Promise<ProductPSku>;
    findAll(query?: any): Promise<{
        data: ProductPSku[];
        count: number;
    }>;
}
