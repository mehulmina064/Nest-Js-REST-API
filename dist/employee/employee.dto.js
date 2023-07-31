"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
class EmployeeCreateDto {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Number)
], EmployeeCreateDto.prototype, "age", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Number)
], EmployeeCreateDto.prototype, "salary", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "department", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "designation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "joiningDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "city", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "state", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "country", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeCreateDto.prototype, "zipCode", void 0);
exports.EmployeeCreateDto = EmployeeCreateDto;
class EmployeeUpdateDto {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Number)
], EmployeeUpdateDto.prototype, "age", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Number)
], EmployeeUpdateDto.prototype, "salary", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "department", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "designation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "joiningDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "city", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "state", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "country", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeUpdateDto.prototype, "zipCode", void 0);
exports.EmployeeUpdateDto = EmployeeUpdateDto;
class EmployeeDto {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Number)
], EmployeeDto.prototype, "age", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Number)
], EmployeeDto.prototype, "salary", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "department", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "designation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "joiningDate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "city", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "state", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "country", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], EmployeeDto.prototype, "zipCode", void 0);
exports.EmployeeDto = EmployeeDto;
//# sourceMappingURL=employee.dto.js.map