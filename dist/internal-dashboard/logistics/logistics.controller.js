"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const logistics_dto_1 = require("./logistics.dto");
const logistics_entity_1 = require("./logistics.entity");
var request = require('request');
const fs = require('fs');
const http = require("https");
const logistics_service_1 = require("./logistics.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
let logisticsController = class logisticsController {
    constructor(logisticService, zohoEmployeeService) {
        this.logisticService = logisticService;
        this.zohoEmployeeService = zohoEmployeeService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1) {
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
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { displayName: { $regex: search, $options: 'i' } },
                            { apiUrl: { $regex: search, $options: 'i' } },
                            { trackingUrl: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { rating: { $regex: search, $options: 'i' } }
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
                            { apiUrl: { $regex: search, $options: 'i' } },
                            { trackingUrl: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { rating: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.logisticService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All logistics", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.logisticService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All logistics", count: result.count, limit: limit, page: page, data: result.data };
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
            return this.logisticService.findOne(id);
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.updatedBy = req.user.id;
            role.createdBy = req.user.id;
            let save = yield this.logisticService.save(role);
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
            if (role.status == logistics_entity_1.Status.DELETED) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'status must be not ' + role.status,
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            role.updatedBy = req.user.id;
            role.updatedAt = new Date();
            let save = yield this.logisticService.update(id, role);
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
            let save = yield this.logisticService.softRemove(id, req.user.id);
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
                let save = yield this.logisticService.hardRemove(id, req.user.id);
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
};
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], logisticsController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], logisticsController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [logistics_dto_1.CreateLogisticDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], logisticsController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, logistics_dto_1.UpdateLogisticDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], logisticsController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], logisticsController.prototype, "softDelete", null);
tslib_1.__decorate([
    common_1.Delete('permanentDelete/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], logisticsController.prototype, "hardDelete", null);
logisticsController = tslib_1.__decorate([
    common_1.Controller('internal/logistics'),
    tslib_1.__metadata("design:paramtypes", [logistics_service_1.logisticsService,
        zohoEmployee_service_1.zohoEmployeeService])
], logisticsController);
exports.logisticsController = logisticsController;
//# sourceMappingURL=logistics.controller.js.map