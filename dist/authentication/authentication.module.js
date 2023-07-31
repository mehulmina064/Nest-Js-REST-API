"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./local.strategy");
const internal_local_strategy_1 = require("./internal-local.strategy");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
const jwt_strategy_1 = require("./jwt.strategy");
const internal_jwt_strategy_1 = require("./internal-jwt.strategy");
const user_module_1 = require("../users/user.module");
const roles_guard_1 = require("./roles.guard");
let AuthenticationModule = class AuthenticationModule {
};
AuthenticationModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => user_module_1.UserModule),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '7d' },
            }),
        ],
        providers: [authentication_service_1.AuthenticationService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, internal_local_strategy_1.ILocalStrategy, internal_jwt_strategy_1.IJwtStrategy, {
                provide: 'AUTH_GUARD',
                useClass: roles_guard_1.RolesGuard,
            }],
        exports: [authentication_service_1.AuthenticationService],
    })
], AuthenticationModule);
exports.AuthenticationModule = AuthenticationModule;
//# sourceMappingURL=authentication.module.js.map