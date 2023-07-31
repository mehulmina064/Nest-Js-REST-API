"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipment_entity_1 = require("./shipment.entity");
const crypto = require('crypto');
let ShipmentService = class ShipmentService {
    constructor(shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const shipments = yield this.shipmentRepository.find();
            return shipments;
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const shipment = yield this.shipmentRepository.findOne(id);
            return shipment;
        });
    }
    create(shipment) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newShipment = yield this.shipmentRepository.save(shipment);
            return newShipment;
        });
    }
    update(id, shipment) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updatedShipment = yield this.shipmentRepository.update(id, shipment);
            return updatedShipment;
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const deletedShipment = yield this.shipmentRepository.delete(id);
            return deletedShipment;
        });
    }
};
ShipmentService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(shipment_entity_1.Shipment)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.MongoRepository])
], ShipmentService);
exports.ShipmentService = ShipmentService;
//# sourceMappingURL=shipment.service.js.map