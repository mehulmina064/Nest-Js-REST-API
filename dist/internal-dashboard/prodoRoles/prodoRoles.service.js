"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prodoRoles_entity_1 = require("./prodoRoles.entity");
const token_entity_1 = require("../../sms/token.entity");
const common_2 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let prodoRolesService = class prodoRolesService {
    constructor(prodoRolesRepository, zohoTokenRepository) {
        this.prodoRolesRepository = prodoRolesRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoRolesRepository.findOne(id);
            if (role) {
                return role;
            }
            else {
                return Promise.reject(new common_2.HttpException('Role not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.prodoRolesRepository.findOne({ where: { roleName: role.roleName } });
            if (check) {
                return Promise.reject(new common_2.HttpException('Role already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                role.status = prodoRoles_entity_1.roleStatus.ACTIVE;
                return yield this.prodoRolesRepository.save(role);
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoRolesRepository.findOne(id);
            if (role) {
                role.deletedAt = new Date();
                role.deletedBy = userId;
                role.status = prodoRoles_entity_1.roleStatus.DELETED;
                return yield this.prodoRolesRepository.save(role);
            }
            else {
                return Promise.reject(new common_2.HttpException('Role not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    hardRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoRolesRepository.findOne(id);
            if (role) {
                let del = yield this.prodoRolesRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('Role not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('Role not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.prodoRolesRepository.findOne(id);
            if (role) {
                let data = yield this.prodoRolesRepository.update(id, updateRole);
                let saveRole = yield this.prodoRolesRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('Role not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.prodoRolesRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.prodoRolesRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
    check(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.prodoRolesRepository.findOne(id).then((res1) => {
                return res1;
            }).catch((err) => {
                return false;
            });
            return check;
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
prodoRolesService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(prodoRoles_entity_1.prodoRoles)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], prodoRolesService);
exports.prodoRolesService = prodoRolesService;
//# sourceMappingURL=prodoRoles.service.js.map