import { internalTeam } from './team.entity';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
import { internalTeamService } from './team.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { userTeamService } from './userTeam.service';
export declare class prodoRolesController {
    private readonly internalTeamService;
    private readonly zohoEmployeeService;
    private readonly userTeamService;
    constructor(internalTeamService: internalTeamService, zohoEmployeeService: zohoEmployeeService, userTeamService: userTeamService);
    findAll(req: any, search?: string, status?: string, limit?: number, page?: number, isDefault?: string): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: internalTeam[];
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    save(team: CreateTeamDto, req: any): Promise<CreateTeamDto & internalTeam>;
    update(id: string, team: UpdateTeamDto, req: any): Promise<internalTeam>;
    softDelete(id: string, req: any): Promise<internalTeam>;
    hardDelete(id: string, req: any): Promise<string>;
}
