"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const tempuser_service_1 = require("./tempuser.service");
const roles_constants_1 = require("../users/roles.constants");
let TempuserController = class TempuserController {
    constructor(tempuserService, userRepository) {
        this.tempuserService = tempuserService;
        this.userRepository = userRepository;
    }
    findAll(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                console.log("throw exception that the user does not exists");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "user does not exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                console.log("here show the user all the invites");
                return yield this.tempuserService.findAll();
            }
            else {
                return yield this.tempuserService.findUserInvites(user);
            }
        });
    }
    findOne(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(id);
            if (!user) {
                console.log("throw exception that the user does not exists");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Does not exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            console.log("further checks will happen");
            console.log("here show the user all the invites");
            return yield this.tempuserService.findUserInvites(user);
        });
    }
    remove(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                console.log("throw exception");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User does not exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            return yield this.tempuserService.remove(id, user);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TempuserController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TempuserController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TempuserController.prototype, "remove", null);
TempuserController = tslib_1.__decorate([
    common_1.Controller('tempuser'),
    tslib_1.__param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [tempuser_service_1.TempuserService,
        typeorm_2.Repository])
], TempuserController);
exports.TempuserController = TempuserController;
//# sourceMappingURL=tempuser.controller.js.map