"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const team_dto_1 = require("./team.dto");
const team_service_1 = require("./team.service");
const userTeam_service_1 = require("./userTeam.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const fs = require('fs');
const http = require("https");
let userTeamController = class userTeamController {
    constructor(internalTeamService, zohoEmployeeService, userTeamService) {
        this.internalTeamService = internalTeamService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.userTeamService = userTeamService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            let query = {
                where: {
                    $or: [
                        { teamId: { $regex: search, $options: 'i' } },
                        { userId: { $regex: search, $options: 'i' } },
                    ]
                }
            };
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.userTeamService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All UserTeams", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: 'User does not have permission to perform this action',
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
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
            return yield this.userTeamService.findOne(id);
        });
    }
    userRoles(userId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let query = { where: { userId: userId } };
            if (req.user.id == userId || req.user.roles.includes('PRODO_ADMIN')) {
                let result = yield this.userTeamService.findAll(query);
                return { statusCode: 200, message: "Your Teams", count: result.count, data: result.data };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'User does not have permission to perform this action',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    save(team, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.internalTeamService.check(team.teamId);
            let userCheck = yield this.zohoEmployeeService.check(team.userId);
            if (roleCheck) {
                if (userCheck) {
                    team.updatedBy = req.user.id;
                    team.createdBy = req.user.id;
                    return yield this.userTeamService.save(team);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'UserId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'TeamId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    update(id, team, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.internalTeamService.check(team.teamId);
            let userCheck = yield this.zohoEmployeeService.check(team.userId);
            if (roleCheck) {
                if (userCheck) {
                    team.updatedBy = req.user.id;
                    team.updatedAt = new Date();
                    return yield this.userTeamService.update(id, team);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'UserId is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'TeamId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userTeamService.softRemove(id, req.user.id);
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
], userTeamController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], userTeamController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('myTeams/:userId'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('userId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userTeamController.prototype, "userRoles", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [team_dto_1.CreateUserTeamDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userTeamController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, team_dto_1.UpdateUserTeamDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userTeamController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], userTeamController.prototype, "softDelete", null);
userTeamController = tslib_1.__decorate([
    common_1.Controller('internal/UserTeams'),
    tslib_1.__metadata("design:paramtypes", [team_service_1.internalTeamService,
        zohoEmployee_service_1.zohoEmployeeService,
        userTeam_service_1.userTeamService])
], userTeamController);
exports.userTeamController = userTeamController;
//# sourceMappingURL=userTeam.controller.js.map