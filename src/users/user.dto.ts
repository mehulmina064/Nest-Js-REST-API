// DTO For  ./user.entity.ts
import { User } from './user.entity';
import { Account } from '../account/account.entity';
import { Organization } from '../organization/organization.entity';
// import {ApiProperty} from '@nestjs/swagger';
export class UserCreateDto {
    user: User = new User();
    account: Account = new Account();
    organization: Organization = new Organization();
}

export class UserUpdateDto {
    username: string;
    email: string;
    
}

export class UserDeleteDto {
    id: string;
}

export class UserDto {
    id: string;
    username: string;
    email: string;
    account_id: string;
    owner_id: string;

}
