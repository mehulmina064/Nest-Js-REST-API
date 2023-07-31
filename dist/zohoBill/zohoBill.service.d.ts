import { Repository } from 'typeorm';
import { zohoBill } from './zohoBill.entity';
import { UserService } from '../users/user.service';
import { zohoToken } from '../sms/token.entity';
import { ProductService } from '../product/product.service';
import { entitiesService } from '../entities/entities.service';
import { OrganizationService } from "../organization/organization.service";
import { companyService } from "../company/company.service";
export declare class zohoBillService {
    private readonly zohoBillRepository;
    private readonly zohoTokenRepository;
    private readonly userService;
    private readonly productService;
    private readonly entitiesService;
    private readonly organizationService;
    private readonly companyService;
    constructor(zohoBillRepository: Repository<zohoBill>, zohoTokenRepository: Repository<zohoToken>, userService: UserService, productService: ProductService, entitiesService: entitiesService, organizationService: OrganizationService, companyService: companyService);
    findAll(query?: any): Promise<{
        data: zohoBill[];
        count: number;
    }>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    InventoryByID(id: any): Promise<any>;
    customerDetails(id: any): Promise<any>;
    zohoAll(page?: number): Promise<{
        count: any;
        data: any;
    }>;
    saveZohoPurchaseBill(zohoBill: zohoBill): Promise<zohoBill>;
    saveFromZohoId(id: any): Promise<zohoBill>;
    getAttachment(orderId: any): Promise<undefined>;
    Summary(id: any): Promise<undefined>;
}
