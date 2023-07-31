import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare class UserAndRoles extends BaseAppEntity {
    id: ObjectID | undefined;
    roleId?: string | "";
    userId?: string | "";
}
