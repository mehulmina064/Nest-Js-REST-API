import { Repository } from 'typeorm';
import { zohoPurchaseOrder } from './zohoPurchaseOrder.entity';
import { UserService } from './../users/user.service';
import { zohoToken } from './../sms/token.entity';
import { ProductService } from './../product/product.service';
import { entitiesService } from './../entities/entities.service';
import { OrganizationService } from "./../organization/organization.service";
import { companyService } from "./../company/company.service";
export declare class zohoPurchaseOrderService {
    private readonly zohoPurchaseOrderRepository;
    private readonly zohoTokenRepository;
    private readonly userService;
    private readonly productService;
    private readonly entitiesService;
    private readonly organizationService;
    private readonly companyService;
    constructor(zohoPurchaseOrderRepository: Repository<zohoPurchaseOrder>, zohoTokenRepository: Repository<zohoToken>, userService: UserService, productService: ProductService, entitiesService: entitiesService, organizationService: OrganizationService, companyService: companyService);
    findAll(query?: any): Promise<{
        data: zohoPurchaseOrder[];
        count: number;
    }>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    InventoryPorByID(id: any): Promise<any>;
    customerDetails(id: any): Promise<any>;
    zohoAllPo(page?: number): Promise<{
        count: any;
        data: any;
    }>;
    saveZohoPurchaseOrder(salesOrder: zohoPurchaseOrder): Promise<zohoPurchaseOrder>;
    saveFromZohoId(id: any): Promise<zohoPurchaseOrder>;
    getAttachment(orderId: any): Promise<undefined>;
    OrderSummary(id: any): Promise<undefined>;
}
