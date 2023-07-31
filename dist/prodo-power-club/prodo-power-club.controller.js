"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prodo_power_club_service_1 = require("./prodo-power-club.service");
const prodo_power_club_entity_1 = require("./prodo-power-club.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let ProdoPowerClubController = class ProdoPowerClubController {
    constructor(prodoPartnerService) {
        this.prodoPartnerService = prodoPartnerService;
    }
    findAll() {
        return this.prodoPartnerService.findAll();
    }
    findOne(id) {
        return this.prodoPartnerService.findOne(id);
    }
    save(prodoPowerClub) {
        return this.prodoPartnerService.save(prodoPowerClub);
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
], ProdoPowerClubController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ProdoPowerClubController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [prodo_power_club_entity_1.ProdoPowerClub]),
    tslib_1.__metadata("design:returntype", void 0)
], ProdoPowerClubController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProdoPowerClubController.prototype, "delete", null);
ProdoPowerClubController = tslib_1.__decorate([
    common_1.Controller('prodo-partner'),
    tslib_1.__metadata("design:paramtypes", [prodo_power_club_service_1.ProdoPowerClubService])
], ProdoPowerClubController);
exports.ProdoPowerClubController = ProdoPowerClubController;
//# sourceMappingURL=prodo-power-club.controller.js.map