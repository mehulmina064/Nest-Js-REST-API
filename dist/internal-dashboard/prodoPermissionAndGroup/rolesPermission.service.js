"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prodoRolesAndPermissionGroups_entity_1 = require("./prodoRolesAndPermissionGroups.entity");
const common_2 = require("@nestjs/common");
let rolesPermissionGroupService = class rolesPermissionGroupService {
    constructor(rolesAndPermissionRepository) {
        this.rolesAndPermissionRepository = rolesAndPermissionRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.rolesAndPermissionRepository.findOne(id);
            if (team) {
                return team;
            }
            else {
                return Promise.reject(new common_2.HttpException('rolePermission not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.rolesAndPermissionRepository.findOne({ where: { roleId: role.roleId, permissionGroupId: role.permissionGroupId } });
            if (check) {
                return Promise.reject(new common_2.HttpException('rolePermission already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                return yield this.rolesAndPermissionRepository.save(role);
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.rolesAndPermissionRepository.findOne(id);
            if (role) {
                let del = yield this.rolesAndPermissionRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('rolePermission not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('rolePermission not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.rolesAndPermissionRepository.findOne(id);
            if (role) {
                let data = yield this.rolesAndPermissionRepository.update(id, updateRole);
                let saveRole = yield this.rolesAndPermissionRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('rolePermission not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.rolesAndPermissionRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.rolesAndPermissionRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
};
rolesPermissionGroupService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(prodoRolesAndPermissionGroups_entity_1.RolesAndPermission)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], rolesPermissionGroupService);
exports.rolesPermissionGroupService = rolesPermissionGroupService;
//# sourceMappingURL=rolesPermission.service.js.map