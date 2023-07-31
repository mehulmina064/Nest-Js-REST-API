"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let IJwtAuthGuard = class IJwtAuthGuard extends passport_1.AuthGuard('internalJwt') {
};
IJwtAuthGuard = tslib_1.__decorate([
    common_1.Injectable()
], IJwtAuthGuard);
exports.IJwtAuthGuard = IJwtAuthGuard;
//# sourceMappingURL=internal-jwt-auth.guard.js.map