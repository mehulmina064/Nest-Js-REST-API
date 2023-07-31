"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const organization_entity_1 = require("./organization.entity");
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const typeorm_2 = require("typeorm");
const roles_constants_1 = require("./../users/roles.constants");
let OrganizationController = class OrganizationController {
    constructor(organizationService, userRepository) {
        this.organizationService = organizationService;
        this.userRepository = userRepository;
    }
    findAllOrganizations(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_1.HttpStatus.NOT_FOUND);
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.organizationService.findAll();
                    return { statusCode: 200, message: "All organizations", data: result };
                }
                else if (user.orgIds.length > 0) {
                    result = yield this.organizationService.findOrganizations(user.orgIds);
                    return { statusCode: 200, message: "All organizations", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You have no Organizations",
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    findOne1(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_1.HttpStatus.NOT_FOUND);
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.organizationService.findOne(id);
                    return result;
                }
                else if (user.orgIds.includes(id)) {
                    result = yield this.organizationService.findOne(id);
                    return result;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You are not in this organization",
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    findOne(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_1.HttpStatus.NOT_FOUND);
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.organizationService.findOne(id);
                    return { statusCode: 200, message: "organization details", data: result };
                }
                else if (user.orgIds.includes(id)) {
                    result = yield this.organizationService.findOne(id);
                    return { statusCode: 200, message: "organization details", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You are not in this organization",
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    filter(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationService.filter(query);
        });
    }
    save(organization) {
        console.log(organization);
        return this.organizationService.save(organization);
    }
    update(id, organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationService.update(id, organization);
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
], OrganizationController.prototype, "findAllOrganizations", null);
tslib_1.__decorate([
    common_1.Get('organizationbyid/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "findOne1", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('filter'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [organization_entity_1.Organization]),
    tslib_1.__metadata("design:returntype", void 0)
], OrganizationController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch('update/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "update", null);
OrganizationController = tslib_1.__decorate([
    common_1.Controller('organization'),
    tslib_1.__param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [organization_service_1.OrganizationService,
        typeorm_2.Repository])
], OrganizationController);
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map