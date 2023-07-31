"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const entities_service_1 = require("./entities.service");
const organization_entity_1 = require("../organization/organization.entity");
const company_entity_1 = require("../company/company.entity");
const roles_constants_1 = require("../users/roles.constants");
let entitiesController = class entitiesController {
    constructor(entitiesService, userRepository, organizationRepository, companyRepository) {
        this.entitiesService = entitiesService;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.companyRepository = companyRepository;
    }
    findAll(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.entitiesService.findAll();
                    return { statusCode: 200, message: "All Entities", data: result };
                }
                else if (user.entityIds.length > 0) {
                    result = yield this.entitiesService.findEntities(user.entityIds);
                    return { statusCode: 200, message: "All Entities", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You have no Entities",
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
    save(req, entityData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (!entityData.companyId) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide companyId",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!entityData.zipCode) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide zipCode ",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!entityData.shippingAddress) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide shippingAddress ",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!entityData.entityName) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide entity name",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!entityData.entityCity) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide city name",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!entityData.entityState) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide State name",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!entityData.entityCountryCode) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide entity Country Code like IN,US..",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            let result;
            let company = yield this.companyRepository.findOne(entityData.companyId);
            if (!company) {
                {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.NOT_FOUND,
                        error: 'NOT_FOUND',
                        message: "Company Not Found",
                    }, common_1.HttpStatus.NOT_FOUND);
                }
            }
            let organization = yield this.organizationRepository.findOne(company.organization_id);
            if (!organization) {
                {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.NOT_FOUND,
                        error: 'NOT_FOUND',
                        message: "Organization Not Found",
                    }, common_1.HttpStatus.NOT_FOUND);
                }
            }
            let cId = String(company.id);
            let uI = String(user.id);
            let oID = String(organization.id);
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.entitiesService.save(oID, cId, entityData);
                }
                else if (user.orgIdRoles.find(i => (i.id == oID) && (i.role == 'ORG_ADMIN'))) {
                    result = yield this.entitiesService.save(oID, cId, entityData);
                }
                else {
                    if (organization.account_id == user.accountId) {
                        console.log("User is super admin");
                        result = yield this.entitiesService.save(oID, cId, entityData);
                    }
                    else if (user.orgIds.includes(oID)) {
                        if (user.companyIdRoles.find(i => (i.id == cId) && (i.role == 'COMPANY_ADMIN'))) {
                            result = yield this.entitiesService.save(oID, cId, entityData);
                        }
                        else {
                            throw new common_1.HttpException({
                                status: common_1.HttpStatus.BAD_REQUEST,
                                error: 'Bad request',
                                message: " You are not a admin of this Company ",
                            }, common_1.HttpStatus.BAD_REQUEST);
                        }
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
                    organization.entityIds.push(`${result.id}`);
                    company.entityIds.push(`${result.id}`);
                    user.entityIdRoles.push({ id: `${result.id}`, role: "ENTITY_ADMIN" });
                    user.entityIds.push(`${result.id}`);
                    yield this.userRepository.update(user.id, user);
                    yield this.companyRepository.update(company.id, company);
                    yield this.organizationRepository.update(organization.id, organization);
                    result = {
                        entity: result,
                        company: company,
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
                    result = yield this.entitiesService.findOne(id);
                    return { statusCode: 200, message: "entity details", data: result };
                }
                else if (user.entityIds.includes(id)) {
                    result = yield this.entitiesService.findOne(id);
                    return { statusCode: 200, message: "entity details", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "You are not in this entity",
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
    update(id, data) {
        return this.entitiesService.update(+id, data);
    }
    remove(id) {
        return this.entitiesService.remove(+id);
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], entitiesController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], entitiesController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Get('details/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], entitiesController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], entitiesController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], entitiesController.prototype, "remove", null);
entitiesController = tslib_1.__decorate([
    common_1.Controller('entities'),
    tslib_1.__param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    tslib_1.__param(2, typeorm_1.InjectRepository(organization_entity_1.Organization)),
    tslib_1.__param(3, typeorm_1.InjectRepository(company_entity_1.Company)),
    tslib_1.__metadata("design:paramtypes", [entities_service_1.entitiesService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], entitiesController);
exports.entitiesController = entitiesController;
//# sourceMappingURL=entities.controller.js.map