"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tracking_entity_1 = require("./tracking.entity");
let TrackingService = class TrackingService {
    constructor(trackingRepository) {
        this.trackingRepository = trackingRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingRepository.findOne(id);
        });
    }
    save(tracking) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.trackingRepository.save(tracking);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tracking = this.trackingRepository.findOne(id).then(result => {
                this.trackingRepository.delete(result);
            });
        });
    }
};
TrackingService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(tracking_entity_1.Tracking)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TrackingService);
exports.TrackingService = TrackingService;
//# sourceMappingURL=tracking.service.js.map