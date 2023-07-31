"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const error_log_entity_1 = require("./error-log.entity");
const error_log_service_1 = require("./error-log.service");
let ErrorLogController = class ErrorLogController {
    constructor(errorLogService) {
        this.errorLogService = errorLogService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogService.findAll();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogService.findOne(id);
        });
    }
    create(errorLog) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogService.create(errorLog);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.errorLogService.remove(id);
        });
    }
    update(id, errorLog) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogService.update(id, errorLog);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ErrorLogController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('/:id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ErrorLogController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [error_log_entity_1.ErrorLog]),
    tslib_1.__metadata("design:returntype", Promise)
], ErrorLogController.prototype, "create", null);
tslib_1.__decorate([
    common_1.Delete('/:id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ErrorLogController.prototype, "remove", null);
tslib_1.__decorate([
    common_1.Put('/:id'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, error_log_entity_1.ErrorLog]),
    tslib_1.__metadata("design:returntype", Promise)
], ErrorLogController.prototype, "update", null);
ErrorLogController = tslib_1.__decorate([
    common_1.Controller('error-log'),
    tslib_1.__metadata("design:paramtypes", [error_log_service_1.ErrorLogService])
], ErrorLogController);
exports.ErrorLogController = ErrorLogController;
//# sourceMappingURL=error-log.controller.js.map