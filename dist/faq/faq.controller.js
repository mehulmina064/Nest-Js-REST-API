"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const faq_service_1 = require("./faq.service");
const faq_entity_1 = require("./faq.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let FaqController = class FaqController {
    constructor(faqService) {
        this.faqService = faqService;
    }
    findAll() {
        return this.faqService.findAll();
    }
    findAllByType(type) {
        return this.faqService.findAllByType(type);
    }
    findOne(id) {
        return this.faqService.findOne(id);
    }
    save(faq) {
        return this.faqService.save(faq);
    }
    update(id, faq) {
        return this.faqService.update(id, faq);
    }
    delete(id) {
        return this.faqService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FaqController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('type/:type'),
    tslib_1.__param(0, common_1.Param('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FaqController.prototype, "findAllByType", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], FaqController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [faq_entity_1.Faq]),
    tslib_1.__metadata("design:returntype", void 0)
], FaqController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, faq_entity_1.Faq]),
    tslib_1.__metadata("design:returntype", void 0)
], FaqController.prototype, "update", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FaqController.prototype, "delete", null);
FaqController = tslib_1.__decorate([
    common_1.Controller('faq'),
    tslib_1.__metadata("design:paramtypes", [faq_service_1.FaqService])
], FaqController);
exports.FaqController = FaqController;
//# sourceMappingURL=faq.controller.js.map