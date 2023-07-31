import { Strategy } from 'passport-jwt';
declare const IJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class IJwtStrategy extends IJwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        id: any;
        roles: any;
        zohoUserId: any;
        status: any;
    }>;
}
export {};
