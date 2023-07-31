import { CreateUserTeamDto, UpdateUserTeamDto } from './team.dto';
import { internalTeamService } from './team.service';
import { userTeamService } from './userTeam.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
export declare class userTeamController {
    private readonly internalTeamService;
    private readonly zohoEmployeeService;
    private readonly userTeamService;
    constructor(internalTeamService: internalTeamService, zohoEmployeeService: zohoEmployeeService, userTeamService: userTeamService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("./EmployeeAndTeam.entity").UserAndTeam[];
    }>;
    findOne(id: string): Promise<any>;
    userRoles(userId: string, req: any): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: import("./EmployeeAndTeam.entity").UserAndTeam[];
    }>;
    save(team: CreateUserTeamDto, req: any): Promise<CreateUserTeamDto & import("./EmployeeAndTeam.entity").UserAndTeam>;
    update(id: string, team: UpdateUserTeamDto, req: any): Promise<import("./EmployeeAndTeam.entity").UserAndTeam>;
    softDelete(id: string, req: any): Promise<string>;
}
