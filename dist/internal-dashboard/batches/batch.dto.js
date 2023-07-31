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
class CreateBatchDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchDto.prototype, "salesOrderId", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ enum: Status }),
    tslib_1.__metadata("design:type", Object)
], CreateBatchDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchDto.prototype, "assignedTo", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchDto.prototype, "dueDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    swagger_1.ApiModelProperty({ required: false }),
    tslib_1.__metadata("design:type", String)
], CreateBatchDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true }),
    tslib_1.__metadata("design:type", String)
], CreateBatchDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ required: true, description: "Must be array", type: Fields, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], CreateBatchDto.prototype, "fields", void 0);
exports.CreateBatchDto = CreateBatchDto;
class UpdateBatchDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchDto.prototype, "salesOrderId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchDto.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ enum: Status }),
    tslib_1.__metadata("design:type", Object)
], UpdateBatchDto.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchDto.prototype, "assignedTo", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchDto.prototype, "dueDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchDto.prototype, "completionDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchDto.prototype, "description", void 0);
exports.UpdateBatchDto = UpdateBatchDto;
class CreateBatchItemConnectionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemConnectionDto.prototype, "batchId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateBatchItemConnectionDto.prototype, "batchItemId", void 0);
exports.CreateBatchItemConnectionDto = CreateBatchItemConnectionDto;
class UpdateBatchItemConnectionDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemConnectionDto.prototype, "batchId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateBatchItemConnectionDto.prototype, "batchItemId", void 0);
exports.UpdateBatchItemConnectionDto = UpdateBatchItemConnectionDto;
//# sourceMappingURL=batch.dto.js.map