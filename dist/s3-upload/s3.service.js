"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
const aws_sdk_1 = require("aws-sdk");
class S3Service {
    constructor() {
    }
    S3UniversalUpload(file, s3config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const s3 = new aws_sdk_1.S3();
            const uploadedImage = yield s3.upload({
                "Bucket": s3config['Bucket'],
                "Key": `${uuid_1.v4()}-${file.originalname}`,
                "Content-Type": file.mimetype,
                "Body": file.buffer,
                "ACL": s3config['ACL'],
                "Inline": s3config['Inline'],
            }).promise();
            return yield { name: file.originalname, url: uploadedImage.Location };
        });
    }
}
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map