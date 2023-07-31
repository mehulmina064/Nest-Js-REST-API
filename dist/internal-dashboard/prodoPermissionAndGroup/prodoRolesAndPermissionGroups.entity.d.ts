import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare class RolesAndPermission extends BaseAppEntity {
    id: ObjectID | undefined;
    roleId?: string | "";
    permissionGroupId?: string | "";
}
