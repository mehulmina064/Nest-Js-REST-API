import { CreateProductPSkuDto, UpdateProductPSkuDto } from './entity/ProductPSku.dto';
import { ProductPSkuService } from './services/productPSku.service';
import { parentSkuService } from '../parentSku/parentSku.service';
import { internalProductService } from './services/product.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class ProductPSkuController {
    private readonly parentSkuService;
    private readonly ProductPSkuService;
    private readonly internalProductService;
    private readonly zohoEmployeeService;
    constructor(parentSkuService: parentSkuService, ProductPSkuService: ProductPSkuService, internalProductService: internalProductService, zohoEmployeeService: zohoEmployeeService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./entity/ProductPSku.entity").ProductPSku[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(pSkuId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./entity/ProductPSku.entity").ProductPSku[];
    }>;
    save(role: CreateProductPSkuDto, req: any): Promise<CreateProductPSkuDto & import("./entity/ProductPSku.entity").ProductPSku>;
    update(id: string, role: UpdateProductPSkuDto, req: any): Promise<import("./entity/ProductPSku.entity").ProductPSku>;
    softDelete(id: string, req: any): Promise<string>;
}
