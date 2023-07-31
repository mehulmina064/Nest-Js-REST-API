import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        id: any;
        roles: any;
        organization_id: any;
        accountId: any;
        territory_id: any;
    }>;
}
export {};
