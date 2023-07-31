"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prodoPermissionGroup_entity_1 = require("./prodoPermissionGroup.entity");
const token_entity_1 = require("../../sms/token.entity");
const common_2 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let prodoPermissionService = class prodoPermissionService {
    constructor(prodoPermissionGroupRepository, zohoTokenRepository) {
        this.prodoPermissionGroupRepository = prodoPermissionGroupRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.prodoPermissionGroupRepository.findOne(id);
            if (team) {
                return team;
            }
            else {
                return Promise.reject(new common_2.HttpException('PermissionGroup not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.prodoPermissionGroupRepository.findOne({ where: { permissionGroupName: role.permissionGroupName } });
            if (check) {
                return Promise.reject(new common_2.HttpException('PermissionGroup already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                role.status = prodoPermissionGroup_entity_1.permissionGroupStatus.ACTIVE;
                role.permissions = [];
                return yield this.prodoPermissionGroupRepository.save(role);
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoPermissionGroupRepository.findOne(id);
            if (role) {
                role.deletedAt = new Date();
                role.deletedBy = userId;
                role.status = prodoPermissionGroup_entity_1.permissionGroupStatus.DELETED;
                return yield this.prodoPermissionGroupRepository.save(role);
            }
            else {
                return Promise.reject(new common_2.HttpException('PermissionGroup not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    hardRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoPermissionGroupRepository.findOne(id);
            if (role) {
                let del = yield this.prodoPermissionGroupRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('PermissionGroup not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('PermissionGroup not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoPermissionGroupRepository.findOne(id);
            if (role) {
                let data = yield this.prodoPermissionGroupRepository.update(id, updateRole);
                let saveRole = yield this.prodoPermissionGroupRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('PermissionGroup not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.prodoPermissionGroupRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.prodoPermissionGroupRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
    check(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.prodoPermissionGroupRepository.findOne(id).then((res1) => {
                return res1;
            }).catch((err) => {
                return false;
            });
            return check;
        });
    }
    addPermissions(id, userId, permissions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let PG = yield this.prodoPermissionGroupRepository.findOne(id);
            if (PG) {
                for (let i = 0; i < permissions.length; i++) {
                    let perm = permissions[i];
                    let obj = PG.permissions.find(o => o.moduleName === perm.moduleName);
                    if (!obj) {
                        perm.createdAt = new Date();
                        perm.updatedAt = new Date();
                        PG.permissions.push(perm);
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.BAD_REQUEST,
                            error: 'This Module Permission already in permissionGroup' + perm.moduleName,
                            message: 'This Module Permission already in permissionGroup' + ",Please update from the editPermission",
                        }, common_2.HttpStatus.BAD_REQUEST);
                    }
                }
                PG.updatedBy = userId;
                PG.updatedAt = new Date();
                yield this.prodoPermissionGroupRepository.update(PG.id, PG);
                return PG;
            }
            else {
                return Promise.reject(new common_2.HttpException('PermissionGroup not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    editPermissions(id, userId, permissions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let PG = yield this.prodoPermissionGroupRepository.findOne(id);
            if (PG) {
                for (let i = 0; i < permissions.length; i++) {
                    let perm = permissions[i];
                    let obj = PG.permissions.find(o => o.moduleName === perm.moduleName);
                    if (obj) {
                        perm.createdAt = new Date();
                        perm.updatedAt = new Date();
                        permissions[i] = perm;
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.BAD_REQUEST,
                            error: 'This Module Permission not in this permissionGroup' + perm.moduleName,
                            message: 'This Module Permission not in this permissionGroup' + ",Please add from the addPermission",
                        }, common_2.HttpStatus.BAD_REQUEST);
                    }
                }
                PG.permissions = yield PG.permissions.map(obj => permissions.find(o => o.moduleName === obj.moduleName) || obj);
                PG.updatedBy = userId;
                PG.updatedAt = new Date();
                return PG;
            }
            else {
                return Promise.reject(new common_2.HttpException('PermissionGroup not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    zohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            if (!zohoToken) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'Token not found',
                    message: "Unverified",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let token = zohoToken.token;
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == 'You are not authorized to perform this operation' || kill.code == 57 || kill.code == 6041) {
                token = yield this.newZohoBookToken();
                return token;
            }
            return token;
        });
    }
    newZohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
                    'client_id': '1000.',
                    'client_secret': 'a106415659f7c06d2406f446068c1739e81174c2b7',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            zohoToken.token = token;
            yield this.zohoTokenRepository.update(zohoToken.id, zohoToken);
            return token;
        });
    }
};
prodoPermissionService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(prodoPermissionGroup_entity_1.prodoPermissionGroup)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], prodoPermissionService);
exports.prodoPermissionService = prodoPermissionService;
//# sourceMappingURL=prodoPermission.service.js.map