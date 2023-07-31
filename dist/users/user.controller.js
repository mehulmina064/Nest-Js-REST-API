"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const file_utils_1 = require("./../files/file.utils");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./user.entity");
const local_auth_guard_1 = require("../authentication/local-auth.guard");
const authentication_service_1 = require("../authentication/authentication.service");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const user_decorator_1 = require("./user.decorator");
const account_entity_1 = require("../account/account.entity");
const organization_entity_1 = require("../organization/organization.entity");
const roles_constants_1 = require("./roles.constants");
const roles_decorator_1 = require("../authentication/roles.decorator");
const typeorm_1 = require("typeorm");
const user_dto_1 = require("./user.dto");
const utils_1 = require("../common/utils");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const CryptoJS = require("crypto-js");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    findAll(req, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield utils_1.filterAllData(this.userService, req.user, query);
        });
    }
    test1(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('user-1', req.user);
            return req.user;
            return yield this.userService.findAll();
        });
    }
    getProfile(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.findOne(req.user.id);
        });
    }
    getReview(package_id, req, item_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.getReview(item_id, req.user.id, package_id);
        });
    }
    postReview(req, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            data.user_id = req.user.id;
            return yield this.userService.salesOrderReview(data);
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
            return yield this.userService.setProfilePicture(data.profilePicture, req.user.id);
        });
    }
    updateProfile(req, userData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.update(req.user.id, userData);
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.findOne(id);
        });
    }
    findOneByEmail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.findByEmail(email);
        });
    }
    findOneTest(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user) {
                return yield console.log(user);
            }
            return { status: 'error', message: 'User not found' };
        });
    }
    addUser(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.userService.addUser(data);
        });
    }
    save(data) {
        let user = new user_entity_1.User();
        user.firstName = data.user.firstName;
        user.lastName = data.user.lastName;
        user.email = data.user.email;
        user.contactNumber = data.user.contactNumber;
        user.password = data.user.password;
        user.isVerified = true;
        user.roles = [roles_constants_1.UserRole.USER, roles_constants_1.UserRole.ADMIN, roles_constants_1.UserRole.CLIENT, roles_constants_1.UserRole.NewUser];
        let account = new account_entity_1.Account();
        account.type = account_entity_1.AccountType.EXTERNAL;
        let organization = new organization_entity_1.Organization();
        organization.name = data.organization.name;
        organization.type = data.organization.type;
        organization.domains = [organization_entity_1.OrganizationDomain.PROCUREMENT, organization_entity_1.OrganizationDomain.ECOMMERCE, organization_entity_1.OrganizationDomain.INVENTORY];
        if (organization.type === organization_entity_1.OrganizationType.LOGISTICS) {
            console.log('logistics', organization.type);
            user.roles.push(roles_constants_1.UserRole.LOGISTICS);
            organization.domains.push(organization_entity_1.OrganizationDomain.LOGISTICS);
        }
        if (organization.type == organization_entity_1.OrganizationType.MANUFACTURER) {
            user.roles.push(roles_constants_1.UserRole.MANUFACTURER, roles_constants_1.UserRole.SUPPLIER);
            organization.domains.push(organization_entity_1.OrganizationDomain.SUPPLIER, organization_entity_1.OrganizationDomain.MANUFACTURER);
        }
        return this.userService.save(user, account, organization);
    }
    filter(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.filter(query);
        });
    }
    getUserRoles() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.getUserRoles();
        });
    }
    getAllUsers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.findAll();
        });
    }
    update(id, user, req) {
        return this.userService.update(id, user);
    }
    updatePassword(id, data) {
        console.log(data);
        return this.userService.updatePassword(id, data);
    }
    login(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.login(req.user);
        });
    }
    delete(id) {
        return this.userService.remove(id);
    }
    forgotPassword(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(data);
            return yield this.userService.forgotPassword(data.email);
        });
    }
    resetPassword(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.resetPassword(data.email, data.otp, data.password);
        });
    }
    verifyOtp(contactNumber, otp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.userService.verifyOtp(contactNumber, otp);
        });
    }
    generateOtp(contactNumber) {
        return this.userService.generateOtp(contactNumber);
    }
    addRole(id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(data.roles);
            return yield this.userService.assignRoles(id, data.roles);
        });
    }
    addUserToOrganization(id, user, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(user);
            return yield this.userService.addUserToOrganization(user, id, req.user);
        });
    }
    uploadUsers(req, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.uploadUsers(req.user, file);
        });
    }
    updateUserRoles() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUsers = yield typeorm_1.getRepository(user_entity_1.User).find({
                territory_id: [],
                organization_id: '6268d5d11e192b13a6dd09f2',
                roles: 'UnimoveStoreManager'
            });
            console.log(foundUsers);
            return yield typeorm_1.getRepository(user_entity_1.User).remove(foundUsers);
        });
    }
    getUserCount(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield utils_1.filterAllData(this.userService, req.user).then(userCount => {
                return userCount.length;
            });
        });
    }
    getGraph(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const task = query.pass;
            return CryptoJS.HmacSHA1(task, 'jojo').toString();
        });
    }
    getGraph2(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const task = query.pass;
            var iv = CryptoJS.enc.Base64.parse("jojo");
            var key = CryptoJS.SHA256("Message");
            var decrypteddata = decryptData(encryptedString, iv, key);
            console.log(decrypteddata);
            function decryptData(encrypted, iv, key) {
                var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return decrypted.toString(CryptoJS.enc.Utf8);
            }
        });
    }
    zohoTest() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findByEmail('abhishek.gupta@prodo.in');
            return yield this.userService.zohoWebUsersUpload();
        });
    }
    sendMailWithTemplate(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!body.templateName) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide template Name"
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!body.subject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide subject "
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            return yield this.userService.sendMailWithTemplate(body.templateName, body.subject);
        });
    }
    updateOldData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allUser = yield this.userService.fixAllUsers();
            return allUser;
        });
    }
    updateOldOrganizationsData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allUser = yield this.userService.fixAllUsersOrganizations();
            return allUser;
        });
    }
    updateAllData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let output = [];
            let allUser = yield this.userService.findAllUsers();
            for (const user of allUser) {
                output.push(yield this.userService.updateData(user));
            }
            return output;
        });
    }
    updateOneUserData(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findByEmail(email);
            let update = yield this.userService.updateData(user);
            return update;
        });
    }
    addNewOrganization(OrganizationData, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
            if (!user) {
                throw new common_2.NotFoundException(`User with id ${req.user.id} not found`);
            }
            let userRole = "ORG_ADMIN";
            let accountId = String(user.accountId);
            OrganizationData = yield this.userService.addNewOrganization(user, OrganizationData, userRole, accountId);
            let output = {
                statusCode: 200,
                message: " Successfully saved ",
                data: OrganizationData
            };
            return output;
        });
    }
    allUsers(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
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
                    result = yield this.userService.findAll();
                    return { statusCode: 200, message: " All Users ", data: result };
                }
                else {
                    let adminOrgs = user.orgIdRoles.filter(i => i.role == "ORG_ADMIN").map(x => x.id);
                    let adminComps = user.companyIdRoles.filter(i => i.role == "COMPANY_ADMIN").map(x => x.id);
                    let adminEntity = user.entityIdRoles.filter(i => i.role == "ENTITY_ADMIN").map(x => x.id);
                    let orgUsers = [];
                    let companyUsers = [];
                    let entityUsers = [];
                    if (adminOrgs.length > 0) {
                        orgUsers = yield this.userService.orgUsers(adminOrgs);
                    }
                    if (adminComps.length > 0) {
                        companyUsers = yield this.userService.companyUsers(adminComps);
                    }
                    if (adminEntity.length > 0) {
                        entityUsers = yield this.userService.entityUsers(adminEntity);
                    }
                    if (orgUsers.length > 0 || companyUsers.length > 0 || entityUsers.length > 0) {
                        result = [...orgUsers, ...companyUsers, ...entityUsers];
                        let userIds = result.map(item => `${item.id}`);
                        userIds = [...new Set(userIds)];
                        let out = [];
                        for (let id of userIds) {
                            out.push(result.find(i => i.id == id));
                        }
                        return { statusCode: 200, message: " All Users ", data: out };
                    }
                    else {
                        result = [user];
                        return { statusCode: 200, message: " You are Not Admin ", data: result };
                    }
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    allOrgUsers(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
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
                    result = yield this.userService.orgUsers([user.organization_id]);
                    return { statusCode: 200, message: " All Users in This Organization", data: result };
                }
                else if (user.orgRole == "ORG_ADMIN") {
                    result = yield this.userService.orgUsers([user.organization_id]);
                    return { statusCode: 200, message: " All Users in This Organization", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: "You are not a admin",
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    companyUsers(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
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
                    result = yield this.userService.companyUsers([user.companyId]);
                    return { statusCode: 200, message: " All Users in This Company", data: result };
                }
                else if (user.companyRole == "COMPANY_ADMIN") {
                    result = yield this.userService.companyUsers([user.companyId]);
                    return { statusCode: 200, message: " All Users in This Company", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: "You are not a admin",
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    entityUsers(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
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
                    result = yield this.userService.entityUsers([user.entityId]);
                    return { statusCode: 200, message: " All Users in This Entity", data: result };
                }
                else if (user.companyRole == "COMPANY_ADMIN") {
                    result = yield this.userService.entityUsers([user.entityId]);
                    return { statusCode: 200, message: " All Users in This Entity", data: result };
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: "You are not a admin",
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    organizationswitch(req, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
            console.log(req.user);
            console.log(user);
            console.log("inside the required controller");
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
                    user.orgRole = "ORG_ADMIN";
                    user.organization_id = id;
                    result = yield this.userService.switchupdate1(user);
                    return { statusCode: 200, message: "Successfully switched Organization", result: result };
                }
                else if (user.orgIds.includes(id)) {
                    let role = user.orgIdRoles.find(i => i.id == id);
                    if (role) {
                        user.orgRole = role.role;
                        user.organization_id = id;
                        result = yield this.userService.switchupdate1(user);
                        if (result) {
                            return { statusCode: 200, message: "Successfully switched Organization", updatedUser: user };
                        }
                        else {
                            throw new common_1.HttpException({
                                status: common_1.HttpStatus.EXPECTATION_FAILED,
                                error: 'Error in updating the role',
                                message: "Error in updating the role",
                            }, common_1.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    return result;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: "You are not in this org",
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    companySwitch(req, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
            let user = yield this.userService.findOne(req.user.id);
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    user.companyRole = "COMPANY_ADMIN";
                    user.companyId = id;
                    result = yield this.userService.switchupdate1(user);
                    return { statusCode: 200, message: "Successfully switched Company", result: result };
                }
                else if (user.companyIds.includes(id)) {
                    let role = user.companyIdRoles.find(i => i.id == id);
                    if (role) {
                        user.companyRole = role.role;
                        user.companyId = id;
                        result = yield this.userService.switchupdate1(user);
                        if (result) {
                            return { statusCode: 200, message: "Successfully switched Company", updatedUser: user };
                        }
                        else {
                            throw new common_1.HttpException({
                                status: common_1.HttpStatus.EXPECTATION_FAILED,
                                error: 'Error in updating the role',
                                message: "Error in updating the role",
                            }, common_1.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    return result;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: "You are not in this Company",
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    entityswitch(req, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(id);
            let result;
            let user = yield this.userService.findOne(req.user.id);
            if (user.roles) {
                if (user.roles.includes("PRODO_ADMIN")) {
                    user.entityRole = "ENTITY_ADMIN";
                    user.entityId = id;
                    result = yield this.userService.switchupdate1(user);
                    return { statusCode: 200, message: "Successfully switched Entity", result: result };
                }
                else if (user.entityIds.includes(id)) {
                    let role = user.entityIdRoles.find(i => i.id == id);
                    if (role) {
                        user.entityRole = role.role;
                        user.entityId = id;
                        result = yield this.userService.switchupdate1(user);
                        if (result) {
                            return { statusCode: 200, message: "Successfully switched Entity", updatedUser: user };
                        }
                        else {
                            throw new common_1.HttpException({
                                status: common_1.HttpStatus.EXPECTATION_FAILED,
                                error: 'Error in updating the role',
                                message: "Error in updating the role",
                            }, common_1.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    return result;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: "You are not in this entity",
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid USer",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    adminLevel(req, id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let adminUser = yield this.userService.findOne(req.user.id);
            let user = yield this.userService.findOne(id);
            let type = data.type;
            let check;
            if (!user) {
                console.log("throw exception that user does not exist");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (!adminUser) {
                console.log("throw exception that admin uer does not exists");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                console.log("prodo admin can do the switching but there are still some conditions to meet");
                check = "PRODO_ADMIN";
                if (type == "organization") {
                    console.log("org switching is requested");
                    if (user.orgIds.includes(data.id)) {
                        console.log("switching is ossible");
                        yield this.userService.adminLevelSwitch(type, check, user, adminUser, data);
                    }
                    else {
                        console.log("throw exception because the user is not part of the organization");
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Invalid User",
                        }, common_1.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (type == "company") {
                    console.log("copany switch is requested");
                    if (user.companyIds.includes(data.id)) {
                        console.log("switching is ossible");
                        yield this.userService.adminLevelSwitch(type, check, user, adminUser, data);
                    }
                    else {
                        console.log("throw exception because the user is not part of the organization");
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Invalid User",
                        }, common_1.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (type == "entity") {
                    console.log("entity switch is requested");
                    if (user.entityIds.includes(data.id)) {
                        console.log("switching is possible");
                        yield this.userService.adminLevelSwitch(type, check, user, adminUser, data);
                    }
                    else {
                        console.log("throw exception because the user is not part of the organization");
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Invalid User",
                        }, common_1.HttpStatus.EXPECTATION_FAILED);
                    }
                }
            }
            else {
                check = "NOT_PRODO_ADMIN";
                console.log("further checks are needed and we cannot check dertails of org,comp and ent here so we transfer data to user service");
                yield this.userService.adminLevelSwitch(type, check, user, adminUser, data);
            }
        });
    }
    userroleswichapi(req, id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(req.user.id);
            if (user == null) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (data == null) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Insufficient credentials provided",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            yield this.userService.superSwitch(user, data.type, data, id);
            return "something";
        });
    }
    addingUsers(req, data, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(id);
            let adminUser = yield this.userService.findOne(req.user.id);
            if (!user) {
                console.log("throw exception that the user does not existed for the requested id");
            }
            if (!adminUser) {
                console.log("throw exception that cannot tfind youin the db");
            }
            if (!data) {
                console.log("throw exception that no data is provided");
            }
            let type = data.type;
            yield this.userService.toAddTheUser(type, data, user, adminUser);
        });
    }
    removingUser(req, body, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(id);
            if (!user) {
                console.log("throw exception the user already does not exists");
            }
            let adminUser = yield this.userService.findOne(req.user.id);
            if (!adminUser) {
                console.log("throw exception that invalid user making the request");
            }
            if (body == null) {
                console.log("credentials not provided for operation");
            }
            let type = body.type;
            yield this.userService.toDeleteUser(user, adminUser, body, type);
        });
    }
    inviteUser(req, data, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let adminUser = yield this.userService.findOne(req.user.id);
            let user = yield this.userService.findOne(id);
            if (data == null) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "data not provided",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            let type = data.type;
            let inviteId = data.inviteId;
            if (adminUser == null || user == null) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid user/user(s)",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            return yield this.userService.inviteUser(user, adminUser, data, type, inviteId);
        });
    }
    transferUserData(req, id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.findOne(id);
            let adminUser = yield this.userService.findOne(req.user.id);
            if (adminUser == null || user == null) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid user/user(s)",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            let result = yield this.userService.transferUserData(adminUser, user, data);
            return { statusCode: 200, message: "User data transfereed", data: result };
        });
    }
    invitation(req, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let email = body.email;
            let data = body;
            let adminUser = yield this.userService.findOne(req.user.id);
            if (!adminUser) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Requesting User is not part of the organization",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (email == null) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "email not provided",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            let user = yield this.userService.findByEmail(email);
            if (user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: " User already exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            else {
                yield this.userService.inviteUserToProdo(email, data, adminUser);
            }
            return { message: "invitation sent", statusCode: 200 };
        });
    }
    inviteAccept(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tempUserId = data.id;
            return yield this.userService.acceptInviteNewUser(tempUserId);
        });
    }
    inviteAcceptuser(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let inviteId = data.inviteId;
            let userId = data.userId;
            return yield this.userService.acceptInviteExistingUser(inviteId, userId);
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('test1'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "test1", null);
tslib_1.__decorate([
    common_1.Get('profile'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
tslib_1.__decorate([
    common_1.Get('salesOrder-item-Delivery-Review/:package_id/:item_id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('package_id')), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Param('item_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getReview", null);
tslib_1.__decorate([
    common_1.Post('salesOrder-item-Delivery-Review'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "postReview", null);
tslib_1.__decorate([
    common_1.Post('setProfilePicture'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "setProfilePicture", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch('profile'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('userbyid/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('userbyemail/:email'),
    tslib_1.__param(0, common_1.Param('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findOneByEmail", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('test'),
    tslib_1.__param(0, user_decorator_1.CurrentUser()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.User]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findOneTest", null);
tslib_1.__decorate([
    common_1.Post('add-user'),
    roles_decorator_1.Roles(roles_constants_1.UserRole.ADMIN),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.User]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "addUser", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_dto_1.UserCreateDto]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Get('filter/'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Get('userroles'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getUserRoles", null);
tslib_1.__decorate([
    common_1.Get('testRole'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    roles_decorator_1.Roles(roles_constants_1.UserRole.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, user_entity_1.User, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch('password/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "updatePassword", null);
tslib_1.__decorate([
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('/login'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Post('/forgotpassword'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
tslib_1.__decorate([
    common_1.Post('/resetpassword'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('verifyOtp'),
    tslib_1.__param(0, common_1.Param('contactNumber')), tslib_1.__param(1, common_1.Param('otp')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "verifyOtp", null);
tslib_1.__decorate([
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Get('generate-otp/:contactNumber'),
    tslib_1.__param(0, common_1.Param('contactNumber')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "generateOtp", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('addrole/:id'),
    roles_decorator_1.Roles(roles_constants_1.UserRole.ADMIN),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "addRole", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('add-user-to-organization/:id'),
    roles_decorator_1.Roles(roles_constants_1.UserRole.ADMIN),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, user_entity_1.User, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "addUserToOrganization", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
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
], UserController.prototype, "uploadUsers", null);
tslib_1.__decorate([
    common_1.Get('update-unimove'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateUserRoles", null);
tslib_1.__decorate([
    common_1.Get('get-user-count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getUserCount", null);
tslib_1.__decorate([
    common_1.Get('gph'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getGraph", null);
tslib_1.__decorate([
    common_1.Get('gph2'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getGraph2", null);
tslib_1.__decorate([
    common_1.Get('zohoTest'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "zohoTest", null);
tslib_1.__decorate([
    common_1.Post('Send-Mail-All-Users'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "sendMailWithTemplate", null);
tslib_1.__decorate([
    common_1.Get('Fix-all-User-Old-Data'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateOldData", null);
tslib_1.__decorate([
    common_1.Get('Fix-all-User-Organizations-Data'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateOldOrganizationsData", null);
tslib_1.__decorate([
    common_1.Post('all-User-Data-update'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateAllData", null);
tslib_1.__decorate([
    common_1.Post('One-User-Data-update/:email'),
    tslib_1.__param(0, common_1.Param('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateOneUserData", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('addNewOrganization'),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "addNewOrganization", null);
tslib_1.__decorate([
    common_1.Get('allUsers'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "allUsers", null);
tslib_1.__decorate([
    common_1.Get('organizationUsers'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "allOrgUsers", null);
tslib_1.__decorate([
    common_1.Get('companyUsers'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "companyUsers", null);
tslib_1.__decorate([
    common_1.Get('entityUsers'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "entityUsers", null);
tslib_1.__decorate([
    common_1.Post('organizationSwitch/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "organizationswitch", null);
tslib_1.__decorate([
    common_1.Post('companySwitch/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "companySwitch", null);
tslib_1.__decorate([
    common_1.Post('entitySwitch/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "entityswitch", null);
tslib_1.__decorate([
    common_1.Post('roleSwitch/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')), tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "adminLevel", null);
tslib_1.__decorate([
    common_1.Post('userRoleSwitch/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')), tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "userroleswichapi", null);
tslib_1.__decorate([
    common_1.Post("addingUsers/:id"),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "addingUsers", null);
tslib_1.__decorate([
    common_1.Delete('removeUser/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "removingUser", null);
tslib_1.__decorate([
    common_1.Post('inviteUser/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "inviteUser", null);
tslib_1.__decorate([
    common_1.Post('transferOrganization/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')), tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "transferUserData", null);
tslib_1.__decorate([
    common_1.Post('inviteToProdo'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "invitation", null);
tslib_1.__decorate([
    common_1.Post('acceptInviteToProdo'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "inviteAccept", null);
tslib_1.__decorate([
    common_1.Post('acceptInviteExistingUser'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "inviteAcceptuser", null);
UserController = tslib_1.__decorate([
    common_1.Controller('users'),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService, authentication_service_1.AuthenticationService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map