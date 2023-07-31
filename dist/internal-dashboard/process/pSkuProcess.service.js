"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const process_entity_1 = require("./process.entity");
const common_2 = require("@nestjs/common");
let PSkuProcessService = class PSkuProcessService {
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
                return Promise.reject(new common_2.HttpException('PSkuProcess not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.connectionRepository.findOne({ where: { pSkuId: role.pSkuId, processId: role.processId } });
            if (check) {
                return Promise.reject(new common_2.HttpException('PSkuProcess already exists', common_2.HttpStatus.BAD_REQUEST));
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
                    return Promise.reject(new common_2.HttpException('PSkuProcess not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('PSkuProcess not found', common_2.HttpStatus.BAD_REQUEST));
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
                return Promise.reject(new common_2.HttpException('PSkuProcess not found', common_2.HttpStatus.BAD_REQUEST));
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
PSkuProcessService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(process_entity_1.PSkuProcess)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], PSkuProcessService);
exports.PSkuProcessService = PSkuProcessService;
//# sourceMappingURL=pSkuProcess.service.js.map