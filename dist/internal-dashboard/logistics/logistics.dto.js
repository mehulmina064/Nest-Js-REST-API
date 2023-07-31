"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_app_dto_1 = require("../../common/base-app.dto");
const class_validator_1 = require("class-validator");
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
    Status["DELETED"] = "DELETED";
})(Status = exports.Status || (exports.Status = {}));
class CreateLogisticDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    tslib_1.__metadata("design:type", String)
], CreateLogisticDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateLogisticDto.prototype, "displayName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateLogisticDto.prototype, "apiUrl", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateLogisticDto.prototype, "trackingUrl", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateLogisticDto.prototype, "rating", void 0);
exports.CreateLogisticDto = CreateLogisticDto;
class UpdateLogisticDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateLogisticDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(Status),
    tslib_1.__metadata("design:type", String)
], UpdateLogisticDto.prototype, "status", void 0);
exports.UpdateLogisticDto = UpdateLogisticDto;
//# sourceMappingURL=logistics.dto.js.map