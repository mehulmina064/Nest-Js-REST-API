import { BaseAppEntity } from './../common/base-app.entity';
import { ObjectID } from 'typeorm';
export declare class GetInTouch extends BaseAppEntity {
    id: ObjectID;
    name: string;
    mobileNumber: string;
    email: string;
    organisation?: string;
    message: string;
    formName: string;
    formType: string;
    formId: string;
    formData: {};
    formIP: string;
    formUserAgent: string;
    formSubmittedBy: string;
}
