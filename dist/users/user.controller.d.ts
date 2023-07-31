import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthenticationService } from '../authentication/authentication.service';
import { Account } from '../account/account.entity';
import { Organization } from '../organization/organization.entity';
import { UserCreateDto } from './user.dto';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthenticationService);
    findAll(req: any, query: any): Promise<any>;
    test1(req: any): Promise<any>;
    getProfile(req: any): Promise<User>;
    getReview(package_id: string, req: any, item_id: string): Promise<import("./salesOrderReview.entity").salesOrderReview | {
        userId: any;
        zohoId: any;
        comment: string;
        rating: number;
        packageId: any;
        prodoId: string;
    }>;
    postReview(req: any, data: any): Promise<{
        userId: any;
        zohoId: any;
        comment: any;
        rating: any;
        packageId: any;
        prodoId: any;
    }>;
    setProfilePicture(req: any, data: any): Promise<any>;
    updateProfile(req: any, userData: Partial<User>): Promise<import("typeorm").UpdateResult>;
    findOne(id: string): Promise<User>;
    findOneByEmail(email: string): Promise<any>;
    findOneTest(user: User): Promise<void | {
        status: string;
        message: string;
    }>;
    addUser(data: User): Promise<{
        status: string;
        message: string;
        data: User;
    }>;
    save(data: UserCreateDto): Promise<{
        "user": User;
        "account": Account;
        "organization": Organization;
    }>;
    filter(query: any): Promise<User[]>;
    getUserRoles(): Promise<string[]>;
    getAllUsers(): Promise<any>;
    update(id: string, user: User, req: any): Promise<import("typeorm").UpdateResult>;
    updatePassword(id: string, data: any): Promise<import("typeorm").UpdateResult | {
        status: string;
        message: string;
    }>;
    login(req: any): Promise<any>;
    delete(id: any): Promise<any>;
    forgotPassword(data: any): Promise<{
        status: string;
        message: string;
    }>;
    resetPassword(data: any): Promise<{
        status: string;
        message: string;
    }>;
    verifyOtp(contactNumber: string, otp: string): Promise<boolean>;
    generateOtp(contactNumber: string): Promise<{
        otp: any;
    }>;
    addRole(id: string, data: any): Promise<any>;
    addUserToOrganization(id: string, user: User, req: any): Promise<{
        status: string;
        message: string;
        user: User;
    }>;
    uploadUsers(req: any, file: any): Promise<{
        status: string;
        message: string;
        users: User[];
    }>;
    updateUserRoles(): Promise<User[]>;
    getUserCount(req: any): Promise<any>;
    getGraph(query: any): Promise<string>;
    getGraph2(query: any): Promise<void>;
    zohoTest(): Promise<any[]>;
    sendMailWithTemplate(body: any): Promise<string[]>;
    updateOldData(): Promise<({
        "error": User;
        email?: undefined;
        details?: undefined;
    } | {
        email: string | undefined;
        details: User;
        "error"?: undefined;
    })[]>;
    updateOldOrganizationsData(): Promise<any[]>;
    updateAllData(): Promise<any[]>;
    updateOneUserData(email: string): Promise<any>;
    addNewOrganization(OrganizationData: any, req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    allUsers(req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    allOrgUsers(req: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: any;
            firstName: any;
            lastName: any;
            contactNumber: any;
            email: any;
            orgIdRoles: any[];
            companyIdRoles: any[];
            entityIdRoles: any[];
        }[];
    }>;
    companyUsers(req: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: any;
            firstName: any;
            lastName: any;
            contactNumber: any;
            email: any;
            orgIdRoles: any[];
            companyIdRoles: any[];
            entityIdRoles: any[];
        }[];
    }>;
    entityUsers(req: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: any;
            firstName: any;
            lastName: any;
            contactNumber: any;
            email: any;
            orgIdRoles: any[];
            companyIdRoles: any[];
            entityIdRoles: any[];
        }[];
    }>;
    organizationswitch(req: any, id: any): Promise<{
        statusCode: number;
        message: string;
        result: any;
        updatedUser?: undefined;
    } | {
        statusCode: number;
        message: string;
        updatedUser: User;
        result?: undefined;
    } | undefined>;
    companySwitch(req: any, id: any): Promise<{
        statusCode: number;
        message: string;
        result: any;
        updatedUser?: undefined;
    } | {
        statusCode: number;
        message: string;
        updatedUser: User;
        result?: undefined;
    } | undefined>;
    entityswitch(req: any, id: any): Promise<{
        statusCode: number;
        message: string;
        result: any;
        updatedUser?: undefined;
    } | {
        statusCode: number;
        message: string;
        updatedUser: User;
        result?: undefined;
    } | undefined>;
    adminLevel(req: any, id: any, data: any): Promise<void>;
    userroleswichapi(req: any, id: any, data: any): Promise<string>;
    addingUsers(req: any, data: any, id: any): Promise<void>;
    removingUser(req: any, body: any, id: any): Promise<void>;
    inviteUser(req: any, data: any, id: any): Promise<any>;
    transferUserData(req: any, id: any, data: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            user: any;
            adminUser: any;
        };
    }>;
    invitation(req: any, body: any): Promise<{
        message: string;
        statusCode: number;
    }>;
    inviteAccept(data: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    inviteAcceptuser(data: any): Promise<any>;
}
