"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const error_log_service_1 = require("./error-log.service");
const error_log_controller_1 = require("./error-log.controller");
const error_log_entity_1 = require("./error-log.entity");
const typeorm_1 = require("@nestjs/typeorm");
let ErrorLogModule = class ErrorLogModule {
};
ErrorLogModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([error_log_entity_1.ErrorLog])],
        providers: [error_log_service_1.ErrorLogService],
        controllers: [error_log_controller_1.ErrorLogController],
        exports: [error_log_service_1.ErrorLogService],
    })
], ErrorLogModule);
exports.ErrorLogModule = ErrorLogModule;
//# sourceMappingURL=error-log.module.js.map