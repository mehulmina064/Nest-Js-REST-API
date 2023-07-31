"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const setting_service_1 = require("./setting.service");
const setting_entity_1 = require("./setting.entity");
let SettingController = class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    findAll() {
        return this.settingService.findAll();
    }
    findOne(id) {
        return this.settingService.findOne(id);
    }
    save(category) {
        return this.settingService.save(category);
    }
    delete(id) {
        return this.settingService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SettingController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], SettingController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [setting_entity_1.Setting]),
    tslib_1.__metadata("design:returntype", void 0)
], SettingController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SettingController.prototype, "delete", null);
SettingController = tslib_1.__decorate([
    common_1.Controller('settings'),
    tslib_1.__metadata("design:paramtypes", [setting_service_1.SettingService])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map