"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let IJwtStrategy = class IJwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy, 'internalJwt') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
    }
    validate(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return { id: payload.id, roles: payload.roles, zohoUserId: payload.zohoUserId, status: payload.status };
        });
    }
};
IJwtStrategy = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], IJwtStrategy);
exports.IJwtStrategy = IJwtStrategy;
//# sourceMappingURL=internal-jwt.strategy.js.map