"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const s3_service_1 = require("./s3.service");
const s3_controller_1 = require("./s3.controller");
const authentication_module_1 = require("../authentication/authentication.module");
let S3Module = class S3Module {
};
S3Module = tslib_1.__decorate([
    common_1.Module({
        imports: [common_1.forwardRef(() => authentication_module_1.AuthenticationModule)],
        providers: [s3_service_1.S3Service],
        controllers: [s3_controller_1.S3Controller],
        exports: [s3_service_1.S3Service],
    })
], S3Module);
exports.S3Module = S3Module;
//# sourceMappingURL=s3.module.js.map