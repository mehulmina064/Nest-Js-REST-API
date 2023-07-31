"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("./team.entity");
const EmployeeAndTeam_entity_1 = require("./EmployeeAndTeam.entity");
const token_entity_1 = require("../../sms/token.entity");
const common_2 = require("@nestjs/common");
let userTeamService = class userTeamService {
    constructor(internalTeamRepository, userTeamsRepository, zohoTokenRepository) {
        this.internalTeamRepository = internalTeamRepository;
        this.userTeamsRepository = userTeamsRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.userTeamsRepository.findOne(id);
            if (team) {
                return team;
            }
            else {
                return Promise.reject(new common_2.HttpException('UserTeam not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(team) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.userTeamsRepository.findOne({ where: { teamId: team.teamId, userId: team.userId } });
            if (check) {
                return Promise.reject(new common_2.HttpException('UserTeam already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                return yield this.userTeamsRepository.save(team);
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.userTeamsRepository.findOne(id);
            if (team) {
                let del = yield this.userTeamsRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('UserTeam not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('UserTeam not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.userTeamsRepository.findOne(id);
            if (role) {
                let data = yield this.userTeamsRepository.update(id, updateRole);
                let saveRole = yield this.userTeamsRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('UserTeam not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.userTeamsRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.userTeamsRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
};
userTeamService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(team_entity_1.internalTeam)),
    tslib_1.__param(1, typeorm_1.InjectRepository(EmployeeAndTeam_entity_1.UserAndTeam)),
    tslib_1.__param(2, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], userTeamService);
exports.userTeamService = userTeamService;
//# sourceMappingURL=userTeam.service.js.map