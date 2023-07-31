"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const white_labeling_or_rfq_service_1 = require("./white-labeling-or-rfq.service");
const white_labeling_or_rfq_entity_1 = require("./white-labeling-or-rfq.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let WhiteLabelingOrRfqController = class WhiteLabelingOrRfqController {
    constructor(whiteLabelingOrRfqService) {
        this.whiteLabelingOrRfqService = whiteLabelingOrRfqService;
    }
    findAll() {
        return this.whiteLabelingOrRfqService.findAll();
    }
    findTypeByUser(type, userId) {
        return this.whiteLabelingOrRfqService.findTypeByUser(type, userId);
    }
    findAllByUser(userId) {
        return this.whiteLabelingOrRfqService.findAllByUser(userId);
    }
    findOne(id) {
        return this.whiteLabelingOrRfqService.findOne(id);
    }
    save(category) {
        return this.whiteLabelingOrRfqService.save(category);
    }
    update(id, rfq) {
        return this.whiteLabelingOrRfqService.update(id, rfq);
    }
    delete(id) {
        return this.whiteLabelingOrRfqService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], WhiteLabelingOrRfqController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':type/user/:userId'),
    tslib_1.__param(0, common_1.Param('type')), tslib_1.__param(1, common_1.Param('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], WhiteLabelingOrRfqController.prototype, "findTypeByUser", null);
tslib_1.__decorate([
    common_1.Get('/user/:userId'),
    tslib_1.__param(0, common_1.Param('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], WhiteLabelingOrRfqController.prototype, "findAllByUser", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], WhiteLabelingOrRfqController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [white_labeling_or_rfq_entity_1.WhiteLabelingOrRfq]),
    tslib_1.__metadata("design:returntype", void 0)
], WhiteLabelingOrRfqController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, white_labeling_or_rfq_entity_1.WhiteLabelingOrRfq]),
    tslib_1.__metadata("design:returntype", void 0)
], WhiteLabelingOrRfqController.prototype, "update", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WhiteLabelingOrRfqController.prototype, "delete", null);
WhiteLabelingOrRfqController = tslib_1.__decorate([
    common_1.Controller('white-labeling-rfq'),
    tslib_1.__metadata("design:paramtypes", [white_labeling_or_rfq_service_1.WhiteLabelingOrRfqService])
], WhiteLabelingOrRfqController);
exports.WhiteLabelingOrRfqController = WhiteLabelingOrRfqController;
//# sourceMappingURL=white-labeling-or-rfq.controller.js.map