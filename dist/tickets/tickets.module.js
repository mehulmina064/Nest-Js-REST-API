"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const tickets_controller_1 = require("./tickets.controller");
const user_module_1 = require("./../users/user.module");
const token_entity_1 = require("./../sms/token.entity");
const typeorm_1 = require("@nestjs/typeorm");
let TicketsModule = class TicketsModule {
};
TicketsModule = tslib_1.__decorate([
    common_1.Module({
        imports: [user_module_1.UserModule, common_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.zohoToken])
        ],
        controllers: [tickets_controller_1.TicketsController],
        providers: [tickets_service_1.TicketsService],
        exports: [tickets_service_1.TicketsService]
    })
], TicketsModule);
exports.TicketsModule = TicketsModule;
//# sourceMappingURL=tickets.module.js.map