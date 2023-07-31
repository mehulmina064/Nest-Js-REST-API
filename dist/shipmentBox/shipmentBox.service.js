"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipmentBox_entity_1 = require("./shipmentBox.entity");
let ShipmentBoxService = class ShipmentBoxService {
    constructor(shipmentBoxRepository) {
        this.shipmentBoxRepository = shipmentBoxRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.shipmentBoxRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.shipmentBoxRepository.findOne(id);
        });
    }
    create(shipmentBox) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.shipmentBoxRepository.save(shipmentBox);
        });
    }
    update(id, shipmentBox) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            shipmentBox.id = id;
            return yield this.shipmentBoxRepository.save(shipmentBox);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const shipmentBox = yield this.shipmentBoxRepository.findOne(id);
            const deletedShipmentBox = yield this.shipmentBoxRepository.remove(shipmentBox);
            return deletedShipmentBox;
        });
    }
};
ShipmentBoxService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(shipmentBox_entity_1.ShipmentBox)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], ShipmentBoxService);
exports.ShipmentBoxService = ShipmentBoxService;
//# sourceMappingURL=shipmentBox.service.js.map