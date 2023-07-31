"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const tracking_entity_1 = require("./tracking.entity");
const tracking_service_1 = require("./tracking.service");
let TrackingController = class TrackingController {
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingService.findAll();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingService.findOne(id);
        });
    }
    save(tracking) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingService.save(tracking);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingService.remove(id);
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TrackingController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TrackingController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [tracking_entity_1.Tracking]),
    tslib_1.__metadata("design:returntype", Promise)
], TrackingController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TrackingController.prototype, "remove", null);
TrackingController = tslib_1.__decorate([
    common_1.Controller('tracking'),
    tslib_1.__metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingController);
exports.TrackingController = TrackingController;
//# sourceMappingURL=tracking.controller.js.map