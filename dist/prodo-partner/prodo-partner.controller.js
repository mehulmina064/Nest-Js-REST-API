"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mail_service_1 = require("./../mail/mail.service");
const common_1 = require("@nestjs/common");
const prodo_partner_service_1 = require("./prodo-partner.service");
const prodo_partner_entity_1 = require("./prodo-partner.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
let ProdoPartnerController = class ProdoPartnerController {
    constructor(prodoPartnerService, mailService, mailTriggerService) {
        this.prodoPartnerService = prodoPartnerService;
        this.mailService = mailService;
        this.mailTriggerService = mailTriggerService;
    }
    findAll() {
        return this.prodoPartnerService.findAll();
    }
    findOne(id) {
        return this.prodoPartnerService.findOne(id);
    }
    save(prodoPartner) {
        let mailOptions = {
            TriggerName: 'newProdoPartner',
            doc: prodoPartner,
            templatevars: {
                prodoPartner: prodoPartner,
                clientContext: 'Thank you for contacting us. We will get back to you shortly.',
                prodoContext: 'New Prodo Partner Query has been Received.'
            }
        };
        this.mailTriggerService.SendMail(mailOptions);
        return this.prodoPartnerService.save(prodoPartner);
    }
    delete(id) {
        return this.prodoPartnerService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProdoPartnerController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ProdoPartnerController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [prodo_partner_entity_1.ProdoPartner]),
    tslib_1.__metadata("design:returntype", void 0)
], ProdoPartnerController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProdoPartnerController.prototype, "delete", null);
ProdoPartnerController = tslib_1.__decorate([
    common_1.Controller('prodo-partner'),
    tslib_1.__metadata("design:paramtypes", [prodo_partner_service_1.ProdoPartnerService,
        mail_service_1.MailService,
        mailTrigger_service_1.MailTriggerService])
], ProdoPartnerController);
exports.ProdoPartnerController = ProdoPartnerController;
//# sourceMappingURL=prodo-partner.controller.js.map