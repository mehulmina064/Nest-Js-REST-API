import { TeamService } from './team.service';
import { Team } from './team.entity';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    findAll(): Promise<Team[]>;
    findOne(id: string): Promise<Team>;
    save(team: Team): Promise<Team>;
    update(id: string, team: Team): Promise<Team>;
    delete(id: string): Promise<void>;
    findMembers(id: string): Promise<any>;
    removeMember(id: string, memberEmail: string): Promise<void>;
    addMember(id: string, memberEmail: string): Promise<void>;
    addMembers(id: string, members: string[]): Promise<any>;
    removeMembers(id: string, members: string[]): Promise<void>;
}
