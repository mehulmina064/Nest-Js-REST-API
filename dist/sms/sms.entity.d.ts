import { ObjectID } from 'typeorm';
import { BaseAppEntity } from './../common/base-app.entity';
export declare class SmsTemplate extends BaseAppEntity {
    id: ObjectID;
    mobile: string;
    template_id: string;
    authkey: string;
}
