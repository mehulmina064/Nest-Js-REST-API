import { AuthenticationService } from '../../authentication/authentication.service';
import { zohoEmployee } from './zohoEmployee.entity';
import { CreateEmployeeDto } from './zohoEmployee.dto';
import { zohoEmployeeService } from './zohoEmployee.service';
import { userRolesService } from '../prodoRoles/userRoles.service';
import { prodoRolesService } from '../prodoRoles/prodoRoles.service';
import { internalTeamService } from '../team/team.service';
import { userTeamService } from '../team/userTeam.service';
export declare class zohoEmployeeController {
    private readonly zohoEmployeeService;
    private readonly authService;
    private readonly userRolesService;
    private readonly prodoRolesService;
    private readonly userTeamService;
    private readonly internalTeamService;
    constructor(zohoEmployeeService: zohoEmployeeService, authService: AuthenticationService, userRolesService: userRolesService, prodoRolesService: prodoRolesService, userTeamService: userTeamService, internalTeamService: internalTeamService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isEmployee?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: zohoEmployee[];
    }>;
    getAllEmployees(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: zohoEmployee[];
    }>;
    getProfile(req: any): Promise<{
        statusCode: number;
        message: string;
        data: zohoEmployee;
    }>;
    setProfilePicture(req: any, data: any): Promise<any>;
    updateProfile(req: any, userData: Partial<zohoEmployee>): Promise<zohoEmployee | null>;
    apiCheck(req: any): Promise<{
        statusCode: number;
        message: string;
        user: any;
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: zohoEmployee;
    }>;
    findOneByEmail(email: string): Promise<{
        statusCode: number;
        message: string;
        data: zohoEmployee;
    }>;
    update(id: string, user: zohoEmployee, req: any): Promise<zohoEmployee | null>;
    zohoAll(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    GetData(s: string, userId: string): Promise<import("../prodoRoles/prodoRoles.entity").prodoRoles[] | import("../team/team.entity").internalTeam[]>;
    One(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        data: zohoEmployee;
    }>;
    updatePassword(id: string, data: any): Promise<zohoEmployee | {
        status: string;
        message: string;
    } | null>;
    login(req: any): Promise<any>;
    signUp(req: any, zohoEmployee: CreateEmployeeDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    softDelete(id: any, req: any): Promise<any>;
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
    uploadUsers(req: any, file: any): Promise<{
        status: string;
        message: string;
        users: zohoEmployee[];
    }>;
    zohoOne(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
