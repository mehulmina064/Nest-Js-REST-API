"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("./roles.guard");
function Auth(...roles) {
    return common_1.applyDecorators(common_1.SetMetadata('roles', roles), common_1.UseGuards(passport_1.AuthGuard, roles_guard_1.RolesGuard), common_1.UseGuards(passport_1.AuthGuard, jwt_auth_guard_1.JwtAuthGuard), swagger_1.ApiBearerAuth(), swagger_1.ApiUnauthorizedResponse({ description: 'Unauthorized' }));
}
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map