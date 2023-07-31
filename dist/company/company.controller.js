"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const company_service_1 = require("./company.service");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const roles_constants_1 = require("../users/roles.constants");
const organization_entity_1 = require("../organization/organization.entity");
let companyController = class companyController {
    constructor(companyService, userRepository, organizationRepository) {
        this.companyService = companyService;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }
    save(req, companyData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (!companyData.orgId) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide orgId",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!companyData.gstNo) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide gst number",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!companyData.companyName) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide company name",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            let result;
            let organization = yield this.organizationRepository.findOne(companyData.orgId);
            if (!organization) {
                {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.NOT_FOUND,
                        error: 'NOT_FOUND',
                        message: "Organization Not Found",
                    }, common_1.HttpStatus.NOT_FOUND);
                }
            }
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.companyService.save(companyData.orgId, companyData);
                }
                else if (user.orgIdRoles.find(i => (i.id == companyData.orgId) && (i.role == 'ORG_ADMIN'))) {
                    result = yield this.companyService.save(companyData.orgId, companyData);
                }
                else {
                    if (organization.account_id == user.accountId) {
                        console.log("User is super admin");
                        result = yield this.companyService.save(companyData.orgId, companyData);
                    }
                    else if (user.orgIds.includes(companyData.orgId)) {
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.BAD_REQUEST,
                            error: 'Bad request',
                            message: " You are not a admin of this organization ",
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
                    else {
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.BAD_REQUEST,
                            error: 'Bad request',
                            message: "You are not in this organization",
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                if (result) {
                    organization.companyIds.push(`${result.id}`);
                    user.companyIdRoles.push({ id: `${result.id}`, role: "COMPANY_ADMIN" });
                    user.companyIds.push(`${result.id}`);
                    yield this.userRepository.update(user.id, user);
                    yield this.organizationRepository.update(organization.id, organization);
                    result = {
                        company: result,
                        organization: organization,
                        user: user
                    };
                    let output = {
                        statusCode: 200,
                        message: " Successfully saved ",
                        data: result
                    };
                    return output;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'EXPECTATION_FAILED',
                        message: "Error in saving data",
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    findAll(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            let result;
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.companyService.findAll();
                    return { statusCode: 200, message: "All Companies", data: result };
                }
                else if (user.companyIds.length > 0) {
                    result = yield this.companyService.findCompanies(user.companyIds);
                    return { statusCode: 200, message: "All Companies", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You have no Companies",
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
            return yield this.companyService.filter(query);
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
                    result = yield this.companyService.findOne(id);
                    return { statusCode: 200, message: "company details", data: result };
                }
                else if (user.companyIds.includes(id)) {
                    result = yield this.companyService.findOne(id);
                    return { statusCode: 200, message: "company details", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You are not in this company",
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
    update(id, company) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.companyService.update(id, company);
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], companyController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], companyController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('filter'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], companyController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Get('details/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], companyController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], companyController.prototype, "update", null);
companyController = tslib_1.__decorate([
    common_1.Controller('company'),
    tslib_1.__param(1, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__param(2, typeorm_2.InjectRepository(organization_entity_1.Organization)),
    tslib_1.__metadata("design:paramtypes", [company_service_1.companyService,
        typeorm_1.Repository,
        typeorm_1.Repository])
], companyController);
exports.companyController = companyController;
//# sourceMappingURL=company.controller.js.map