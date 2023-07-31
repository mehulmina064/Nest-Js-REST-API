"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const base_app_dto_1 = require("../../common/base-app.dto");
class CreateEmployeeDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDto.prototype, "contactNumber", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDto.prototype, "password", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDto.prototype, "designation", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmail(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
exports.CreateEmployeeDto = CreateEmployeeDto;
//# sourceMappingURL=zohoEmployee.dto.js.map