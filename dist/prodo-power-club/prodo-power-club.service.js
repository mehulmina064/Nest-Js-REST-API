"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mail_service_1 = require("../mail/mail.service");
const typeorm_2 = require("typeorm");
const prodo_power_club_entity_1 = require("./prodo-power-club.entity");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
const crypto = require('crypto');
let ProdoPowerClubService = class ProdoPowerClubService {
    constructor(prodoPowerClubRepository, mailservice, mailTriggerService) {
        this.prodoPowerClubRepository = prodoPowerClubRepository;
        this.mailservice = mailservice;
        this.mailTriggerService = mailTriggerService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.prodoPowerClubRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.prodoPowerClubRepository.findOne(id);
        });
    }
    save(prodoPowerClub) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const powerClub = yield this.prodoPowerClubRepository.save(prodoPowerClub);
            let mailOptions = {
                TriggerName: 'newPowerClubMember',
                doc: prodoPowerClub,
                templatevars: {
                    Member: prodoPowerClub,
                    clientContext: 'Thank you for your interest in Prodo Power Club. We will be in touch shortly.',
                    prodoContext: 'Hello Team we have new Prodo Power Club Member .'
                }
            };
            this.mailTriggerService.SendMail(mailOptions);
            return powerClub;
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.prodoPowerClubRepository.findOne(id).then(result => {
                this.prodoPowerClubRepository.delete(result);
            });
        });
    }
};
ProdoPowerClubService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(prodo_power_club_entity_1.ProdoPowerClub)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        mailTrigger_service_1.MailTriggerService])
], ProdoPowerClubService);
exports.ProdoPowerClubService = ProdoPowerClubService;
//# sourceMappingURL=prodo-power-club.service.js.map