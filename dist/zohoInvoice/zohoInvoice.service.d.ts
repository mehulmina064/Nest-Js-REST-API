import { Repository } from 'typeorm';
import { zohoInvoice } from './zohoInvoice.entity';
import { UserService } from '../users/user.service';
import { zohoToken } from '../sms/token.entity';
import { ProductService } from '../product/product.service';
import { entitiesService } from '../entities/entities.service';
import { OrganizationService } from "../organization/organization.service";
import { companyService } from "../company/company.service";
export declare class zohoInvoiceService {
    private readonly zohoInvoiceRepository;
    private readonly zohoTokenRepository;
    private readonly userService;
    private readonly productService;
    private readonly entitiesService;
    private readonly organizationService;
    private readonly companyService;
    constructor(zohoInvoiceRepository: Repository<zohoInvoice>, zohoTokenRepository: Repository<zohoToken>, userService: UserService, productService: ProductService, entitiesService: entitiesService, organizationService: OrganizationService, companyService: companyService);
    findAll(query?: any): Promise<{
        data: zohoInvoice[];
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
    saveZohoInvoice(invoice: zohoInvoice): Promise<zohoInvoice>;
    saveFromZohoId(id: any): Promise<zohoInvoice>;
    getAttachment(orderId: any): Promise<undefined>;
    Summary(id: any): Promise<undefined>;
}
