"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const error_log_entity_1 = require("./error-log.entity");
let ErrorLogService = class ErrorLogService {
    constructor(errorLogRepository) {
        this.errorLogRepository = errorLogRepository;
    }
    create(errorLog) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogRepository.save(errorLog);
        });
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogRepository.findOne(id);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.errorLogRepository.delete(id);
        });
    }
    update(id, errorLog) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.errorLogRepository.update(id, errorLog);
        });
    }
};
ErrorLogService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_2.InjectRepository(error_log_entity_1.ErrorLog)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository])
], ErrorLogService);
exports.ErrorLogService = ErrorLogService;
//# sourceMappingURL=error-log.service.js.map