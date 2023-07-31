"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
exports.Roles = (...roles) => common_1.SetMetadata(exports.ROLES_KEY, roles);
//# sourceMappingURL=roles.decorator.js.map