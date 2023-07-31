import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../common/base-app.entity';
export declare class UserAndTeam extends BaseAppEntity {
    id: ObjectID | undefined;
    teamId?: string | "";
    userId?: string | "";
}
