import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';
import { zohoEmployee } from '../internal-dashboard/zohoEmployee/zohoEmployee.entity';
declare const ILocalStrategy_base: new (...args: any[]) => Strategy;
export declare class ILocalStrategy extends ILocalStrategy_base {
    private authenticationService;
    constructor(authenticationService: AuthenticationService);
    validate(email: string, password: string): Promise<zohoEmployee>;
}
export {};
