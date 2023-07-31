"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const shipment_entity_1 = require("./shipment.entity");
const shipment_service_1 = require("./shipment.service");
let ShipmentController = class ShipmentController {
    constructor(shipmentService) {
        this.shipmentService = shipmentService;
    }
    findAll() {
        return this.shipmentService.findAll();
    }
    findOne(id) {
        return this.shipmentService.findOne(id);
    }
    create(shipment) {
        return this.shipmentService.create(shipment);
    }
    update(id, shipment) {
        return this.shipmentService.update(id, shipment);
    }
    delete(id) {
        return this.shipmentService.delete(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ShipmentController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ShipmentController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shipment_entity_1.Shipment]),
    tslib_1.__metadata("design:returntype", Promise)
], ShipmentController.prototype, "create", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shipment_entity_1.Shipment]),
    tslib_1.__metadata("design:returntype", Promise)
], ShipmentController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ShipmentController.prototype, "delete", null);
ShipmentController = tslib_1.__decorate([
    common_1.Controller('shipments'),
    tslib_1.__metadata("design:paramtypes", [shipment_service_1.ShipmentService])
], ShipmentController);
exports.ShipmentController = ShipmentController;
//# sourceMappingURL=shipment.controller.js.map