export declare class S3Service {
    [x: string]: any;
    constructor();
    S3UniversalUpload(file: any, s3config: any): Promise<{
        name: any;
        url: any;
    }>;
}
