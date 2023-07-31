"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const batch_entity_1 = require("./batch.entity");
const common_2 = require("@nestjs/common");
let batchItemConnectionService = class batchItemConnectionService {
    constructor(connectionRepository) {
        this.connectionRepository = connectionRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.connectionRepository.findOne(id);
            if (team) {
                return team;
            }
            else {
                return Promise.reject(new common_2.HttpException('BatchItemConnection not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.connectionRepository.findOne({ where: { batchId: role.batchId, batchItemId: role.batchItemId } });
            if (check) {
                return Promise.reject(new common_2.HttpException('BatchItemConnection already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                return yield this.connectionRepository.save(role);
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.connectionRepository.findOne(id);
            if (role) {
                let del = yield this.connectionRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('BatchItemConnection not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('BatchItemConnection not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.connectionRepository.findOne(id);
            if (role) {
                let data = yield this.connectionRepository.update(id, updateRole);
                let saveRole = yield this.connectionRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('BatchItemConnection not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.connectionRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.connectionRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
};
batchItemConnectionService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(batch_entity_1.BatchItemConnection)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], batchItemConnectionService);
exports.batchItemConnectionService = batchItemConnectionService;
//# sourceMappingURL=batchItemConnection.service.js.map