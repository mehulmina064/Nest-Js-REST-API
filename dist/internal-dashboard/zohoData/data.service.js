"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prodoRoles_entity_1 = require("../prodoRoles/prodoRoles.entity");
const token_entity_1 = require("../../sms/token.entity");
let zohoDataService = class zohoDataService {
    constructor(prodoRolesRepository, zohoTokenRepository) {
        this.prodoRolesRepository = prodoRolesRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
};
zohoDataService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(prodoRoles_entity_1.prodoRoles)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], zohoDataService);
exports.zohoDataService = zohoDataService;
//# sourceMappingURL=data.service.js.map