import { UserRole } from '../users/roles.constants';
export declare function Auth(...roles: UserRole[]): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol | undefined, descriptor?: TypedPropertyDescriptor<Y> | undefined) => void;
