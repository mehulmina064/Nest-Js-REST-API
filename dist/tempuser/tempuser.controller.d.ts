import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { TempuserService } from './tempuser.service';
export declare class TempuserController {
    private readonly tempuserService;
    private readonly userRepository;
    constructor(tempuserService: TempuserService, userRepository: Repository<User>);
    findAll(req: any): Promise<{
        statusCode: number;
        message: string;
        invites?: undefined;
    } | {
        statusCode: number;
        message: string;
        invites: any;
    }>;
    findOne(id: any, req: any): Promise<{
        statusCode: number;
        message: string;
        invites: any;
    } | {
        statusCode: number;
        message: string;
        invites?: undefined;
    }>;
    remove(id: any, req: any): Promise<{
        statusCode: number;
        message: string;
    } | {
        message: string;
        statusCode?: undefined;
    }>;
}
