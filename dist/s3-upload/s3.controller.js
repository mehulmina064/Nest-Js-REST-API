"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const s3_service_1 = require("./s3.service");
var request = require('request');
var fs = require('fs');
let S3Controller = class S3Controller {
    constructor(s3service) {
        this.s3service = s3service;
    }
    create(file, bucket, acl, inline) {
        let s3config = {
            Bucket: bucket ? bucket : process.env.AWS_S3_BUCKET_NAME,
            ACL: acl ? acl : 'public-read',
            Inline: inline ? inline : true,
        };
        return this.s3service.S3UniversalUpload(file, s3config);
    }
};
tslib_1.__decorate([
    common_1.Post('Universal'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    tslib_1.__param(0, common_1.UploadedFile()), tslib_1.__param(1, common_1.Body('Bucket')), tslib_1.__param(2, common_1.Body('ACL')), tslib_1.__param(3, common_1.Body('Inline')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], S3Controller.prototype, "create", null);
S3Controller = tslib_1.__decorate([
    common_1.Controller('s3'),
    tslib_1.__metadata("design:paramtypes", [s3_service_1.S3Service])
], S3Controller);
exports.S3Controller = S3Controller;
//# sourceMappingURL=s3.controller.js.map