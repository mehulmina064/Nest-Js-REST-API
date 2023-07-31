"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let ILocalAuthGuard = class ILocalAuthGuard extends passport_1.AuthGuard('internal') {
};
ILocalAuthGuard = tslib_1.__decorate([
    common_1.Injectable()
], ILocalAuthGuard);
exports.ILocalAuthGuard = ILocalAuthGuard;
//# sourceMappingURL=internal-local-auth.guard.js.map