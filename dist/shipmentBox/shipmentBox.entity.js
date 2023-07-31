"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let ShipmentBox = class ShipmentBox {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Primary key of shipment box' }),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], ShipmentBox.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box id' }),
    typeorm_1.Column({ name: 'box_id' }),
    tslib_1.__metadata("design:type", Number)
], ShipmentBox.prototype, "boxId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box name' }),
    typeorm_1.Column({ name: 'box_name' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box weight' }),
    typeorm_1.Column({ name: 'box_weight' }),
    tslib_1.__metadata("design:type", Number)
], ShipmentBox.prototype, "boxWeight", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box volume' }),
    typeorm_1.Column({ name: 'box_volume' }),
    tslib_1.__metadata("design:type", Number)
], ShipmentBox.prototype, "boxVolume", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box length' }),
    typeorm_1.Column({ name: 'box_length' }),
    tslib_1.__metadata("design:type", Number)
], ShipmentBox.prototype, "boxLength", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box width' }),
    typeorm_1.Column({ name: 'box_width' }),
    tslib_1.__metadata("design:type", Number)
], ShipmentBox.prototype, "boxWidth", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box height' }),
    typeorm_1.Column({ name: 'box_height' }),
    tslib_1.__metadata("design:type", Number)
], ShipmentBox.prototype, "boxHeight", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box weight unit' }),
    typeorm_1.Column({ name: 'box_weight_unit' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxWeightUnit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box volume unit' }),
    typeorm_1.Column({ name: 'box_volume_unit' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxVolumeUnit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box length unit' }),
    typeorm_1.Column({ name: 'box_length_unit' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxLengthUnit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box width unit' }),
    typeorm_1.Column({ name: 'box_width_unit' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxWidthUnit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box height unit' }),
    typeorm_1.Column({ name: 'box_height_unit' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxHeightUnit", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box description' }),
    typeorm_1.Column({ name: 'box_description' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxDescription", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box type' }),
    typeorm_1.Column({ name: 'box_type' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box type description' }),
    typeorm_1.Column({ name: 'box_type_description' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxTypeDescription", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box type code' }),
    typeorm_1.Column({ name: 'box_type_code' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxTypeCode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ description: 'Box type code description' }),
    typeorm_1.Column({ name: 'box_type_code_description' }),
    tslib_1.__metadata("design:type", String)
], ShipmentBox.prototype, "boxTypeCodeDescription", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Items' }),
    typeorm_1.Column({ name: 'items' }),
    tslib_1.__metadata("design:type", Array)
], ShipmentBox.prototype, "items", void 0);
ShipmentBox = tslib_1.__decorate([
    typeorm_1.Entity('shipment_box')
], ShipmentBox);
exports.ShipmentBox = ShipmentBox;
//# sourceMappingURL=shipmentBox.entity.js.map