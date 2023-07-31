"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const rolesPermission_service_1 = require("../prodoPermissionAndGroup/rolesPermission.service");
const userRoles_service_1 = require("../prodoRoles/userRoles.service");
const moduleNames_constant_1 = require("../prodoPermissionAndGroup/moduleNames.constant");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const prodoPermission_service_1 = require("../prodoPermissionAndGroup/prodoPermission.service");
var ObjectId = require('mongodb').ObjectID;
let roleMiddleware = class roleMiddleware {
    constructor(zohoEmployeeService, rolesPermissionGroupService, userRolesService, prodoPermissionService) {
        this.zohoEmployeeService = zohoEmployeeService;
        this.rolesPermissionGroupService = rolesPermissionGroupService;
        this.userRolesService = userRolesService;
        this.prodoPermissionService = prodoPermissionService;
    }
    use(req, res, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const authHeaders = req.headers.authorization;
            if (authHeaders && authHeaders.split(' ')[1]) {
                const token = authHeaders.split(' ')[1];
                let decoded1;
                jwt.verify(token, 'prodoadminsecret', function (err, decoded) {
                    if (err) {
                        throw new http_exception_1.HttpException("Token Expired Please log in Again or contact admin for new", common_1.HttpStatus.BAD_REQUEST);
                    }
                    else {
                        decoded1 = decoded;
                    }
                });
                const user = yield this.zohoEmployeeService.findOne(decoded1.id);
                if (!user) {
                    throw new http_exception_1.HttpException({
                        status: common_1.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "User Not Found",
                    }, common_1.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("the user is prodo admin therefore has all the permissions");
                    next();
                }
                else {
                    let query = { where: { userId: String(user.id) } };
                    let alluserroles = yield this.userRolesService.findAll(query);
                    let roleIds = [];
                    let requestMethod = req.method;
                    for (let i of alluserroles.data) {
                        roleIds.push({ roleId: i.roleId });
                    }
                    let result = yield this.rolesPermissionGroupService.findAll({ where: { $or: roleIds } });
                    let pgIds = [];
                    let moduleName = (req.url.split('/'))[2];
                    if (moduleName == "zohoData") {
                        moduleName = (req.url.split('/'))[3];
                    }
                    if (moduleName.split('?').length > 1) {
                        moduleName = moduleName.split('?')[0];
                    }
                    console.log(moduleName);
                    let fullaccesscheck, result1;
                    switch (moduleName) {
                        case 'employee':
                            moduleName = moduleNames_constant_1.ModuleNames.Employee;
                            break;
                        case 'batch':
                            moduleName = moduleNames_constant_1.ModuleNames.Batch;
                            break;
                        case 'roles':
                            moduleName = moduleNames_constant_1.ModuleNames.Role;
                            break;
                        case 'so':
                            moduleName = moduleNames_constant_1.ModuleNames.SalesOrder;
                            break;
                        case 'po':
                            moduleName = moduleNames_constant_1.ModuleNames.PurchaseOrder;
                            break;
                        case 'invoice':
                            moduleName = moduleNames_constant_1.ModuleNames.Invoice;
                            break;
                        case 'InvoicePod':
                            moduleName = moduleNames_constant_1.ModuleNames.InvoicePod;
                            break;
                        case 'teams':
                            moduleName = moduleNames_constant_1.ModuleNames.Team;
                            break;
                        case 'userRoles':
                            moduleName = moduleNames_constant_1.ModuleNames.UserRole;
                            break;
                        case 'rolePermission':
                            moduleName = moduleNames_constant_1.ModuleNames.RolePermission;
                            break;
                        case 'bills':
                            moduleName = moduleNames_constant_1.ModuleNames.Bill;
                            break;
                        case 'customers':
                            moduleName = moduleNames_constant_1.ModuleNames.Customer;
                            break;
                        case 'products':
                            moduleName = moduleNames_constant_1.ModuleNames.Product;
                            break;
                        case 'rfq':
                            moduleName = moduleNames_constant_1.ModuleNames.Rfq;
                            break;
                        case 'mail':
                            moduleName = moduleNames_constant_1.ModuleNames.Mail;
                            break;
                        case 'whatsapp':
                            moduleName = moduleNames_constant_1.ModuleNames.Whatsapp;
                            break;
                        case 'organization':
                            moduleName = moduleNames_constant_1.ModuleNames.Organization;
                            break;
                        case 'company':
                            moduleName = moduleNames_constant_1.ModuleNames.Company;
                            break;
                        case 'entity':
                            moduleName = moduleNames_constant_1.ModuleNames.Entity;
                            break;
                        case 'parentSku':
                            moduleName = moduleNames_constant_1.ModuleNames.ParentSku;
                            break;
                        case 'users':
                            moduleName = moduleNames_constant_1.ModuleNames.User;
                            break;
                        case 'batchItem':
                            moduleName = moduleNames_constant_1.ModuleNames.BatchItem;
                            break;
                        case 'batchItemProcess':
                            moduleName = moduleNames_constant_1.ModuleNames.BatchItemProcess;
                            break;
                        default:
                            throw new http_exception_1.HttpException('Contact Admin for the Module- ' + moduleName, common_1.HttpStatus.NOT_IMPLEMENTED);
                            break;
                    }
                    switch (requestMethod) {
                        case 'GET':
                            for (let i of result.data) {
                                pgIds.push({ _id: ObjectId(i.permissionGroupId) });
                            }
                            fullaccesscheck = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.fullAccess": true }] } });
                            if (fullaccesscheck.count) {
                                console.log("full access for the module detected");
                                next();
                                break;
                            }
                            result1 = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.canView": true }] } });
                            if (result1.count) {
                                console.log("have perm..");
                                next();
                            }
                            else {
                                throw new http_exception_1.HttpException('Insufficent Permissions for the Module- ' + moduleName, common_1.HttpStatus.UNAUTHORIZED);
                            }
                            break;
                        case 'POST':
                            for (let i of result.data) {
                                pgIds.push({ _id: ObjectId(i.permissionGroupId) });
                            }
                            fullaccesscheck = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.fullAccess": true }] } });
                            if (fullaccesscheck.count) {
                                console.log("full access for the module detected");
                                next();
                                break;
                            }
                            result1 = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.canCreate": true }] } });
                            if (result1.count) {
                                console.log("have perm..");
                                next();
                            }
                            else {
                                throw new http_exception_1.HttpException('Insufficent Permissions for the Module- ' + moduleName, common_1.HttpStatus.UNAUTHORIZED);
                            }
                            break;
                        case 'PATCH':
                            for (let i of result.data) {
                                pgIds.push({ _id: ObjectId(i.permissionGroupId) });
                            }
                            fullaccesscheck = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.fullAccess": true }] } });
                            if (fullaccesscheck.count) {
                                console.log("full access for the module detected");
                                next();
                                break;
                            }
                            result1 = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.canEdit": true }] } });
                            if (result1.count) {
                                console.log("have perm..");
                                next();
                            }
                            else {
                                throw new http_exception_1.HttpException('Insufficent Permissions for the Module- ' + moduleName, common_1.HttpStatus.UNAUTHORIZED);
                            }
                            break;
                        case 'DELETE':
                            for (let i of result.data) {
                                pgIds.push({ _id: ObjectId(i.permissionGroupId) });
                            }
                            fullaccesscheck = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.fullAccess": true }] } });
                            if (fullaccesscheck.count) {
                                console.log("full access for the module detected");
                                next();
                                break;
                            }
                            result1 = yield this.prodoPermissionService.findAll({ where: { $or: [...pgIds], $and: [{ "permissions.moduleName": moduleName }, { "permissions.canDelete": true }] } });
                            if (result1.count) {
                                console.log("have perm..");
                                next();
                            }
                            else {
                                throw new http_exception_1.HttpException('Insufficent Permissions for the Module- ' + moduleName, common_1.HttpStatus.UNAUTHORIZED);
                            }
                            break;
                        default:
                            throw new http_exception_1.HttpException('Contact Admin for the Module- ' + moduleName, common_1.HttpStatus.NOT_IMPLEMENTED);
                            break;
                    }
                }
            }
            else {
                throw new http_exception_1.HttpException('Access Token Required', common_1.HttpStatus.PROXY_AUTHENTICATION_REQUIRED);
            }
        });
    }
};
roleMiddleware = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [zohoEmployee_service_1.zohoEmployeeService,
        rolesPermission_service_1.rolesPermissionGroupService,
        userRoles_service_1.userRolesService,
        prodoPermission_service_1.prodoPermissionService])
], roleMiddleware);
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=middleware.js.map