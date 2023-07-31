"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const team_entity_1 = require("./../team/team.entity");
const mailTrigger_entity_1 = require("./mailTrigger.entity");
const mailTrigger_service_1 = require("./mailTrigger.service");
const mail_service_1 = require("./../mail/mail.service");
const typeorm_2 = require("typeorm");
let MailTriggerController = class MailTriggerController {
    constructor(teamRepository, mailTriggerService, mailService) {
        this.teamRepository = teamRepository;
        this.mailTriggerService = mailTriggerService;
        this.mailService = mailService;
    }
    findAll() {
        console.log("mailTrigger in controller-");
        return this.mailTriggerService.findAll();
    }
    findOne(id) {
        return this.mailTriggerService.findOne(id);
    }
    save(mailTrigger) {
        return this.mailTriggerService.save(mailTrigger);
    }
    update(id, mailTrigger) {
        return this.mailTriggerService.update(id, mailTrigger);
    }
    delete(id) {
        return this.mailTriggerService.remove(id);
    }
    findMembers(id) {
        return this.mailTriggerService.getTeams(id);
    }
    removeMember(id, teamName) {
        return this.mailTriggerService.removeTeam(id, teamName);
    }
    addMember(id, teamId) {
        return this.mailTriggerService.addTeam(id, teamId);
    }
    addMembers(id, teamIds) {
        return this.mailTriggerService.addBulkTeams(id, teamIds);
    }
    removeMembers(id, teamIds) {
        return this.mailTriggerService.removeBulkTeams(id, teamIds);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MailTriggerController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [mailTrigger_entity_1.MailTrigger]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, mailTrigger_entity_1.MailTrigger]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Get('/:id/Teams'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "findMembers", null);
tslib_1.__decorate([
    common_1.Delete('/:id/Teams/:teamName'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Param('teamName')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "removeMember", null);
tslib_1.__decorate([
    common_1.Post('/:id/Teams'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "addMember", null);
tslib_1.__decorate([
    common_1.Post('/:id/Teams/addBulk'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "addMembers", null);
tslib_1.__decorate([
    common_1.Post('/:id/Teams/removeBulk'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", void 0)
], MailTriggerController.prototype, "removeMembers", null);
MailTriggerController = tslib_1.__decorate([
    common_1.Controller('MailTrigger'),
    tslib_1.__param(0, typeorm_1.InjectRepository(team_entity_1.Team)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        mailTrigger_service_1.MailTriggerService,
        mail_service_1.MailService])
], MailTriggerController);
exports.MailTriggerController = MailTriggerController;
//# sourceMappingURL=mailTrigger.controller.js.map