"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const setting_entity_1 = require("./setting.entity");
const crypto = require('crypto');
let SettingService = class SettingService {
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.settingRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.settingRepository.findOne(id);
        });
    }
    save(category) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.settingRepository.save(category);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.settingRepository.findOne(id).then(result => {
                this.settingRepository.delete(result);
            });
        });
    }
};
SettingService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(setting_entity_1.Setting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], SettingService);
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map