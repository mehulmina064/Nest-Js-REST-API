"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const file_utils_1 = require("../../files/file.utils");
const internal_local_auth_guard_1 = require("../../authentication/internal-local-auth.guard");
const authentication_service_1 = require("../../authentication/authentication.service");
const common_2 = require("@nestjs/common");
const zohoEmployee_entity_1 = require("./zohoEmployee.entity");
const zohoEmployee_dto_1 = require("./zohoEmployee.dto");
const zohoEmployee_service_1 = require("./zohoEmployee.service");
const multer_1 = require("multer");
var ObjectId = require('mongodb').ObjectID;
var request = require('request');
const fs = require('fs');
const http = require("https");
const userRoles_service_1 = require("../prodoRoles/userRoles.service");
const prodoRoles_service_1 = require("../prodoRoles/prodoRoles.service");
const team_service_1 = require("../team/team.service");
const userTeam_service_1 = require("../team/userTeam.service");
let zohoEmployeeController = class zohoEmployeeController {
    constructor(zohoEmployeeService, authService, userRolesService, prodoRolesService, userTeamService, internalTeamService) {
        this.zohoEmployeeService = zohoEmployeeService;
        this.authService = authService;
        this.userRolesService = userRolesService;
        this.prodoRolesService = prodoRolesService;
        this.userTeamService = userTeamService;
        this.internalTeamService = internalTeamService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1, isEmployee = "NA") {
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
            if (isEmployee != "NA") {
                if (isEmployee == "true") {
                    attrFilter.push({
                        "isEmployee": true
                    });
                }
                else {
                    attrFilter.push({
                        "isEmployee": false
                    });
                }
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { contactNumber: { $regex: search, $options: 'i' } },
                            { designation: { $regex: search, $options: 'i' } },
                            { dateOfBerth: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { zohoUserId: { $regex: search, $options: 'i' } },
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
                            { contactNumber: { $regex: search, $options: 'i' } },
                            { designation: { $regex: search, $options: 'i' } },
                            { dateOfBerth: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { zohoUserId: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.zohoEmployeeService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Employees", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoEmployeeService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Employees", count: result.count, limit: limit, page: page, data: result.data };
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
    getAllEmployees() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.zohoEmployeeService.findAll();
            return { statusCode: 200, message: "All Employees", count: result.count, data: result.data };
        });
    }
    getProfile(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let u = yield this.zohoEmployeeService.findOne(req.user.id);
            if (u) {
                return { statusCode: 200, message: "Employee Profile", data: u };
            }
            else {
                throw new common_2.NotFoundException(`user not found`);
            }
        });
    }
    setProfilePicture(req, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!data.profilePicture) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please provide profile picture",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            return yield this.zohoEmployeeService.setProfilePicture(data.profilePicture, req.user.id);
        });
    }
    updateProfile(req, userData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.zohoEmployeeService.update(req.user.id, userData, req.user.roles);
        });
    }
    apiCheck(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return { statusCode: 200, message: "Authorized", user: req.user };
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let u = yield this.zohoEmployeeService.findOne(id);
            if (u) {
                return { statusCode: 200, message: "Employee Details", data: u };
            }
            else {
                throw new common_2.NotFoundException(`user with this id- ${id} not found`);
            }
        });
    }
    findOneByEmail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let u = yield this.zohoEmployeeService.findByEmail(email);
            if (u) {
                return { statusCode: 200, message: "Employee Details", data: u };
            }
            else {
                throw new common_2.NotFoundException(`user with this email- ${email} not found`);
            }
        });
    }
    update(id, user, req) {
        user.updatedBy = req.user.id;
        user.updatedAt = new Date();
        return this.zohoEmployeeService.update(id, user, req.user.roles);
    }
    zohoAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.zohoEmployeeService.zohoAll(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All Users From zoho", count: result.length, data: result };
        });
    }
    GetData(s, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (s) {
                case 'role':
                    let userRoles = yield this.userRolesService.findAll({ where: { userId: userId } });
                    let userRoleIds = [];
                    if (userRoles.count) {
                        for (let role of userRoles.data) {
                            userRoleIds.push({ _id: ObjectId(role.roleId) });
                        }
                        let yep = yield this.prodoRolesService.findAll({ where: { $or: [...userRoleIds] } });
                        return yep.data;
                    }
                    else {
                        return [];
                    }
                    break;
                case 'team':
                    let userTeams = yield this.userTeamService.findAll({ where: { userId: userId } });
                    let userTeamIds = [];
                    if (userTeams.count) {
                        for (let team of userTeams.data) {
                            userTeamIds.push({ _id: ObjectId(team.teamId) });
                        }
                        let yep1 = yield this.internalTeamService.findAll({ where: { $or: [...userTeamIds] } });
                        return yep1.data;
                    }
                    else {
                        return [];
                    }
                    break;
                default:
                    console.log("Not implemented");
            }
            throw new common_2.NotFoundException(`Method not found contact admin`);
        });
    }
    One(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.zohoEmployeeService.findOne(id);
            if (user) {
                let arrayKey = ['role', 'team'];
                const promises = arrayKey.map(a => this.GetData(a, req.user.id));
                const result = yield Promise.all(promises);
                user.userRoles = result[0];
                user.teams = result[1];
                return { statusCode: 200, message: "Employee Details", data: user };
            }
            else {
                throw new common_2.NotFoundException(`user with this id- ${id} not found`);
            }
        });
    }
    updatePassword(id, data) {
        console.log(data);
        return this.zohoEmployeeService.updatePassword(id, data);
    }
    login(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.Ilogin(req.user);
        });
    }
    signUp(req, zohoEmployee) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoUser = yield this.zohoEmployeeService.getZohoEmployeeByEmail(zohoEmployee.email);
            zohoUser = yield this.zohoEmployeeService.InventoryByID(zohoUser.user_id);
            const saveUser = yield this.zohoEmployeeService.create(zohoEmployee, zohoUser);
            return { statusCode: 200, message: "Successfully Registered as Employee", data: saveUser };
        });
    }
    softDelete(id, req) {
        return this.zohoEmployeeService.softRemove(id, req.user.id);
    }
    delete(id) {
        return this.zohoEmployeeService.remove(id);
    }
    forgotPassword(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(data);
            return yield this.zohoEmployeeService.forgotPassword(data.email);
        });
    }
    resetPassword(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.zohoEmployeeService.resetPassword(data.email, data.otp, data.password);
        });
    }
    verifyOtp(contactNumber, otp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.zohoEmployeeService.verifyOtp(contactNumber, otp);
        });
    }
    generateOtp(contactNumber) {
        return this.zohoEmployeeService.generateOtp(contactNumber);
    }
    uploadUsers(req, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.zohoEmployeeService.uploadUsers(req.user, file);
        });
    }
    zohoOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.zohoEmployeeService.InventoryByID(id);
            return { statusCode: 200, message: "User Details from zoho mapped", data: data };
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
    tslib_1.__param(5, common_1.Query('isEmployee', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('allEmployee'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "getAllEmployees", null);
tslib_1.__decorate([
    common_1.Get('profile'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "getProfile", null);
tslib_1.__decorate([
    common_1.Post('setProfilePicture'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "setProfilePicture", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Patch('profile'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "updateProfile", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Post('apiCheck'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "apiCheck", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get('employeeById/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get('employeeByEmail/:email'),
    tslib_1.__param(0, common_1.Param('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "findOneByEmail", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, zohoEmployee_entity_1.zohoEmployee, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoEmployeeController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Get('zohoAllUsers'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "zohoAll", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "One", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Patch('password/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoEmployeeController.prototype, "updatePassword", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_local_auth_guard_1.ILocalAuthGuard),
    common_1.Post('/login'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "login", null);
tslib_1.__decorate([
    common_1.Post('signUp'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, zohoEmployee_dto_1.CreateEmployeeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "signUp", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoEmployeeController.prototype, "softDelete", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Delete('delete/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoEmployeeController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Post('/forgotPassword'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "forgotPassword", null);
tslib_1.__decorate([
    common_1.Post('/resetPassword'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "resetPassword", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Post('verifyOtp'),
    tslib_1.__param(0, common_1.Param('contactNumber')), tslib_1.__param(1, common_1.Param('otp')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "verifyOtp", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_local_auth_guard_1.ILocalAuthGuard),
    common_1.Get('generateOtp/:contactNumber'),
    tslib_1.__param(0, common_1.Param('contactNumber')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoEmployeeController.prototype, "generateOtp", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Post('uploadUsers'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        }
    })),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.UploadedFile()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "uploadUsers", null);
tslib_1.__decorate([
    common_1.Get('zohoOneUser/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoEmployeeController.prototype, "zohoOne", null);
zohoEmployeeController = tslib_1.__decorate([
    common_1.Controller('internal/employee'),
    tslib_1.__metadata("design:paramtypes", [zohoEmployee_service_1.zohoEmployeeService,
        authentication_service_1.AuthenticationService,
        userRoles_service_1.userRolesService,
        prodoRoles_service_1.prodoRolesService,
        userTeam_service_1.userTeamService,
        team_service_1.internalTeamService])
], zohoEmployeeController);
exports.zohoEmployeeController = zohoEmployeeController;
//# sourceMappingURL=zohoEmployee.controller.js.map