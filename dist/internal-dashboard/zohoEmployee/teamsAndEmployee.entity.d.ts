import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare enum Role {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER"
}
export declare class prodoRoles extends BaseAppEntity {
    id: ObjectID | undefined;
    teamId?: string | "";
    role: Role | undefined;
    userId?: string | "";
}
