import { User } from './../users/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './../users/user.service';
import { zohoToken } from './../sms/token.entity';
import { zohoSalesOrder } from './../sms/zohoSalesOrder.entity';
import { zohoSalesOrderByUser } from './../sms/zohoSalesOrderByUser.entity';
import { ProductService } from './../product/product.service';
import { invoicePodService } from './invoicePod.service';
export declare class invoicePodController {
    private readonly userRepository;
    private readonly zohoTokenRepository;
    private readonly zohoSalesOrderRepository;
    private readonly zohoSalesOrderByUserRepository;
    private readonly userService;
    private readonly productService;
    private readonly invoicePodService;
    constructor(userRepository: Repository<User>, zohoTokenRepository: Repository<zohoToken>, zohoSalesOrderRepository: Repository<zohoSalesOrder>, zohoSalesOrderByUserRepository: Repository<zohoSalesOrderByUser>, userService: UserService, productService: ProductService, invoicePodService: invoicePodService);
    findOne(id: string): Promise<any>;
    savePod(id: string, body: any): Promise<any>;
    renewPodLink(id: string): Promise<{
        message: string;
        status: number;
    }>;
    zohoBookTokenFarji(): Promise<any>;
    newZohoBookTokenFarji(): Promise<string>;
}
