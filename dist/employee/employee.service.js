"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const XLSX = require("xlsx");
let EmployeeService = class EmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (filter) {
                return yield this.employeeRepository.find(filter);
            }
            return yield this.employeeRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.employeeRepository.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.employeeRepository.find(filter);
        });
    }
    update(id, employee) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.employeeRepository.update(id, employee);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const employee = this.employeeRepository.findOne(id).then(result => {
                this.employeeRepository.delete(result);
            });
        });
    }
    save(employee) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundEmployee = yield this.employeeRepository.findOne({ employee_id: employee.employee_id });
            if (foundEmployee) {
                return this.employeeRepository.save(employee);
            }
            else {
                return this.employeeRepository.save(employee);
            }
        });
    }
    bulkUploadFromExcel(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workbook = XLSX.read(file, { type: 'buffer' });
            const sheet_name_list = workbook.SheetNames;
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            const employee = yield this.employeeRepository.find();
            const employeeIds = employee.map(employee => employee.employee_id);
            const dataToBeInserted = data.filter(data => !employeeIds.includes(data.employee_id));
            const dataToBeUpdated = data.filter(data => employeeIds.includes(data.employee_id));
            const dataToBeDeleted = employee.filter(employee => !data.includes(employee.employee_id));
            yield this.employeeRepository.save(dataToBeInserted);
            yield this.employeeRepository.save(dataToBeUpdated);
            yield this.employeeRepository.remove(dataToBeDeleted);
        });
    }
};
EmployeeService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(employee_entity_1.Employee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeService);
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employee.service.js.map