"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../users/user.service");
const zohoEmployee_service_1 = require("../internal-dashboard/zohoEmployee/zohoEmployee.service");
const jwt_1 = require("@nestjs/jwt");
let AuthenticationService = class AuthenticationService {
    constructor(userService, zohoEmployeeService, jwtService) {
        this.userService = userService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.jwtService = jwtService;
    }
    validateUser(email, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.login({ email, password });
            if (user && user.status === 'success') {
                return user.user;
            }
            return null;
        });
    }
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = { id: user.id, roles: user.roles, organization_id: user.organization_id, accountId: user.accountId, territory_id: user.territory_id };
            return {
                status: 'success',
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roles: user.roles,
                    territory_id: user.territory_id,
                    organization_id: user.organization_id,
                    accountId: user.accountId,
                    status: user.status,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            };
        });
    }
    IvalidateUser(email, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.zohoEmployeeService.login({ email, password });
            if (user && user.status === 'success') {
                return user.user;
            }
            return null;
        });
    }
    Ilogin(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = { id: user.id, roles: user.roles, zohoUserId: user.zohoUserId, status: user.status };
            return {
                status: 'success',
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.name,
                    roles: user.roles,
                    zohoUserId: user.zohoUserId,
                    status: user.status,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            };
        });
    }
};
AuthenticationService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService, zohoEmployee_service_1.zohoEmployeeService, jwt_1.JwtService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map