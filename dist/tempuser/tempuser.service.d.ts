import { Repository } from 'typeorm';
import { Tempuser } from './tempuser.entity';
export declare class TempuserService {
    private readonly tempUserRepository;
    constructor(tempUserRepository: Repository<Tempuser>);
    findAll(): Promise<{
        statusCode: number;
        message: string;
        invites: Tempuser[];
    } | {
        statusCode: number;
        message: string;
        invites?: undefined;
    }>;
    findUserInvites(user: any): Promise<{
        statusCode: number;
        message: string;
        invites: any;
    } | {
        statusCode: number;
        message: string;
        invites?: undefined;
    }>;
    newInvitesave(data: any, adminuser: any): Promise<Tempuser>;
    InviteEditNewUser(id: any): Promise<Tempuser>;
    findOne(id: any): Promise<any>;
    remove(id: any, user: any): Promise<{
        statusCode: number;
        message: string;
    } | {
        message: string;
        statusCode?: undefined;
    }>;
    existingInvite(data: any, adminUser: any, user: any, type: any): Promise<Tempuser | {
        message: string;
    }>;
    statusChange(tempUser: any): Promise<void>;
}
