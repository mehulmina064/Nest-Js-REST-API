import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../common/base-app.entity';
export declare class MailTrigger extends BaseAppEntity {
    id: ObjectID;
    name: string;
    teams: string[];
    description: string;
    type: string;
    templateName: string;
    from: string;
    subject: {
        text1: string;
        text2: string;
        text3: string;
    };
    templatevars: {
        subjectVar: {
            var1: string;
            var2: string;
        };
        bodyVar: {};
    };
}
