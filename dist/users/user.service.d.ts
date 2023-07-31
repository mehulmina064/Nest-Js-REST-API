import { Account } from './../account/account.entity';
import { ObjectID, FindConditions, Repository, FindManyOptions } from 'typeorm';
import { User } from './user.entity';
import { Permission, UserRole } from '../users/roles.constants';
import { Otp } from './otp.entity';
import { MailService } from '../mail/mail.service';
import { Organization } from '../organization/organization.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
import { dashboardData } from './dashboardData.entity';
import { ProductService } from './../product/product.service';
import { CategoryService } from './../categories/category.service';
import { salesOrderReview } from './salesOrderReview.entity';
import { OrganizationService } from './../organization/organization.service';
import { Company } from '../company/company.entity';
import { Entitie } from '../entities/entity.entity';
import { TempuserService } from '../tempuser/tempuser.service';
export declare class UserService {
    private readonly userRepository;
    private readonly otpRepository;
    private readonly mailService;
    private readonly organizationService;
    private readonly accountRepository;
    private readonly organizationRepository;
    private readonly dashboardDataRepository;
    private readonly salesOrderReviewRepository;
    private readonly mailTriggerService;
    private readonly productService;
    private readonly categoryService;
    private readonly tempUserService;
    private readonly companyRepository;
    private readonly entityRepository;
    constructor(userRepository: Repository<User>, otpRepository: Repository<Otp>, mailService: MailService, organizationService: OrganizationService, accountRepository: Repository<Account>, organizationRepository: Repository<Organization>, dashboardDataRepository: Repository<dashboardData>, salesOrderReviewRepository: Repository<salesOrderReview>, mailTriggerService: MailTriggerService, productService: ProductService, categoryService: CategoryService, tempUserService: TempuserService, companyRepository: Repository<Company>, entityRepository: Repository<Entitie>);
    findByEmail(email: string): Promise<any>;
    findAll(filter: FindManyOptions<User> | undefined): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findCombinedUserData(id: string, new_ticket: any): Promise<any>;
    getUserRoles(): Promise<string[]>;
    filter(filter: any): Promise<User[]>;
    remove(id: ObjectID): Promise<any>;
    dashboardDataDelete(id: ObjectID): Promise<true | undefined>;
    generateOtp(contactNumber: string): Promise<{
        otp: any;
    }>;
    generatePassword(): Promise<any>;
    verifyOtp(contactNumber: any, otp: any): Promise<boolean>;
    assignRoles(id: ObjectID, roles: UserRole[]): Promise<any>;
    addUser(user: User): Promise<{
        status: string;
        message: string;
        data: User;
    }>;
    save(user: User, account: Account, organization: Organization): Promise<{
        "user": User;
        "account": Account;
        "organization": Organization;
    }>;
    update(id: string | number | Date | ObjectID | FindConditions<User> | string[] | number[] | Date[] | ObjectID[], user: Partial<User>): Promise<import("typeorm/query-builder/result/UpdateResult").UpdateResult>;
    updatePassword(id: string | number | Date | ObjectID | FindConditions<User> | string[] | number[] | Date[] | ObjectID[] | undefined, user: any): Promise<import("typeorm/query-builder/result/UpdateResult").UpdateResult | {
        status: string;
        message: string;
    }>;
    login(user: any): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: string;
        user?: undefined;
    }>;
    forgotPassword(email: string): Promise<{
        status: string;
        message: string;
    }>;
    resetPassword(email: string, otp: string, password: string): Promise<{
        status: string;
        message: string;
    }>;
    updateOrganizationDomains(): Promise<{
        status: string;
        message: string;
    }>;
    createUser(user: User): Promise<{
        status: string;
        message: string;
        user: User;
    }>;
    addUserToOrganization(user: User, organizationId: string, adminUser: User): Promise<{
        status: string;
        message: string;
        user: User;
    }>;
    uploadUsers(adminUser: User, file: any): Promise<{
        status: string;
        message: string;
        users: User[];
    }>;
    saveForzoho(user: User, account: Account, organization: Organization): Promise<{
        status: string;
        message: string;
        user?: undefined;
        "account"?: undefined;
        "organization"?: undefined;
    } | {
        "user": User;
        "account": Account;
        "organization": Organization;
        status?: undefined;
        message?: undefined;
    }>;
    getUserCount(organizationId: string): Promise<User>;
    addPermission(user: User, permission: Permission): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: string;
        user?: undefined;
    }>;
    removePermission(user: User, permission: Permission): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: string;
        user?: undefined;
    }>;
    getPermissions(user: User): Promise<{
        status: string;
        message: string;
        permissions: any;
    } | {
        status: string;
        message: string;
        permissions?: undefined;
    }>;
    updateTeam(user: User, teamName: string): Promise<{
        status: string;
        message: string;
        user?: undefined;
    } | {
        status: string;
        message: string;
        user: any;
    }>;
    checkTeam(user: User, teamName: string): Promise<boolean | {
        status: string;
        message: string;
    }>;
    removeTeam(user: User, teamName: string): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: string;
        user?: undefined;
    }>;
    getTeams(user: User): Promise<{
        status: string;
        message: string;
        teams: any;
    } | {
        status: string;
        message: string;
        teams?: undefined;
    }>;
    getTeamMembers(teamName: string): Promise<{
        status: string;
        message: string;
        teamMembers: any;
    } | {
        status: string;
        message: string;
        teamMembers?: undefined;
    }>;
    changeTeamName(user: User, oldTeamName: string, newTeamName: string): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: string;
        user?: undefined;
    }>;
    zohoToken(): Promise<string>;
    deleteZohoUser(puser: User): Promise<any>;
    zohoCrmUser(item: any, token: string): Promise<any>;
    zohoWebUserUpload(user: User): Promise<any>;
    zohoWebUsersUpload(): Promise<any[]>;
    userdashboardData(user: any): Promise<any>;
    calDashboardData(user: any, salesOrders: any): Promise<import("typeorm/query-builder/result/UpdateResult").UpdateResult | ({
        userId: string;
        data: {
            orders: {
                total: number;
                completed: number;
                inProgress: number;
                submitted: number;
                cancelled: number;
            };
            rfq: {
                approved: number;
                rejected: number;
                inProgress: number;
                total_submitted: number;
            };
            payments: {
                total: number;
                paid: number;
                due: number;
            };
            pieChart: never[];
            barChart: never[];
        };
    } & dashboardData)>;
    d_data_update(data: any, orders: any): Promise<{}>;
    updatepieChart(data: any): Promise<any>;
    setPieChartCategory(data: any): Promise<{}>;
    createNewsaleOrder(user: any, salesOrder: any): Promise<string>;
    calDashboardData1(user: any, salesOrders: any): Promise<import("typeorm/query-builder/result/UpdateResult").UpdateResult | "user not admin" | "user have no orders">;
    allDashboardData(): Promise<dashboardData[]>;
    salesOrderReview(sup: any): Promise<{
        userId: any;
        zohoId: any;
        comment: any;
        rating: any;
        packageId: any;
        prodoId: any;
    }>;
    getReview(item_id: any, user_id: any, package_id: any): Promise<salesOrderReview | {
        userId: any;
        zohoId: any;
        comment: string;
        rating: number;
        packageId: any;
        prodoId: string;
    }>;
    sendMailWithTemplate(templateName: any, subject: any): Promise<string[]>;
    fixAllUsers(): Promise<({
        "error": User;
        email?: undefined;
        details?: undefined;
    } | {
        email: string | undefined;
        details: User;
        "error"?: undefined;
    })[]>;
    fixAllUsersOrganizations(): Promise<any[]>;
    findAllUsers(): Promise<User[]>;
    setProfilePicture(profilePicture: any, userId: string): Promise<any>;
    addNewOrganization(user: any, organizationData: any, userRole: string, accountId: string): Promise<{}>;
    updateData(user: any): Promise<any>;
    orgUsers(ids: any): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        contactNumber: any;
        email: any;
        orgIdRoles: any[];
        companyIdRoles: any[];
        entityIdRoles: any[];
    }[]>;
    companyUsers(ids: any): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        contactNumber: any;
        email: any;
        orgIdRoles: any[];
        companyIdRoles: any[];
        entityIdRoles: any[];
    }[]>;
    entityUsers(ids: any): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        contactNumber: any;
        email: any;
        orgIdRoles: any[];
        companyIdRoles: any[];
        entityIdRoles: any[];
    }[]>;
    makeDummyUser(email: any): Promise<any>;
    zohoPocUsers(emails: any): Promise<any[]>;
    addRole(IdRoles: [], id: string, role: string): Promise<[]>;
    addAdminRole(user: any): Promise<any>;
    addCompanyRole(user: any): Promise<any>;
    addEntityRole(user: any): Promise<any>;
    addEmployeeRole(user: any): Promise<any>;
    zohoUsersUpdate(users1: any, orgId: any, companyId: any, entityId: any): Promise<any>;
    switchupdate1(user: any): Promise<any>;
    switchupdate(user: any, id: any, authority: any, type: any): Promise<any>;
    findusers(ids: any): Promise<User[]>;
    adminLevelSwitch(type: any, check: any, user: any, adminUser: any, data: any): Promise<void>;
    switchingfunc(type: any, user: any, data: any): Promise<void>;
    superSwitch(user: any, type: any, data: any, id: any): Promise<void>;
    toAddTheUser(type: any, data: any, user: any, adminUser: any): Promise<void>;
    toDeleteUser(user: any, adminUser: any, data: any, type: any): Promise<void>;
    inviteUser(user: any, adminUser: any, data: any, type: any, id: any): Promise<any>;
    transferUserData(adminUser: any, user: any, data: any): Promise<{
        user: any;
        adminUser: any;
    }>;
    inviteUserToProdo(email: any, data: any, adminUser: any): Promise<void | {
        message: string;
    }>;
    acceptInviteNewUser(id: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    acceptInviteExistingUser(inviteId: any, userId: any): Promise<any>;
}
