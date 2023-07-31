"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const roles = this.reflector.getAllAndMerge('roles', [
                context.getClass(),
                context.getHandler(),
            ]) || [];
            const isPublic = this.reflector.getAllAndOverride('public', [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!roles || isPublic) {
                return true;
            }
            let isAllowed = false;
            roles.forEach(role => {
                if ((context.switchToHttp().getRequest().request.user.roles & role) === role) {
                    isAllowed = true;
                }
            });
            return isAllowed;
        });
    }
};
RolesGuard = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map