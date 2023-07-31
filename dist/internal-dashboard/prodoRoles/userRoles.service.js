"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const EmployeeAndRoles_entity_1 = require("./EmployeeAndRoles.entity");
const token_entity_1 = require("../../sms/token.entity");
const common_2 = require("@nestjs/common");
let userRolesService = class userRolesService {
    constructor(userRolesRepository, zohoTokenRepository) {
        this.userRolesRepository = userRolesRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.userRolesRepository.findOne(id);
            if (team) {
                return team;
            }
            else {
                return Promise.reject(new common_2.HttpException('UserRole not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.userRolesRepository.findOne({ where: { roleId: role.roleId, userId: role.userId } });
            if (check) {
                return Promise.reject(new common_2.HttpException('UserRole already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                return yield this.userRolesRepository.save(role);
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.userRolesRepository.findOne(id);
            if (role) {
                let del = yield this.userRolesRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('UserRole not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('UserRole not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.userRolesRepository.findOne(id);
            if (role) {
                let data = yield this.userRolesRepository.update(id, updateRole);
                let saveRole = yield this.userRolesRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('UserRole not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.userRolesRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.userRolesRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
};
userRolesService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(EmployeeAndRoles_entity_1.UserAndRoles)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], userRolesService);
exports.userRolesService = userRolesService;
//# sourceMappingURL=userRoles.service.js.map