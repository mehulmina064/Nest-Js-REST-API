"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mail_service_1 = require("../mail/mail.service");
const common_1 = require("@nestjs/common");
const get_in_touch_service_1 = require("./get-in-touch.service");
const get_in_touch_entity_1 = require("./get-in-touch.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
let GetInTouchController = class GetInTouchController {
    constructor(getInTouchService, mailService, mailTriggerService) {
        this.getInTouchService = getInTouchService;
        this.mailService = mailService;
        this.mailTriggerService = mailTriggerService;
    }
    findAll() {
        return this.getInTouchService.findAll();
    }
    findOne(id) {
        return this.getInTouchService.findOne(id);
    }
    generateTicket(getInTouch) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let subject = {
                subject: `New ${getInTouch.formType} Query from ${getInTouch.formData.fullName ? getInTouch.formData.fullName : (getInTouch.formData.name ? getInTouch.formData.name : getInTouch.formData.firstName)} `
            };
            let mailOptions = {
                TriggerName: 'getInTouch',
                doc: getInTouch.formData,
                templatevars: {
                    getInTouch: getInTouch,
                    context: 'Thank you for contacting us. We will get back to you shortly.',
                }
            };
            yield this.mailTriggerService.SendMail(mailOptions);
            if (getInTouch.formType === 'Investor Enquiries') {
                let mailOptions = {
                    TriggerName: 'getInTouchInvestor',
                    doc: subject,
                    templatevars: {
                        getInTouch: getInTouch,
                        context: 'Hello Team, \n\n' + getInTouch.formData.fullName + ' has submitted an enquiry under' + getInTouch.formType + 'Please find the details below.\n\n'
                    }
                };
                yield this.mailTriggerService.SendMail(mailOptions);
            }
            else if (getInTouch.formType === 'Supplier Enquiries') {
                let mailOptions = {
                    TriggerName: 'getInTouchSupplier',
                    doc: subject,
                    templatevars: {
                        getInTouch: getInTouch,
                        context: 'Hello Team, \n\n' + getInTouch.formData.fullName + ' has submitted an enquiry under' + getInTouch.formType + 'Please find the details below.\n\n'
                    }
                };
            }
            else if (getInTouch.formType === 'Diwali Offer') {
                let subject2 = {
                    subject: `New ${getInTouch.formType} Diwali Offer Query from ${getInTouch.formData.fullName ? getInTouch.formData.fullName : (getInTouch.formData.name ? getInTouch.formData.name : getInTouch.formData.firstName)} `
                };
                let mailOptions = {
                    TriggerName: 'diwalioffer',
                    doc: subject2,
                    templatevars: {
                        getInTouch: getInTouch,
                        context: 'Hello Team, \n\n' + getInTouch.formData.fullName + ' has submitted an enquiry under' + getInTouch.formType + 'Please find the details below.\n\n'
                    }
                };
                yield this.mailTriggerService.SendMail(mailOptions);
            }
            return yield this.getInTouchService.save(getInTouch);
        });
    }
    delete(id) {
        return this.getInTouchService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GetInTouchController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], GetInTouchController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [get_in_touch_entity_1.GetInTouch]),
    tslib_1.__metadata("design:returntype", Promise)
], GetInTouchController.prototype, "generateTicket", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GetInTouchController.prototype, "delete", null);
GetInTouchController = tslib_1.__decorate([
    common_1.Controller('get-in-touch'),
    tslib_1.__metadata("design:paramtypes", [get_in_touch_service_1.GetInTouchService,
        mail_service_1.MailService,
        mailTrigger_service_1.MailTriggerService])
], GetInTouchController);
exports.GetInTouchController = GetInTouchController;
//# sourceMappingURL=get-in-touch.controller.js.map