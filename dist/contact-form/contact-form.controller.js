"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contact_form_service_1 = require("./contact-form.service");
const contact_form_entity_1 = require("./contact-form.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let ContactFormController = class ContactFormController {
    constructor(contactFormService) {
        this.contactFormService = contactFormService;
    }
    findAll() {
        return this.contactFormService.findAll();
    }
    findAllByType(type) {
        return this.contactFormService.findAllByType(type);
    }
    findOne(id) {
        return this.contactFormService.findOne(id);
    }
    save(Form) {
        return this.contactFormService.save(Form);
    }
    update(id, Form) {
        return this.contactFormService.update(id, Form);
    }
    delete(id) {
        return this.contactFormService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ContactFormController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('type/:type'),
    tslib_1.__param(0, common_1.Param('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ContactFormController.prototype, "findAllByType", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ContactFormController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [contact_form_entity_1.ContactForm]),
    tslib_1.__metadata("design:returntype", void 0)
], ContactFormController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, contact_form_entity_1.ContactForm]),
    tslib_1.__metadata("design:returntype", void 0)
], ContactFormController.prototype, "update", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ContactFormController.prototype, "delete", null);
ContactFormController = tslib_1.__decorate([
    common_1.Controller('contact-form'),
    tslib_1.__metadata("design:paramtypes", [contact_form_service_1.ContactFormService])
], ContactFormController);
exports.ContactFormController = ContactFormController;
//# sourceMappingURL=contact-form.controller.js.map