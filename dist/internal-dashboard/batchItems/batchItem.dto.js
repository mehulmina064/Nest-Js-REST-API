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
    tslib_1.__metadata("design:type", String)
], CreateFieldDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreateFieldDto.prototype, "apiName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(DataType),
    class_validator_1.IsNotEmpty(),
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
class CreateBatchItemDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "itemId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "batchId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "purchaseOrderId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "sku", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], CreateBatchItemDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "assignedTo", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "dueDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Object)
], CreateBatchItemDto.prototype, "quantity", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Array)
], CreateBatchItemDto.prototype, "fields", void 0);
exports.CreateBatchItemDto = CreateBatchItemDto;
class UpdateBatchItemDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemDto.prototype, "itemId", void 0);
exports.UpdateBatchItemDto = UpdateBatchItemDto;
class CreateBatchItemProcessDto extends base_app_dto_1.BaseCreateDto {
    constructor() {
        super(...arguments);
        this.details = {};
    }
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemProcessDto.prototype, "batchItemId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemProcessDto.prototype, "processId", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ enum: Status }),
    tslib_1.__metadata("design:type", Object)
], CreateBatchItemProcessDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemProcessDto.prototype, "assignedTo", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemProcessDto.prototype, "dueDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemProcessDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ isArray: true, description: "string of link", type: String }),
    tslib_1.__metadata("design:type", Array)
], CreateBatchItemProcessDto.prototype, "documents", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemProcessDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Object)
], CreateBatchItemProcessDto.prototype, "details", void 0);
exports.CreateBatchItemProcessDto = CreateBatchItemProcessDto;
class UpdateBatchItemProcessDto extends base_app_dto_1.BaseCreateDto {
    constructor() {
        super(...arguments);
        this.details = {};
    }
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemProcessDto.prototype, "batchItemId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemProcessDto.prototype, "processId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Object)
], UpdateBatchItemProcessDto.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemProcessDto.prototype, "assignedTo", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemProcessDto.prototype, "dueDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemProcessDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ isArray: true }),
    tslib_1.__metadata("design:type", Array)
], UpdateBatchItemProcessDto.prototype, "documents", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemProcessDto.prototype, "description", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Object)
], UpdateBatchItemProcessDto.prototype, "details", void 0);
exports.UpdateBatchItemProcessDto = UpdateBatchItemProcessDto;
//# sourceMappingURL=batchItem.dto.js.map