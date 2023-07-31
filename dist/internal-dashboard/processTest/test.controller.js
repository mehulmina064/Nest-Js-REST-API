"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const test_entity_1 = require("./test.entity");
const test_dto_1 = require("./test.dto");
var request = require('request');
const fs = require('fs');
const http = require("https");
const test_service_1 = require("./test.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
let TestController = class TestController {
    constructor(processTestService, zohoEmployeeService) {
        this.processTestService = processTestService;
        this.zohoEmployeeService = zohoEmployeeService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1, isDefault = "NA") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            const attrFilter = [];
            if (status != "NA") {
                attrFilter.push({
                    "status": status
                });
            }
            if (isDefault != "NA") {
                if (isDefault == "true") {
                    attrFilter.push({
                        "isDefault": true
                    });
                }
                else {
                    attrFilter.push({
                        "isDefault": false
                    });
                }
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { displayName: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { minTime: { $regex: search, $options: 'i' } },
                            { mostFrequentTime: { $regex: search, $options: 'i' } },
                            { maxTime: { $regex: search, $options: 'i' } }
                        ],
                        $and: [
                            ...attrFilter
                        ]
                    }
                };
            }
            else {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { displayName: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { minTime: { $regex: search, $options: 'i' } },
                            { mostFrequentTime: { $regex: search, $options: 'i' } },
                            { maxTime: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.processTestService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Test", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.processTestService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Test", count: result.count, limit: limit, page: page, data: result.data };
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.processTestService.findOne(id);
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.updatedBy = req.user.id;
            role.createdBy = req.user.id;
            let save = yield this.processTestService.save(role);
            if (save) {
                return { statusCode: 200, message: "Successfully created", data: save };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Not saved',
                    message: "Not saved",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (role.status == test_entity_1.Status.DELETED) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'status must be not ' + role.status,
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            role.updatedBy = req.user.id;
            role.updatedAt = new Date();
            let save = yield this.processTestService.update(id, role);
            if (save) {
                return { statusCode: 200, message: "Successfully updated", data: save };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Not updated',
                    message: "Not updated",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let save = yield this.processTestService.softRemove(id, req.user.id);
            if (save) {
                return { statusCode: 200, message: "Successfully Deleted", data: save };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Not Deleted',
                    message: "Not Deleted",
                }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    hardDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (req.user.roles.includes('PRODO_ADMIN')) {
                let save = yield this.processTestService.hardRemove(id, req.user.id);
                if (save) {
                    return { statusCode: 200, message: "Successfully removed", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not removed',
                        message: "Not removed",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    addFields(id, req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d = body.map(item => item.apiName);
            if (new Set(d).size !== d.length) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'apiName name must be unique',
                    message: 'apiName name must be unique',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                let save = yield this.processTestService.addFields(id, req.user.id, body);
                if (save) {
                    return { statusCode: 200, message: "Successfully added fields", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not added fields',
                        message: "Not added fields",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    editFields(id, req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d = body.map(item => item.apiName);
            if (new Set(d).size !== d.length) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'apiName name must be unique',
                    message: 'apiName name must be unique',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                let save = yield this.processTestService.editFields(id, req.user.id, body);
                if (save) {
                    return { statusCode: 200, message: "Successfully updated fields", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not updated fields',
                        message: "Not updated fields",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    addTestValues(id, req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d = body.map(item => item.name);
            if (new Set(d).size !== d.length) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'name must be unique',
                    message: ' name must be unique',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                let save = yield this.processTestService.addTestValues(id, req.user.id, body);
                if (save) {
                    return { statusCode: 200, message: "Successfully added TestValues", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not added TestValues',
                        message: "Not added TestValues",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    editTestValues(id, req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d = body.map(item => item.name);
            if (new Set(d).size !== d.length) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'name must be unique',
                    message: ' name must be unique',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            else {
                let save = yield this.processTestService.editTestValues(id, req.user.id, body);
                if (save) {
                    return { statusCode: 200, message: "Successfully updated TestValues", data: save };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Not updated TestValues',
                        message: "Not updated TestValues",
                    }, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('isDefault', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [test_dto_1.CreateProcessTestDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, test_dto_1.UpdateProcessTestDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "softDelete", null);
tslib_1.__decorate([
    common_1.Delete('permanentDelete/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "hardDelete", null);
tslib_1.__decorate([
    common_1.Post('addFields/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: test_dto_1.CreateFieldDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "addFields", null);
tslib_1.__decorate([
    common_1.Patch('editFields/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: test_dto_1.UpdateFieldDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "editFields", null);
tslib_1.__decorate([
    common_1.Post('addTestValues/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: test_dto_1.CreateTestValueDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "addTestValues", null);
tslib_1.__decorate([
    common_1.Patch('editTestValues/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Body(new common_1.ParseArrayPipe({ items: test_dto_1.UpdateTestValueDto }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "editTestValues", null);
TestController = tslib_1.__decorate([
    common_1.Controller('internal/test'),
    tslib_1.__metadata("design:paramtypes", [test_service_1.TestService,
        zohoEmployee_service_1.zohoEmployeeService])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map