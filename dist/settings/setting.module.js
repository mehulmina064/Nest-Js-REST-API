"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const setting_entity_1 = require("./setting.entity");
const setting_service_1 = require("./setting.service");
const setting_controller_1 = require("./setting.controller");
let SettingModule = class SettingModule {
};
SettingModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([setting_entity_1.Setting])],
        providers: [setting_service_1.SettingService],
        controllers: [setting_controller_1.SettingController],
    })
], SettingModule);
exports.SettingModule = SettingModule;
//# sourceMappingURL=setting.module.js.map