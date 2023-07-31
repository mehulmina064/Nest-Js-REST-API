"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tempuser_service_1 = require("./tempuser.service");
const tempuser_controller_1 = require("./tempuser.controller");
const tempuser_entity_1 = require("./tempuser.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
let TempuserModule = class TempuserModule {
};
TempuserModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [tempuser_controller_1.TempuserController],
        providers: [tempuser_service_1.TempuserService],
        imports: [typeorm_1.TypeOrmModule.forFeature([tempuser_entity_1.Tempuser, user_entity_1.User])],
        exports: [tempuser_service_1.TempuserService]
    })
], TempuserModule);
exports.TempuserModule = TempuserModule;
//# sourceMappingURL=tempuser.module.js.map