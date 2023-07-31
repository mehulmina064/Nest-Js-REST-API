import { ObjectID, Repository, FindConditions } from 'typeorm';
import { zohoEmployee } from './zohoEmployee.entity';
import { zohoToken } from '../../sms/token.entity';
import { employeeOtp } from './employeeOtp.entity';
import { MailTriggerService } from '../../mailTrigger/mailTrigger.service';
export declare class zohoEmployeeService {
    private readonly zohoEmployeeRepository;
    private readonly zohoTokenRepository;
    private readonly mailTriggerService;
    private readonly employeeOtpRepository;
    constructor(zohoEmployeeRepository: Repository<zohoEmployee>, zohoTokenRepository: Repository<zohoToken>, mailTriggerService: MailTriggerService, employeeOtpRepository: Repository<employeeOtp>);
    findAll(query?: any): Promise<{
        data: zohoEmployee[];
        count: number;
    }>;
    findByEmail(email: string): Promise<zohoEmployee | null>;
    findOne(id: string): Promise<zohoEmployee>;
    create(zohoEmployee: zohoEmployee, zohoUser: any): Promise<zohoEmployee>;
    update(id: string | number | Date | ObjectID | FindConditions<zohoEmployee> | string[] | number[] | Date[] | ObjectID[], user: Partial<zohoEmployee>, role: any): Promise<zohoEmployee | null>;
    softRemove(id: ObjectID, userId: string): Promise<any>;
    remove(id: ObjectID): Promise<any>;
    setProfilePicture(profilePicture: any, userId: string): Promise<any>;
    updatePassword(id: string | number | Date | ObjectID | FindConditions<zohoEmployee> | string[] | number[] | Date[] | ObjectID[] | undefined, user: any): Promise<zohoEmployee | {
        status: string;
        message: string;
    } | null>;
    login(user: any): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: string;
        user?: undefined;
    }>;
    generateOtp(contactNumber: string): Promise<{
        otp: any;
    }>;
    generatePassword(): Promise<any>;
    verifyOtp(contactNumber: any, otp: any): Promise<boolean>;
    forgotPassword(email: string): Promise<{
        status: string;
        message: string;
    }>;
    resetPassword(email: string, otp: string, password: string): Promise<{
        status: string;
        message: string;
    }>;
    uploadUsers(adminUser: zohoEmployee, file: any): Promise<{
        status: string;
        message: string;
        users: zohoEmployee[];
    }>;
    zohoBookToken(): Promise<any>;
    newZohoBookToken(): Promise<string>;
    InventoryByID(id: any): Promise<any>;
    getZohoEmployeeByEmail(email: string): Promise<any>;
    customerDetails(id: any): Promise<any>;
    zohoAll(page?: number): Promise<{
        count: any;
        data: any;
    }>;
    saveZohoUser(zohoEmployee: any): Promise<any>;
    saveFromZohoId(id: any): Promise<any>;
    getAttachment(orderId: any): Promise<undefined>;
    Summary(id: any): Promise<undefined>;
    check(id: string): Promise<any>;
}
