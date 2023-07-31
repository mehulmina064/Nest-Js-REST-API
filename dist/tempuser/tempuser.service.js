"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const CryptoJS = require("crypto-js");
const tempuser_entity_1 = require("./tempuser.entity");
const roles_constants_1 = require("../users/roles.constants");
let TempuserService = class TempuserService {
    constructor(tempUserRepository) {
        this.tempUserRepository = tempUserRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invites = yield this.tempUserRepository.find();
            if (!invites) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "ivite does not exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            else if (invites) {
                return { statusCode: 200, message: "All the invites", invites: invites };
            }
            return { statusCode: 400, message: "Uncaught Error" };
        });
    }
    findUserInvites(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invites = yield this.tempUserRepository.find({ userId: `${user.id}` });
            if (!invites) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "ivite does not exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            else if (invites) {
                return { statusCode: 200, message: "All the invites for the user", invites: invites };
            }
            return { statusCode: 400, message: "Uncaught Error" };
        });
    }
    newInvitesave(data, adminuser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tempObject = new tempuser_entity_1.Tempuser();
            tempObject.orgRole = data.role;
            tempObject.orgId = data.id;
            tempObject.orgIds.push(data.id);
            tempObject.orgIdRoles.push({ id: data.id, role: data.role });
            tempObject.name = data.name;
            tempObject.email = data.email;
            tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
            tempObject.status = "INACTIVE";
            tempObject.sentByid = adminuser.id;
            return yield this.tempUserRepository.save(tempObject);
        });
    }
    InviteEditNewUser(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tempUser = yield this.tempUserRepository.findOne(id);
            if (!tempUser || tempUser.status == "ACTIVE") {
                console.log("throw exception that the ");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "invittation does not exist or there is no need for the invite",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            tempUser.status = "ACTIVE";
            yield this.tempUserRepository.update(tempUser.id, tempUser);
            return tempUser;
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.tempUserRepository.findOne(String(id));
        });
    }
    remove(id, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let inviteDetails = yield this.tempUserRepository.findOne(id);
            if (!inviteDetails || inviteDetails.status == "ACTIVE") {
                console.log("throw exception that the invite does not exists");
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invite Does Not Exists",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            if (inviteDetails.sentByid == user.id) {
                console.log("now only deletion of invite is possible");
                yield this.tempUserRepository.delete(inviteDetails.id);
                return { statusCode: 200, message: "Invite Deleted Successfully" };
            }
            if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                console.log("he can too delete any invites");
                yield this.tempUserRepository.delete(inviteDetails.id);
                return { statusCode: 200, message: "Invite Deleted Successfully" };
            }
            return { message: "uncaught error" };
        });
    }
    existingInvite(data, adminUser, user, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "organization") {
                let tempObject = new tempuser_entity_1.Tempuser();
                tempObject.inviteType = "organization";
                tempObject.userId = user.id;
                tempObject.orgId = data.id;
                tempObject.orgIds.push(data.id);
                tempObject.orgIdRoles.push({ id: data.id, role: data.role });
                tempObject.name = data.name;
                tempObject.email = data.email;
                tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
                tempObject.status = "INACTIVE";
                tempObject.sentByid = adminUser.id;
                return yield this.tempUserRepository.save(tempObject);
            }
            if (type == "company") {
                let tempObject = new tempuser_entity_1.Tempuser();
                tempObject.userId = user.id;
                tempObject.companyRole = data.role;
                tempObject.companyId = data.id;
                tempObject.companyIds.push(data.id);
                tempObject.companyIdRoles.push({ id: data.id, role: data.role });
                tempObject.name = data.name;
                tempObject.email = data.email;
                tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
                tempObject.status = "INACTIVE";
                tempObject.sentByid = adminUser.id;
                return yield this.tempUserRepository.save(tempObject);
            }
            if (type == "entity") {
                let tempObject = new tempuser_entity_1.Tempuser();
                tempObject.inviteType = "entity";
                tempObject.userId = user.id;
                tempObject.entityRole = data.role;
                tempObject.entityId = data.id;
                tempObject.entityIds.push(data.id);
                tempObject.entityIdRoles.push({ id: data.id, role: data.role });
                tempObject.name = data.name;
                tempObject.email = data.email;
                tempObject.password = CryptoJS.HmacSHA1(data.email, 'jojo').toString();
                tempObject.status = "INACTIVE";
                tempObject.sentByid = adminUser.id;
                return yield this.tempUserRepository.save(tempObject);
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid Type Requested",
                }, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            return { message: "uncaught Error" };
        });
    }
    statusChange(tempUser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (tempUser.status == "ACTIVE") {
                tempUser.status = "INACTIVE";
            }
            if (tempUser.status == "INACTIVE") {
                tempUser.status = "ACTIVE";
            }
            yield this.tempUserRepository.update(tempUser.id, tempUser);
        });
    }
};
TempuserService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(tempuser_entity_1.Tempuser)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TempuserService);
exports.TempuserService = TempuserService;
//# sourceMappingURL=tempuser.service.js.map