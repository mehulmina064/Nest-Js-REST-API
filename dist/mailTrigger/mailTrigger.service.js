"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mailTrigger_entity_1 = require("./mailTrigger.entity");
const mail_service_1 = require("./../mail/mail.service");
const team_entity_1 = require("./../team/team.entity");
const common_2 = require("@nestjs/common");
let MailTriggerService = class MailTriggerService {
    constructor(MailTriggerRepository, mailService, teamRepository) {
        this.MailTriggerRepository = MailTriggerRepository;
        this.mailService = mailService;
        this.teamRepository = teamRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.MailTriggerRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.MailTriggerRepository.findOne(id);
        });
    }
    save(mailTrigger) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.MailTriggerRepository.save(mailTrigger);
        });
    }
    update(id, mailTrigger) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.MailTriggerRepository.update(id, mailTrigger);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.MailTriggerRepository.delete(id);
        });
    }
    findByName(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.MailTriggerRepository.find({ where: { name: name } });
        });
    }
    SendMail(Data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("mailTrigger service-");
            let trigger = yield this.findByName(Data.TriggerName);
            if (!trigger) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Trigger not found',
                    message: "Trigger not found"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            trigger.forEach((trigger) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (trigger.type == "USER") {
                    let mail = Data.doc.email;
                    let subject = "";
                    subject += trigger.subject.text1;
                    if (trigger.templatevars.subjectVar.var1 && (trigger.templatevars.subjectVar.var1 != "")) {
                        subject += " ";
                        subject += Data.doc[trigger.templatevars.subjectVar.var1];
                        subject += " ";
                    }
                    subject += trigger.subject.text2;
                    if (trigger.templatevars.subjectVar.var2 && (trigger.templatevars.subjectVar.var2 != "")) {
                        subject += " ";
                        subject += Data.doc[trigger.templatevars.subjectVar.var2];
                        subject += " ";
                    }
                    subject += trigger.subject.text3;
                    let MailTriggerU = {
                        from: trigger.from,
                        mails: mail,
                        subject: subject,
                        template: trigger.templateName,
                        templatevars: Data.templatevars
                    };
                    console.log(MailTriggerU);
                    this.mailService.sendMailTeam(MailTriggerU);
                }
                else {
                    let TeamName = trigger.teams.map(team => team);
                    let mails = "";
                    for (let i = 0; i < TeamName.length; i++) {
                        let team = yield this.teamRepository.findOne({ where: { name: TeamName[i] } });
                        mails += team.mails;
                    }
                    let subject = "";
                    subject += trigger.subject.text1;
                    if (trigger.templatevars.subjectVar.var1 && (trigger.templatevars.subjectVar.var1 != "")) {
                        subject += " ";
                        subject += Data.doc[trigger.templatevars.subjectVar.var1];
                        subject += " ";
                    }
                    subject += trigger.subject.text2;
                    if (trigger.templatevars.subjectVar.var2 && (trigger.templatevars.subjectVar.var2 != "")) {
                        subject += " ";
                        subject += Data.doc[trigger.templatevars.subjectVar.var2];
                        subject += " ";
                    }
                    subject += trigger.subject.text3;
                    let mailTrigger = {
                        from: trigger.from,
                        mails: mails,
                        subject: subject,
                        template: trigger.templateName,
                        templatevars: Data.templatevars
                    };
                    console.log(mailTrigger);
                    this.mailService.sendMailTeam(mailTrigger);
                }
            }));
        });
    }
    getTeams(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let trigger = yield this.findOne(id);
            let teams = trigger.teams;
            let data = [];
            for (let i = 0; i < teams.length; i++) {
                let team = yield this.teamRepository.findOne({ where: { name: teams[i] } });
                data[i] = team;
            }
            return data;
        });
    }
    removeTeam(id, team) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let trigger = yield this.findOne(id);
            let teams = trigger.teams;
            let index = teams.indexOf(team);
            teams.splice(index, 1);
            trigger.teams = teams;
            yield this.save(trigger);
        });
    }
    addTeam(id, team) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let trigger = yield this.findOne(id);
            let teams = trigger.teams;
            teams.push(team);
            trigger.teams = teams;
            yield this.save(trigger);
        });
    }
    addBulkTeams(id, teams) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let trigger = yield this.findOne(id);
            let teams2 = trigger.teams;
            teams2 = teams2.concat(teams);
            let team = teams2.filter((v, i, a) => a.indexOf(v) === i);
            trigger.teams = team;
            yield this.save(trigger);
        });
    }
    removeBulkTeams(id, teams) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let trigger = yield this.findOne(id);
            let teams2 = trigger.teams;
            for (let i = 0; i < teams.length; i++) {
                let index = teams2.indexOf(teams[i]);
                teams2.splice(index, 1);
            }
            trigger.teams = teams2;
            yield this.save(trigger);
        });
    }
    removeTeamFromAll(team) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let triggers = yield this.findAll();
            for (let i = 0; i < triggers.length; i++) {
                let teams = triggers[i].teams;
                let index = teams.indexOf(team);
                teams.splice(index, 1);
                triggers[i].teams = teams;
                yield this.save(triggers[i]);
            }
        });
    }
};
MailTriggerService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(mailTrigger_entity_1.MailTrigger)),
    tslib_1.__param(2, typeorm_1.InjectRepository(team_entity_1.Team)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        typeorm_2.Repository])
], MailTriggerService);
exports.MailTriggerService = MailTriggerService;
//# sourceMappingURL=mailTrigger.service.js.map