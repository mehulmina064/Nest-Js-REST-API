export declare class MailService {
    getHello(): string;
    sendMail(mailOptions: any): void;
    sendMailWithTemplate({ template: templateName, templatevars, ...Options }: {
        [x: string]: any;
        template: any;
        templatevars: any;
    }): void;
    getMailTemplates(): Promise<string[]>;
    sendMailTeam(mailTrigger: any): Promise<void>;
    sendBulkMail(mailTrigger: any): Promise<void>;
    sendBulkMailToManufacturer(mailTrigger: any): Promise<void>;
    sendnewOrderMail(mailTrigger: any): Promise<void>;
    inviteToProdo(userEmail: any, adminUser: any, data: any, institution: any, inviteId: any): Promise<void>;
    inviteUser(adminUser: any, user: any, type: any, data: any, institution: any, inviteId: any): Promise<void>;
}
export declare type MailOptions = {
    from: string;
    to: string;
    subject: string;
    template: string;
    templatevars: any;
};
export declare const sendMailWithTemplate: ({ template: templateName, templatevars, ...Options }: {
    [x: string]: any;
    template: any;
    templatevars: any;
}) => void;
