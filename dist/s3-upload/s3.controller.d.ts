import { S3Service } from './s3.service';
export declare class S3Controller {
    private readonly s3service;
    constructor(s3service: S3Service);
    create(file: any, bucket: any, acl: any, inline: any): Promise<{
        name: any;
        url: any;
    }>;
}
