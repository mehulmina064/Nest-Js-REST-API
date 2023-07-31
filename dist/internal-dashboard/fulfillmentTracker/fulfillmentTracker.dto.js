"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_dto_1 = require("../../common/base-app.dto");
const class_validator_1 = require("class-validator");
var Status;
(function (Status) {
    Status["NotStarted"] = "NotStarted";
    Status["InProgress"] = "InProgress";
    Status["OnHold"] = "OnHold";
    Status["OverDue"] = "OverDue";
    Status["Complete"] = "Complete";
    Status["NeedsReview"] = "NeedsReview";
})(Status = exports.Status || (exports.Status = {}));
var DataType;
(function (DataType) {
    DataType["STRING"] = "STRING";
    DataType["NUMBER"] = "NUMBER";
    DataType["BOOLEAN"] = "BOOLEAN";
    DataType["DATE"] = "DATE";
    DataType["ANY"] = "ANY";
    DataType["FILE"] = "FILE";
})(DataType = exports.DataType || (exports.DataType = {}));
class Fields {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Fields.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Fields.prototype, "apiName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: DataType,
        default: DataType.STRING,
    }),
    tslib_1.__metadata("design:type", Object)
], Fields.prototype, "dataType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Fields.prototype, "value", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], Fields.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Date)
], Fields.prototype, "createdAt", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Date)
], Fields.prototype, "updatedAt", void 0);
exports.Fields = Fields;
class CreateFieldDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateFieldDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateFieldDto.prototype, "apiName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(DataType),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ enum: DataType }),
    tslib_1.__metadata("design:type", String)
], CreateFieldDto.prototype, "dataType", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], CreateFieldDto.prototype, "value", void 0);
exports.CreateFieldDto = CreateFieldDto;
class UpdateFieldDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateFieldDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], UpdateFieldDto.prototype, "apiName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateFieldDto.prototype, "dataType", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], UpdateFieldDto.prototype, "value", void 0);
exports.UpdateFieldDto = UpdateFieldDto;
class CreateFTDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "companyName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "customerName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "salesOrderId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "salesOrderNumber", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ enum: Status }),
    tslib_1.__metadata("design:type", Object)
], CreateFTDto.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "businessLead", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "fulfillmentLead", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "clientPurchaseOrderDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "productionDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "fulfillmentDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    swagger_1.ApiModelProperty({ required: false }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateFTDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    swagger_1.ApiModelProperty({ required: true, description: "Must be array", type: Fields, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], CreateFTDto.prototype, "fields", void 0);
exports.CreateFTDto = CreateFTDto;
class UpdateFTDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "salesOrderId", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "salesOrderNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "companyName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "customerName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ enum: Status }),
    tslib_1.__metadata("design:type", Object)
], UpdateFTDto.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "businessLead", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "fulfillmentLead", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "clientPurchaseOrderDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "productionDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "fulfillmentDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateFTDto.prototype, "description", void 0);
exports.UpdateFTDto = UpdateFTDto;
//# sourceMappingURL=fulfillmentTracker.dto.js.map