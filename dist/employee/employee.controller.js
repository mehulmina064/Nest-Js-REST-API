"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const employee_dto_1 = require("./employee.dto");
const utils_1 = require("../common/utils");
const jwt_auth_guard_1 = require("./../authentication/jwt-auth.guard");
let EmployeeController = class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    findAll(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield utils_1.filterAllData(this.employeeService, req.user);
        });
    }
    filter(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.employeeService.filter(query);
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield utils_1.filterSingleObject(this.employeeService, id);
        });
    }
    save(employeeCreateDto) {
        return this.employeeService.save(employeeCreateDto);
    }
    update(id, employeeUpdateDto) {
        return this.employeeService.update(id, employeeUpdateDto);
    }
    delete(id) {
        return this.employeeService.delete(id);
    }
    bulkUploadFromExcel(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.employeeService.bulkUploadFromExcel(file);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('filter/'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Get('employeebyid/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UsePipes(common_1.ValidationPipe),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [employee_dto_1.EmployeeCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UsePipes(common_1.ValidationPipe),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, employee_dto_1.EmployeeUpdateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Post('bulk-upload'),
    tslib_1.__param(0, common_1.UploadedFile()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "bulkUploadFromExcel", null);
EmployeeController = tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('employees'),
    tslib_1.__metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map