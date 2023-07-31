"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const team_entity_1 = require("./team.entity");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    findAll() {
        return this.teamService.findAll();
    }
    findOne(id) {
        return this.teamService.findOne(id);
    }
    save(team) {
        return this.teamService.save(team);
    }
    update(id, team) {
        return this.teamService.update(id, team);
    }
    delete(id) {
        return this.teamService.remove(id);
    }
    findMembers(id) {
        return this.teamService.getTeamMembers(id);
    }
    removeMember(id, memberEmail) {
        return this.teamService.removeMember(id, memberEmail);
    }
    addMember(id, memberEmail) {
        console.log(memberEmail);
        return this.teamService.addMember(id, memberEmail);
    }
    addMembers(id, members) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let k = yield this.teamService.addBulkMember(id, members);
            console.log(k);
            return k;
        });
    }
    removeMembers(id, members) {
        return this.teamService.removeBulkMember(id, members);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TeamController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [team_entity_1.Team]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, team_entity_1.Team]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Get('/:id/members'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "findMembers", null);
tslib_1.__decorate([
    common_1.Delete('/:id/members/:memberEmail'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Param('memberEmail')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "removeMember", null);
tslib_1.__decorate([
    common_1.Post('/:id/members'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "addMember", null);
tslib_1.__decorate([
    common_1.Post('/:id/members/addBulk'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], TeamController.prototype, "addMembers", null);
tslib_1.__decorate([
    common_1.Post('/:id/members/removeBulk'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", void 0)
], TeamController.prototype, "removeMembers", null);
TeamController = tslib_1.__decorate([
    common_1.Controller('teams'),
    tslib_1.__metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
exports.TeamController = TeamController;
//# sourceMappingURL=team.controller.js.map