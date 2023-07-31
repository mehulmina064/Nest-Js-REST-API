"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_dto_1 = require("../../common/base-app.dto");
const class_validator_1 = require("class-validator");
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
    Status["DELETED"] = "DELETED";
})(Status = exports.Status || (exports.Status = {}));
var ImportanceLevel;
(function (ImportanceLevel) {
    ImportanceLevel["LOW"] = "LOW";
    ImportanceLevel["MEDIUM"] = "MEDIUM";
    ImportanceLevel["HIGH"] = "HIGH";
})(ImportanceLevel = exports.ImportanceLevel || (exports.ImportanceLevel = {}));
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
class CreateProcessDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreateProcessDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessDto.prototype, "displayName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], CreateProcessDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessDto.prototype, "minTime", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessDto.prototype, "mostFrequentTime", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessDto.prototype, "maxTime", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Array)
], CreateProcessDto.prototype, "fields", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateProcessDto.prototype, "isDefault", void 0);
exports.CreateProcessDto = CreateProcessDto;
class UpdateProcessDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateProcessDto.prototype, "name", void 0);
exports.UpdateProcessDto = UpdateProcessDto;
class CreateProcessTestDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "displayName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], CreateProcessTestDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "reason", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "method", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], CreateProcessTestDto.prototype, "instrumentUsed", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Object)
], CreateProcessTestDto.prototype, "children", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "maxTime", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "formulaUsed", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateProcessTestDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(ImportanceLevel),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty({ enum: ImportanceLevel }),
    tslib_1.__metadata("design:type", Object)
], CreateProcessTestDto.prototype, "importanceLevel", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Array)
], CreateProcessTestDto.prototype, "fields", void 0);
tslib_1.__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateProcessTestDto.prototype, "numberOfIterations", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateProcessTestDto.prototype, "isDefault", void 0);
exports.CreateProcessTestDto = CreateProcessTestDto;
class UpdateProcessTestDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateProcessTestDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", Array)
], UpdateProcessTestDto.prototype, "fields", void 0);
exports.UpdateProcessTestDto = UpdateProcessTestDto;
class CreatePSkuProcessDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreatePSkuProcessDto.prototype, "pSkuId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreatePSkuProcessDto.prototype, "processId", void 0);
exports.CreatePSkuProcessDto = CreatePSkuProcessDto;
class UpdatePSkuProcessDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdatePSkuProcessDto.prototype, "pSkuId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdatePSkuProcessDto.prototype, "processId", void 0);
exports.UpdatePSkuProcessDto = UpdatePSkuProcessDto;
//# sourceMappingURL=process.dto.js.map