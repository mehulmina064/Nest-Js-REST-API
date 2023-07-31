import { User } from './user.entity';
import { Account } from '../account/account.entity';
import { Organization } from '../organization/organization.entity';
export declare class UserCreateDto {
    user: User;
    account: Account;
    organization: Organization;
}
export declare class UserUpdateDto {
    username: string;
    email: string;
}
export declare class UserDeleteDto {
    id: string;
}
export declare class UserDto {
    id: string;
    username: string;
    email: string;
    account_id: string;
    owner_id: string;
}
