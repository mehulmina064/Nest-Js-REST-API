import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/common.entity';
export declare enum AccountType {
    "INTERNAL" = "INTERNAL",
    "EXTERNAL" = "EXTERNAL"
}
export declare class Account extends BaseAppEntity {
    id: ObjectID | undefined;
    account_no: string | undefined;
    type: AccountType | undefined;
    email: string | undefined;
    status: string | undefined;
}
