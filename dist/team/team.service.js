"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("./team.entity");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
const common_2 = require("@nestjs/common");
const user_service_1 = require("./../users/user.service");
const http = require("https");
let TeamService = class TeamService {
    constructor(TeamRepository, mailTriggerService, userService) {
        this.TeamRepository = TeamRepository;
        this.mailTriggerService = mailTriggerService;
        this.userService = userService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.TeamRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.TeamRepository.findOne(id);
        });
    }
    save(team) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!team.users) {
                team.users = [];
            }
            const teamName = yield this.TeamRepository.findOne({ name: team.name });
            if (teamName) {
                return Promise.reject(new common_2.HttpException('Team name already exists', common_2.HttpStatus.BAD_REQUEST));
            }
            else {
                let mails = team.mails;
                console.log("mails", mails);
                let uniqueMails = team.mails.filter((v, i, a) => a.indexOf(v) === i);
                console.log("un", uniqueMails);
                team.mails = uniqueMails;
                for (let i = 0; i < uniqueMails.length; i++) {
                    let user = yield this.userService.findByEmail(team.mails[i]);
                    if (!user) {
                        console.log("user not found");
                        return Promise.reject(new common_2.HttpException(`User not found on Mail-${team.mails[i]}`, common_2.HttpStatus.BAD_REQUEST));
                    }
                    else {
                        let k = yield this.userService.checkTeam(user, team.name);
                        if (k) {
                            return Promise.reject(new common_2.HttpException(`User ${user.email} already belongs to team ${team.name}`, common_2.HttpStatus.BAD_REQUEST));
                        }
                    }
                }
                for (let i = 0; i < uniqueMails.length; i++) {
                    let user = yield this.userService.findByEmail(team.mails[i]);
                    if (user) {
                        yield this.userService.updateTeam(user, team.name);
                        team.users.push(user.email);
                    }
                }
                return yield this.TeamRepository.save(team);
            }
        });
    }
    update(id, team) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (team.mails && team.users) {
                return Promise.reject(new common_2.HttpException('You can\'t able to update mails and users', common_2.HttpStatus.BAD_REQUEST));
            }
            else if (team.name) {
                const teamName = yield this.TeamRepository.findOne({ name: team.name });
                if (!teamName) {
                    return Promise.reject(new common_2.HttpException('Team name does not exists', common_2.HttpStatus.BAD_REQUEST));
                }
                else {
                    let team1 = yield this.TeamRepository.findOne({ name: team.name });
                    let mails = team1.mails;
                    for (let i = 0; i < mails.length; i++) {
                        let user = yield this.userService.findByEmail(mails[i]);
                        yield this.userService.changeTeamName(user, team1.name, team.name);
                    }
                    return this.TeamRepository.update(id, team);
                }
            }
            else {
                return this.TeamRepository.update(id, team);
            }
        });
    }
    getTeamMembers(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.TeamRepository.findOne(id);
            if (team) {
                let data = [];
                for (let i = 0; i < team.users.length; i++) {
                    let user = yield this.userService.findByEmail(team.users[i]);
                    data[i] = user;
                }
                return data;
            }
            else {
                return Promise.reject(new common_2.HttpException('Team not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    removeMember(id, userEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.TeamRepository.findOne(id);
            if (team) {
                let user = yield this.userService.findByEmail(userEmail);
                if (user) {
                    yield this.userService.removeTeam(user, team.name);
                    team.users.splice(team.users.indexOf(user.email), 1);
                    team.mails.splice(team.users.indexOf(user.email), 1);
                    yield this.TeamRepository.save(team);
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('Team not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    addMember(id, userEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.TeamRepository.findOne(id);
            if (team) {
                let user = yield this.userService.findByEmail(userEmail);
                console.log("user", user);
                if (user) {
                    yield this.userService.updateTeam(user, team.name);
                    team.users.push(user.email);
                    team.mails.push(user.email);
                    yield this.TeamRepository.save(team);
                }
                else {
                    return Promise.reject(new common_2.HttpException('User not found', common_2.HttpStatus.BAD_REQUEST));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('Team not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    addBulkMember(id, userEmails) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.TeamRepository.findOne(id);
            console.log(userEmails);
            if (team) {
                for (let i = 0; i < userEmails.length; i++) {
                    let user = yield this.userService.findByEmail(userEmails[i]);
                    if (user) {
                        console.log("user", user);
                        if (yield this.userService.checkTeam(user, team.name)) {
                            console.log("Allready in team");
                            return Promise.reject(new common_2.HttpException(`User ${user.email} already belongs to team ${team.name}`, common_2.HttpStatus.BAD_REQUEST));
                        }
                        yield this.userService.updateTeam(user, team.name);
                        team.users.push(user.email);
                        team.mails.push(user.email);
                    }
                    else {
                        return Promise.reject(new common_2.HttpException(`User ${userEmails[i]} not registered on prodo website ${team.name}`, common_2.HttpStatus.BAD_REQUEST));
                    }
                }
                return yield this.TeamRepository.save(team);
            }
            else {
                console.log("team not found");
                return Promise.reject(new common_2.HttpException('Team not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    removeBulkMember(id, userEmails) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.TeamRepository.findOne(id);
            if (team) {
                for (let i = 0; i < userEmails.length; i++) {
                    let user = yield this.userService.findByEmail(userEmails[i]);
                    if (user) {
                        yield this.userService.removeTeam(user, team.name);
                        team.users.splice(team.users.indexOf(user.email), 1);
                        team.mails.splice(team.users.indexOf(user.email), 1);
                    }
                }
                yield this.TeamRepository.save(team);
            }
            else {
                return Promise.reject(new common_2.HttpException('Team not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.TeamRepository.findOne(id);
            yield this.mailTriggerService.removeTeamFromAll(team.name);
            if (team) {
                for (let i = 0; i < team.users.length; i++) {
                    let user = yield this.userService.findByEmail(team.users[i]);
                    yield this.userService.removeTeam(user, team.name);
                }
                yield this.TeamRepository.delete(id);
            }
            else {
                return Promise.reject(new common_2.HttpException('Team not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
};
TeamService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(team_entity_1.Team)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        mailTrigger_service_1.MailTriggerService,
        user_service_1.UserService])
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map